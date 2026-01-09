import React, { useState, useEffect } from 'react';
import {
    FiUser,
    FiSave,
    FiClipboard,
    FiClock,
    FiArrowLeft,
    FiPlay,
    FiPlus,
    FiDollarSign,
    FiTrash2,
    FiRefreshCw,
} from 'react-icons/fi';
import { FaPills } from 'react-icons/fa';
import Modal from '../../components/ui/Modal';
import {
    getQueue,
    startExam,
    createExamination,
    getPrescriptionTemplates,
    getMedicines,
    CreateExaminationRequest,
    MedicineCatalogItem,
    PrescriptionTemplate as ApiPrescriptionTemplate,
} from '@/services/apiDoctor';

type Patient = {
    id: string;
    appointmentId: string;
    patientId: string | null;
    name: string;
    phone: string;
    service: string;
    serviceId: string | null;
    time: string;
    status: string;
};

// No more mock data - will be fetched from API

// Tooth status types
type ToothStatus =
    | 'normal'
    | 'cavity'
    | 'missing'
    | 'treated'
    | 'crown'
    | 'nextTreatment';

const toothStatusConfig: Record<
    ToothStatus,
    { label: string; color: string; border: string }
> = {
    normal: {
        label: 'Bình thường',
        color: 'bg-emerald-400',
        border: 'border-emerald-500',
    },
    cavity: {
        label: 'Sâu răng',
        color: 'bg-red-400',
        border: 'border-red-500',
    },
    missing: {
        label: 'Mất răng',
        color: 'bg-blue-400',
        border: 'border-blue-500',
    },
    treated: {
        label: 'Điều trị',
        color: 'bg-amber-400',
        border: 'border-amber-500',
    },
    crown: {
        label: 'Răng sứ',
        color: 'bg-slate-400',
        border: 'border-slate-500',
    },
    nextTreatment: {
        label: 'Điều trị kế tiếp',
        color: 'bg-purple-400',
        border: 'border-purple-500',
    },
};

// Adult teeth numbers
const adultUpperTeeth = [
    18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28,
];
const adultLowerTeeth = [
    48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38,
];

// Child teeth numbers
const childUpperTeeth = [55, 54, 53, 52, 51, 61, 62, 63, 64, 65];
const childLowerTeeth = [85, 84, 83, 82, 81, 71, 72, 73, 74, 75];

// Medicine type
type Medicine = {
    id: number;
    medicineId: string; // GUID from medicine catalog, empty GUID for free-text
    name: string;
    dosage: string;
    quantity: string;
    instructions: string;
};

// Tooth component
const ToothButton: React.FC<{
    number: number;
    status?: ToothStatus;
    onClick: () => void;
    isUpper: boolean;
}> = ({ number, status, onClick, isUpper }) => {
    const config = status ? toothStatusConfig[status] : null;

    return (
        <button
            onClick={onClick}
            className="group flex flex-col items-center"
            title={`Răng số ${number}${
                status ? ` - ${toothStatusConfig[status].label}` : ''
            }`}
        >
            {isUpper && (
                <span className="text-[9px] text-slate-500 mb-0.5">
                    {number}
                </span>
            )}
            <div
                className={`
                    w-6 h-7 relative flex items-center justify-center
                    transition-all duration-150 group-hover:scale-110
                    ${
                        isUpper
                            ? 'rounded-t-lg rounded-b-md'
                            : 'rounded-b-lg rounded-t-md'
                    }
                    ${
                        config
                            ? `${config.color} border-2 ${config.border}`
                            : 'bg-white border-2 border-slate-300 group-hover:border-slate-400'
                    }
                `}
            >
                <div
                    className={`absolute ${
                        isUpper ? 'bottom-0' : 'top-0'
                    } left-1/2 -translate-x-1/2 w-0.5 h-1.5 ${
                        config ? 'bg-white/50' : 'bg-slate-200'
                    }`}
                />
            </div>
            {!isUpper && (
                <span className="text-[9px] text-slate-500 mt-0.5">
                    {number}
                </span>
            )}
        </button>
    );
};

// Prescription Modal Props
type PrescriptionModalProps = {
    open: boolean;
    onClose: () => void;
    medicines: Medicine[];
    onSave: (medicines: Medicine[], notes: string) => void;
    patientName: string;
    templates: ApiPrescriptionTemplate[]; // From API
    medicineCatalog: MedicineCatalogItem[]; // From API
};

// Prescription Templates (now from API, not hardcoded)

const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
    open,
    onClose,
    medicines: initialMedicines,
    onSave,
    patientName,
    templates,
    medicineCatalog,
}) => {
    const [medicines, setMedicines] = useState<Medicine[]>(
        initialMedicines.length > 0
            ? initialMedicines
            : [
                  {
                      id: 1,
                      medicineId: '00000000-0000-0000-0000-000000000000',
                      name: '',
                      dosage: '',
                      quantity: '',
                      instructions: '',
                  },
              ]
    );
    const [prescriptionNotes, setPrescriptionNotes] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('');

    const applyTemplate = (templateId: string) => {
        const template = templates.find((t) => t.id === templateId);
        if (template) {
            const newMedicines = template.medicines.map((m, i) => ({
                id: Date.now() + i,
                medicineId: m.medicineId,
                name: m.name,
                dosage: m.dosage,
                quantity: m.quantity,
                instructions: m.instructions,
            }));
            setMedicines(newMedicines);
            setPrescriptionNotes(template.notes || '');
            setSelectedTemplate(templateId);
        }
    };

    const addMedicine = () => {
        setMedicines([
            ...medicines,
            {
                id: Date.now(),
                medicineId: '00000000-0000-0000-0000-000000000000',
                name: '',
                dosage: '',
                quantity: '',
                instructions: '',
            },
        ]);
    };

    const removeMedicine = (id: number) => {
        if (medicines.length > 1) {
            setMedicines(medicines.filter((m) => m.id !== id));
        }
    };

    const updateMedicine = (
        id: number,
        field: keyof Medicine,
        value: string
    ) => {
        setMedicines(
            medicines.map((m) => {
                if (m.id === id) {
                    const updated = { ...m, [field]: value };

                    // If name is being updated, try to match with catalog
                    if (field === 'name') {
                        const found = medicineCatalog.find(
                            (c) => c.name === value
                        );
                        updated.medicineId = found
                            ? found.medicineId
                            : '00000000-0000-0000-0000-000000000000';
                        if (found) {
                            updated.dosage = found.unit; // Suggest unit/dosage
                        }
                    }

                    return updated;
                }
                return m;
            })
        );
    };

    const handleKeyDown = (
        e: React.KeyboardEvent,
        _medicineId: number,
        isLastField: boolean,
        isLastRow: boolean
    ) => {
        if (e.key === 'Enter' && isLastField && isLastRow) {
            e.preventDefault();
            addMedicine();
        }
    };

    const handleSave = () => {
        const validMedicines = medicines.filter((m) => m.name.trim() !== '');
        onSave(validMedicines, prescriptionNotes);
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Kê đơn thuốc"
            className="max-w-3xl w-[95vw]"
        >
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Patient Info */}
                <div className="bg-blue-50 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FaPills className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">
                                Kê đơn cho bệnh nhân
                            </p>
                            <p className="text-sm font-semibold text-slate-900">
                                {patientName}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Template Selection */}
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                    <label className="block text-xs font-medium text-amber-800 mb-2">
                        ⚡ Chọn mẫu đơn thuốc nhanh ({templates.length})
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {templates.length > 0 ? (
                            templates.map((template) => (
                                <button
                                    key={template.id}
                                    onClick={() => applyTemplate(template.id)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
                                        selectedTemplate === template.id
                                            ? 'bg-amber-500 text-white border-amber-500'
                                            : 'bg-white text-amber-700 border-amber-200 hover:border-amber-400'
                                    }`}
                                >
                                    {template.name}
                                </button>
                            ))
                        ) : (
                            <span className="text-xs text-amber-600 italic">
                                Chưa có mẫu nào
                            </span>
                        )}
                    </div>
                </div>

                {/* Table Entry */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-semibold text-slate-700">
                            Danh sách thuốc (
                            {medicines.filter((m) => m.name).length})
                        </h4>
                        <button
                            onClick={addMedicine}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                        >
                            <FiPlus className="w-3 h-3" />
                            Thêm dòng
                        </button>
                    </div>

                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="text-left text-[10px] font-semibold text-slate-600 px-2 py-2 w-[25%]">
                                        Tên thuốc *
                                    </th>
                                    <th className="text-left text-[10px] font-semibold text-slate-600 px-2 py-2 w-[15%]">
                                        Liều lượng
                                    </th>
                                    <th className="text-left text-[10px] font-semibold text-slate-600 px-2 py-2 w-[15%]">
                                        Số lượng
                                    </th>
                                    <th className="text-left text-[10px] font-semibold text-slate-600 px-2 py-2 w-[35%]">
                                        Cách dùng
                                    </th>
                                    <th className="w-[10%]"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {medicines.map((medicine, index) => {
                                    const isLastRow =
                                        index === medicines.length - 1;
                                    return (
                                        <tr
                                            key={medicine.id}
                                            className="border-t border-slate-100 hover:bg-slate-50"
                                        >
                                            <td className="px-1 py-1 relative group">
                                                <input
                                                    type="text"
                                                    placeholder="Nhập tên thuốc"
                                                    className="w-full px-2 py-1.5 text-xs border-0 bg-transparent focus:bg-white focus:ring-1 focus:ring-blue-500 rounded outline-none"
                                                    value={medicine.name}
                                                    onChange={(e) =>
                                                        updateMedicine(
                                                            medicine.id,
                                                            'name',
                                                            e.target.value
                                                        )
                                                    }
                                                    list={`medicines-list-${medicine.id}`}
                                                />
                                                <datalist
                                                    id={`medicines-list-${medicine.id}`}
                                                >
                                                    {medicineCatalog.map(
                                                        (item) => (
                                                            <option
                                                                key={
                                                                    item.medicineId
                                                                }
                                                                value={
                                                                    item.name
                                                                }
                                                            >
                                                                {item.unit} -{' '}
                                                                {item.price.toLocaleString()}
                                                                đ
                                                            </option>
                                                        )
                                                    )}
                                                </datalist>
                                                {medicine.medicineId !==
                                                    '00000000-0000-0000-0000-000000000000' && (
                                                    <span className="absolute right-2 top-2 text-[10px] text-green-600 bg-green-50 px-1 rounded">
                                                        Catalog
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-1 py-1">
                                                <input
                                                    type="text"
                                                    placeholder="500mg"
                                                    className="w-full px-2 py-1.5 text-xs border-0 bg-transparent focus:bg-white focus:ring-1 focus:ring-blue-500 rounded outline-none"
                                                    value={medicine.dosage}
                                                    onChange={(e) =>
                                                        updateMedicine(
                                                            medicine.id,
                                                            'dosage',
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td className="px-1 py-1">
                                                <input
                                                    type="text"
                                                    placeholder="20 viên"
                                                    className="w-full px-2 py-1.5 text-xs border-0 bg-transparent focus:bg-white focus:ring-1 focus:ring-blue-500 rounded outline-none"
                                                    value={medicine.quantity}
                                                    onChange={(e) =>
                                                        updateMedicine(
                                                            medicine.id,
                                                            'quantity',
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td className="px-1 py-1">
                                                <input
                                                    type="text"
                                                    placeholder="2 viên/ngày sau ăn"
                                                    className="w-full px-2 py-1.5 text-xs border-0 bg-transparent focus:bg-white focus:ring-1 focus:ring-blue-500 rounded outline-none"
                                                    value={
                                                        medicine.instructions
                                                    }
                                                    onChange={(e) =>
                                                        updateMedicine(
                                                            medicine.id,
                                                            'instructions',
                                                            e.target.value
                                                        )
                                                    }
                                                    onKeyDown={(e) =>
                                                        handleKeyDown(
                                                            e,
                                                            medicine.id,
                                                            true,
                                                            isLastRow
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td className="px-1 py-1 text-center">
                                                {medicines.length > 1 && (
                                                    <button
                                                        onClick={() =>
                                                            removeMedicine(
                                                                medicine.id
                                                            )
                                                        }
                                                        className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                    >
                                                        <FiTrash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                        💡 Nhấn Enter ở ô cuối để thêm dòng mới. Tab để di
                        chuyển giữa các ô.
                    </p>
                </div>

                {/* Notes */}
                <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                        Lời dặn / Ghi chú
                    </label>
                    <textarea
                        rows={2}
                        placeholder="Lời dặn cho bệnh nhân về cách dùng thuốc..."
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-blue-500 outline-none resize-none"
                        value={prescriptionNotes}
                        onChange={(e) => setPrescriptionNotes(e.target.value)}
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-3 mt-3 border-t border-slate-100">
                <button
                    onClick={onClose}
                    className="flex-1 px-3 py-2 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50"
                >
                    Huỷ
                </button>
                <button
                    onClick={handleSave}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 flex items-center justify-center gap-1.5"
                >
                    <FiSave className="w-3.5 h-3.5" />
                    Lưu đơn thuốc
                </button>
            </div>
        </Modal>
    );
};

// Main Component
const DoctorTreatment: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    // Prescription Templates & Medicine Catalog from API
    const [templates, setTemplates] = useState<ApiPrescriptionTemplate[]>([]);
    const [medicineCatalog, setMedicineCatalog] = useState<
        MedicineCatalogItem[]
    >([]);

    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(
        null
    );
    const [teethType, setTeethType] = useState<'adult' | 'child'>('adult');
    const [selectedTeeth, setSelectedTeeth] = useState<
        Record<number, ToothStatus>
    >({});
    const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [formData, setFormData] = useState({
        reason: '',
        diagnosis: '',
        treatment: '',
        prescriptionNotes: '',
        notes: '',
        followUpDate: '',
    });

    const fetchQueue = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getQueue();
            if (response.isSuccess && response.data) {
                const mappedPatients: Patient[] = response.data
                    .filter(
                        (q) =>
                            q.status === 'confirmed' ||
                            q.status === 'checkedin' ||
                            q.status === 'inprogress'
                    )
                    .map((q) => ({
                        id: q.id,
                        appointmentId: q.appointmentId,
                        patientId: q.patientId,
                        name: q.patientName,
                        phone: q.patientPhone,
                        service: q.service,
                        serviceId: q.serviceId,
                        time: new Date(q.scheduledTime).toLocaleTimeString(
                            'vi-VN',
                            { hour: '2-digit', minute: '2-digit' }
                        ),
                        status: q.status,
                    }));
                setPatients(mappedPatients);
            } else {
                setError(response.message || 'Không thể tải hàng đợi');
            }
        } catch (err) {
            console.error('Error fetching queue:', err);
            setError('Lỗi kết nối server');
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async () => {
        try {
            const [templatesRes, medicinesRes] = await Promise.all([
                getPrescriptionTemplates(),
                getMedicines(),
            ]);

            if (templatesRes.isSuccess && templatesRes.data) {
                setTemplates(templatesRes.data);
            }
            if (medicinesRes.isSuccess && medicinesRes.data) {
                setMedicineCatalog(medicinesRes.data);
            }
        } catch (err) {
            console.error('Error fetching prescription data:', err);
        }
    };

    useEffect(() => {
        fetchQueue();
        fetchData(); // Fetch templates and medicine catalog
    }, []);

    const handleStartExam = async (patient: Patient) => {
        // If already in progress, just open exam form without calling API
        if (patient.status === 'inprogress') {
            setSelectedPatient(patient);
            setFormData({
                reason: '',
                diagnosis: '',
                treatment: '',
                prescriptionNotes: '',
                notes: '',
                followUpDate: '',
            });
            setSelectedTeeth({});
            setMedicines([]);
            return;
        }

        // For confirmed/checkedin, call startExam API first
        try {
            setActionLoading(true);
            const response = await startExam(patient.appointmentId);
            if (response.isSuccess) {
                setSelectedPatient(patient);
                setFormData({
                    reason: '',
                    diagnosis: '',
                    treatment: '',
                    prescriptionNotes: '',
                    notes: '',
                    followUpDate: '',
                });
                setSelectedTeeth({});
                setMedicines([]);
            } else {
                alert(response.message || 'Không thể bắt đầu khám');
            }
        } catch (err) {
            console.error('Error starting exam:', err);
            alert('Lỗi kết nối server');
        } finally {
            setActionLoading(false);
        }
    };

    const handleBack = () => {
        setSelectedPatient(null);
        fetchQueue(); // Refresh queue when going back
    };

    const handleToothClick = (toothNumber: number) => {
        const currentStatus = selectedTeeth[toothNumber];
        const statuses: ToothStatus[] = [
            'normal',
            'cavity',
            'missing',
            'treated',
            'crown',
            'nextTreatment',
        ];
        const currentIndex = currentStatus
            ? statuses.indexOf(currentStatus)
            : -1;
        const nextIndex = (currentIndex + 1) % statuses.length;

        if (currentIndex === statuses.length - 1) {
            const newTeeth = { ...selectedTeeth };
            delete newTeeth[toothNumber];
            setSelectedTeeth(newTeeth);
        } else {
            setSelectedTeeth({
                ...selectedTeeth,
                [toothNumber]: statuses[nextIndex],
            });
        }
    };

    const handleSavePrescription = (
        newMedicines: Medicine[],
        notes: string
    ) => {
        setMedicines(newMedicines);
        setFormData({ ...formData, prescriptionNotes: notes });
    };

    const handleSave = async (createBill: boolean = false) => {
        if (!formData.diagnosis || !formData.treatment) {
            alert('Vui lòng nhập chẩn đoán và phương pháp điều trị!');
            return;
        }

        if (!selectedPatient?.patientId) {
            alert('Không tìm thấy thông tin bệnh nhân!');
            return;
        }

        try {
            setActionLoading(true);

            // Convert tooth status for API
            const toothStatusForApi: Record<string, string> = {};
            Object.entries(selectedTeeth).forEach(([tooth, status]) => {
                toothStatusForApi[`T${tooth}`] = status;
            });

            const request: CreateExaminationRequest = {
                appointmentId: selectedPatient.appointmentId,
                patientId: selectedPatient.patientId,
                title: selectedPatient.service,
                diagnosis: formData.diagnosis,
                treatment: formData.treatment,
                toothStatus:
                    Object.keys(toothStatusForApi).length > 0
                        ? toothStatusForApi
                        : undefined,
                prescription:
                    medicines.length > 0
                        ? {
                              medicines: medicines.map((m) => ({
                                  medicineId: m.medicineId, // Now uses actual ID from catalog or empty GUID for free-text
                                  name: m.name,
                                  dosage: m.dosage,
                                  quantity: m.quantity,
                                  instructions: m.instructions,
                              })),
                              notes: formData.prescriptionNotes,
                          }
                        : undefined,
                notes: formData.notes || undefined,
                createBill: createBill,
                serviceIds:
                    createBill && selectedPatient.serviceId
                        ? [selectedPatient.serviceId]
                        : undefined,
            };

            const response = await createExamination(request);
            if (response.isSuccess) {
                alert(
                    createBill
                        ? 'Đã lưu phiếu khám và tạo hóa đơn!'
                        : 'Đã lưu phiếu khám thành công!'
                );
                setSelectedPatient(null);
                fetchQueue();
            } else {
                alert(response.message || 'Không thể lưu phiếu khám');
            }
        } catch (err) {
            console.error('Error saving examination:', err);
            alert('Lỗi kết nối server');
        } finally {
            setActionLoading(false);
        }
    };

    const handleCreateInvoice = () => {
        handleSave(true);
    };

    // Show patient list if no patient selected
    if (!selectedPatient) {
        if (loading) {
            return (
                <div className="px-6 py-8 lg:px-10">
                    <div className="max-w-[1000px] mx-auto flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
                            <p className="mt-4 text-slate-500">
                                Đang tải danh sách bệnh nhân...
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="px-6 py-8 lg:px-10">
                    <div className="max-w-[1000px] mx-auto">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                            <p className="text-red-600">{error}</p>
                            <button
                                onClick={fetchQueue}
                                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Thử lại
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="px-6 py-8 lg:px-10">
                <div className="max-w-[1000px] mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="inline-flex items-center rounded-full bg-[#E0ECFF] text-[#2563EB] text-[11px] font-semibold px-4 py-1.5 tracking-wide uppercase mb-3">
                                TREATMENT
                            </span>
                            <h1 className="text-xl font-semibold text-slate-900">
                                Khám bệnh
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Chọn bệnh nhân để bắt đầu khám
                            </p>
                        </div>
                        <button
                            onClick={fetchQueue}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-[#2563EB] hover:bg-blue-50 rounded-lg transition"
                        >
                            <FiRefreshCw className="w-4 h-4" />
                            Làm mới
                        </button>
                    </div>

                    {/* Waiting Patients List */}
                    {patients.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                            <FiClipboard className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-sm font-semibold text-slate-900 mb-1">
                                Không có bệnh nhân chờ khám
                            </h3>
                            <p className="text-xs text-slate-500">
                                Tất cả bệnh nhân đã được khám xong
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {patients.map((patient, index) => (
                                <div
                                    key={patient.id}
                                    className="bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between hover:shadow-md transition"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-[#E0ECFF] rounded-full flex items-center justify-center text-[#2563EB] font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                                                <FiUser className="w-5 h-5 text-slate-500" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-semibold text-slate-900">
                                                    {patient.name}
                                                </h3>
                                                <p className="text-xs text-slate-500">
                                                    {patient.service}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                            <FiClock className="w-3.5 h-3.5" />
                                            <span>{patient.time}</span>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-[10px] font-semibold ${
                                                patient.status === 'inprogress'
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : patient.status ===
                                                      'checkedin'
                                                    ? 'bg-amber-100 text-amber-700'
                                                    : 'bg-blue-100 text-blue-700'
                                            }`}
                                        >
                                            {patient.status === 'inprogress'
                                                ? 'Đang khám'
                                                : patient.status === 'checkedin'
                                                ? 'Đã check-in'
                                                : 'Đã xác nhận'}
                                        </span>
                                        <button
                                            onClick={() =>
                                                handleStartExam(patient)
                                            }
                                            disabled={actionLoading}
                                            className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white text-xs font-semibold rounded-lg hover:bg-[#1D4ED8] transition disabled:opacity-50"
                                        >
                                            {actionLoading ? (
                                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <FiPlay className="w-3.5 h-3.5" />
                                            )}
                                            {patient.status === 'inprogress'
                                                ? 'Tiếp tục khám'
                                                : 'Bắt đầu khám'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Get teeth arrays based on type
    const upperTeeth =
        teethType === 'adult' ? adultUpperTeeth : childUpperTeeth;
    const lowerTeeth =
        teethType === 'adult' ? adultLowerTeeth : childLowerTeeth;

    return (
        <div className="px-6 py-8 lg:px-10">
            <div className="max-w-[1200px] mx-auto space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <span className="inline-flex items-center rounded-full bg-[#E0ECFF] text-[#2563EB] text-[11px] font-semibold px-4 py-1.5 tracking-wide uppercase mb-2">
                            TREATMENT FORM
                        </span>
                        <h1 className="text-lg font-semibold text-slate-900">
                            Phiếu khám bệnh
                        </h1>
                        <p className="text-xs text-slate-500">
                            Ghi nhận thông tin khám và điều trị
                        </p>
                    </div>
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        Quay lại
                    </button>
                </div>

                {/* Patient Info Card */}
                <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#E0ECFF] rounded-full flex items-center justify-center text-[#2563EB] font-bold text-lg">
                        {selectedPatient.name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-slate-900">
                            {selectedPatient.name}
                        </h2>
                        <p className="text-xs text-slate-500">
                            {selectedPatient.phone} • Dịch vụ:{' '}
                            {selectedPatient.service}
                        </p>
                    </div>
                </div>

                {/* Main Content - Two Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Left: Dental Chart */}
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-slate-900">
                                Sơ đồ răng miệng
                            </h3>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => setTeethType('adult')}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                                        teethType === 'adult'
                                            ? 'bg-[#2563EB] text-white'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    Người lớn (32)
                                </button>
                                <button
                                    onClick={() => setTeethType('child')}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                                        teethType === 'child'
                                            ? 'bg-[#2563EB] text-white'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    Trẻ em (20)
                                </button>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="mb-5 p-3 bg-slate-50 rounded-lg">
                            <p className="text-[10px] font-medium text-slate-600 mb-2">
                                Chú thích: (Click vào răng để thay đổi trạng
                                thái)
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                                {Object.entries(toothStatusConfig).map(
                                    ([key, config]) => (
                                        <div
                                            key={key}
                                            className="flex items-center gap-1.5"
                                        >
                                            <div
                                                className={`w-3 h-3 rounded ${config.color}`}
                                            />
                                            <span className="text-[10px] text-slate-600">
                                                {config.label}
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Teeth Diagram */}
                        <div className="bg-gradient-to-b from-pink-50 to-white rounded-xl p-4 border border-pink-100">
                            {/* Upper Teeth */}
                            <div className="mb-2">
                                <p className="text-[10px] text-slate-500 mb-2 text-center font-medium">
                                    Hàm trên
                                </p>
                                <div className="flex justify-center gap-0.5 flex-wrap">
                                    {upperTeeth
                                        .slice(0, upperTeeth.length / 2)
                                        .map((tooth) => (
                                            <ToothButton
                                                key={tooth}
                                                number={tooth}
                                                status={selectedTeeth[tooth]}
                                                onClick={() =>
                                                    handleToothClick(tooth)
                                                }
                                                isUpper={true}
                                            />
                                        ))}
                                    <div className="w-2" />
                                    {upperTeeth
                                        .slice(upperTeeth.length / 2)
                                        .map((tooth) => (
                                            <ToothButton
                                                key={tooth}
                                                number={tooth}
                                                status={selectedTeeth[tooth]}
                                                onClick={() =>
                                                    handleToothClick(tooth)
                                                }
                                                isUpper={true}
                                            />
                                        ))}
                                </div>
                            </div>

                            {/* Divider line */}
                            <div className="flex items-center gap-2 my-3">
                                <div className="flex-1 h-px bg-pink-200" />
                                <span className="text-[9px] text-pink-400 font-medium">
                                    đường viền nướu
                                </span>
                                <div className="flex-1 h-px bg-pink-200" />
                            </div>

                            {/* Lower Teeth */}
                            <div>
                                <div className="flex justify-center gap-0.5 flex-wrap">
                                    {lowerTeeth
                                        .slice(0, lowerTeeth.length / 2)
                                        .map((tooth) => (
                                            <ToothButton
                                                key={tooth}
                                                number={tooth}
                                                status={selectedTeeth[tooth]}
                                                onClick={() =>
                                                    handleToothClick(tooth)
                                                }
                                                isUpper={false}
                                            />
                                        ))}
                                    <div className="w-2" />
                                    {lowerTeeth
                                        .slice(lowerTeeth.length / 2)
                                        .map((tooth) => (
                                            <ToothButton
                                                key={tooth}
                                                number={tooth}
                                                status={selectedTeeth[tooth]}
                                                onClick={() =>
                                                    handleToothClick(tooth)
                                                }
                                                isUpper={false}
                                            />
                                        ))}
                                </div>
                                <p className="text-[10px] text-slate-500 mt-2 text-center font-medium">
                                    Hàm dưới
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Treatment Form */}
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <h3 className="text-sm font-semibold text-slate-900 mb-4">
                            Thông tin điều trị
                        </h3>

                        <div className="space-y-4">
                            {/* Reason */}
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                                    Lý do khám
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="Nhập triệu chứng hoặc lý do khám..."
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-[#2563EB] outline-none resize-none"
                                    value={formData.reason}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            reason: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            {/* Diagnosis */}
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                                    Chẩn đoán{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="Chẩn đoán bệnh..."
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-[#2563EB] outline-none resize-none"
                                    value={formData.diagnosis}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            diagnosis: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            {/* Treatment */}
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                                    Điều trị{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="Mô tả điều trị đã thực hiện..."
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-[#2563EB] outline-none resize-none"
                                    value={formData.treatment}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            treatment: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            {/* Prescription */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-xs font-medium text-slate-700">
                                        Đơn thuốc
                                    </label>
                                    <button
                                        onClick={() =>
                                            setPrescriptionModalOpen(true)
                                        }
                                        className="flex items-center gap-1 text-xs text-[#2563EB] hover:underline"
                                    >
                                        <FiPlus className="w-3 h-3" />
                                        Kê đơn
                                    </button>
                                </div>
                                <div
                                    onClick={() =>
                                        setPrescriptionModalOpen(true)
                                    }
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm cursor-pointer hover:border-slate-300 min-h-[38px] flex items-center"
                                >
                                    {medicines.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {medicines.map((m, i) => (
                                                <span
                                                    key={i}
                                                    className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded"
                                                >
                                                    {m.name} ({m.quantity})
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-slate-400">
                                            Click để kê đơn thuốc...
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                                    Ghi chú
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ghi chú thêm, lưu ý..."
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-[#2563EB] outline-none"
                                    value={formData.notes}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            notes: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            {/* Follow-up Date */}
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                                    Ngày tái khám
                                </label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-[#2563EB] outline-none"
                                    value={formData.followUpDate}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            followUpDate: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => handleSave(false)}
                        disabled={actionLoading}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-[#1D4ED8] transition disabled:opacity-50"
                    >
                        {actionLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <FiSave className="w-4 h-4" />
                        )}
                        Hoàn thành khám
                    </button>
                    <button
                        onClick={handleCreateInvoice}
                        disabled={actionLoading}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-green-500 text-green-700 text-sm font-medium rounded-lg hover:bg-green-50 transition disabled:opacity-50"
                    >
                        <FiDollarSign className="w-4 h-4" />
                        Hoàn thành & Tạo hóa đơn
                    </button>
                </div>
            </div>

            {/* Prescription Modal */}
            <PrescriptionModal
                open={prescriptionModalOpen}
                onClose={() => setPrescriptionModalOpen(false)}
                medicines={medicines}
                onSave={handleSavePrescription}
                patientName={selectedPatient?.name || ''}
                templates={templates}
                medicineCatalog={medicineCatalog}
            />
        </div>
    );
};

export default DoctorTreatment;
