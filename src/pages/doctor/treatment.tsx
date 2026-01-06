import React, { useState } from "react";
import { FiUser, FiSave, FiClipboard, FiClock, FiArrowLeft, FiPlay, FiPlus, FiDollarSign, FiTrash2 } from "react-icons/fi";
import { FaPills } from "react-icons/fa";
import Modal from "../../components/ui/Modal";

type Patient = {
    id: number;
    name: string;
    age: number;
    gender: string;
    phone: string;
    service: string;
    time: string;
    lastVisit: string;
    status: "waiting" | "in-progress";
};

const WAITING_PATIENTS: Patient[] = [
    { id: 1, name: "Nguyễn Văn A", age: 35, gender: "Nam", phone: "0901234567", service: "Khám tổng quát", time: "08:30", lastVisit: "22/11/2024", status: "waiting" },
    { id: 2, name: "Trần Thị B", age: 28, gender: "Nữ", phone: "0912345678", service: "Trám răng", time: "09:00", lastVisit: "15/10/2024", status: "waiting" },
    { id: 3, name: "Lê Văn C", age: 45, gender: "Nam", phone: "0923456789", service: "Nhổ răng khôn", time: "09:30", lastVisit: "05/09/2024", status: "waiting" },
    { id: 4, name: "Phạm Thị D", age: 32, gender: "Nữ", phone: "0934567890", service: "Tẩy trắng răng", time: "10:00", lastVisit: "18/08/2024", status: "waiting" },
];

// Tooth status types
type ToothStatus = "normal" | "cavity" | "missing" | "treated" | "crown" | "nextTreatment";

const toothStatusConfig: Record<ToothStatus, { label: string; color: string; border: string }> = {
    normal: { label: "Bình thường", color: "bg-emerald-400", border: "border-emerald-500" },
    cavity: { label: "Sâu răng", color: "bg-red-400", border: "border-red-500" },
    missing: { label: "Mất răng", color: "bg-blue-400", border: "border-blue-500" },
    treated: { label: "Điều trị", color: "bg-amber-400", border: "border-amber-500" },
    crown: { label: "Răng sứ", color: "bg-slate-400", border: "border-slate-500" },
    nextTreatment: { label: "Điều trị kế tiếp", color: "bg-purple-400", border: "border-purple-500" },
};

// Adult teeth numbers
const adultUpperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const adultLowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

// Child teeth numbers
const childUpperTeeth = [55, 54, 53, 52, 51, 61, 62, 63, 64, 65];
const childLowerTeeth = [85, 84, 83, 82, 81, 71, 72, 73, 74, 75];

// Medicine type
type Medicine = {
    id: number;
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
            title={`Răng số ${number}${status ? ` - ${toothStatusConfig[status].label}` : ""}`}
        >
            {isUpper && (
                <span className="text-[9px] text-slate-500 mb-0.5">{number}</span>
            )}
            <div
                className={`
                    w-6 h-7 relative flex items-center justify-center
                    transition-all duration-150 group-hover:scale-110
                    ${isUpper ? "rounded-t-lg rounded-b-md" : "rounded-b-lg rounded-t-md"}
                    ${config
                        ? `${config.color} border-2 ${config.border}`
                        : "bg-white border-2 border-slate-300 group-hover:border-slate-400"
                    }
                `}
            >
                <div className={`absolute ${isUpper ? "bottom-0" : "top-0"} left-1/2 -translate-x-1/2 w-0.5 h-1.5 ${config ? "bg-white/50" : "bg-slate-200"}`} />
            </div>
            {!isUpper && (
                <span className="text-[9px] text-slate-500 mt-0.5">{number}</span>
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
};

// Prescription Templates
type PrescriptionTemplate = {
    id: string;
    name: string;
    medicines: Omit<Medicine, "id">[];
    notes: string;
};

const PRESCRIPTION_TEMPLATES: PrescriptionTemplate[] = [
    {
        id: "pain-relief",
        name: "Đơn giảm đau răng",
        medicines: [
            { name: "Paracetamol", dosage: "500mg", quantity: "10 viên", instructions: "Uống 1-2 viên khi đau, cách 4-6 giờ" },
            { name: "Ibuprofen", dosage: "400mg", quantity: "10 viên", instructions: "Uống 1 viên sau ăn, 2-3 lần/ngày" },
        ],
        notes: "Uống thuốc sau khi ăn no. Không dùng quá 6 viên Paracetamol/ngày.",
    },
    {
        id: "post-extraction",
        name: "Đơn sau nhổ răng",
        medicines: [
            { name: "Amoxicillin", dosage: "500mg", quantity: "21 viên", instructions: "Uống 1 viên x 3 lần/ngày" },
            { name: "Metronidazol", dosage: "250mg", quantity: "21 viên", instructions: "Uống 1 viên x 3 lần/ngày" },
            { name: "Paracetamol", dosage: "500mg", quantity: "10 viên", instructions: "Uống 1-2 viên khi đau" },
        ],
        notes: "Uống kháng sinh đủ 7 ngày. Không súc miệng mạnh trong 24 giờ đầu.",
    },
    {
        id: "gum-disease",
        name: "Đơn viêm nướu",
        medicines: [
            { name: "Spiramycin + Metronidazol", dosage: "750.000IU/125mg", quantity: "20 viên", instructions: "Uống 2 viên x 2 lần/ngày" },
            { name: "Nước súc miệng Chlorhexidine", dosage: "0.12%", quantity: "1 chai", instructions: "Súc miệng 2 lần/ngày" },
        ],
        notes: "Đánh răng nhẹ nhàng vùng viêm. Tái khám sau 7 ngày.",
    },
    {
        id: "cavity-filling",
        name: "Đơn sau trám răng",
        medicines: [
            { name: "Paracetamol", dosage: "500mg", quantity: "6 viên", instructions: "Uống 1 viên khi ê buốt" },
        ],
        notes: "Tránh ăn đồ quá nóng/lạnh trong 24 giờ. Ê buốt nhẹ là bình thường.",
    },
];

const PrescriptionModal: React.FC<PrescriptionModalProps> = ({ open, onClose, medicines: initialMedicines, onSave, patientName }) => {
    const [medicines, setMedicines] = useState<Medicine[]>(
        initialMedicines.length > 0 ? initialMedicines : [{ id: 1, name: "", dosage: "", quantity: "", instructions: "" }]
    );
    const [prescriptionNotes, setPrescriptionNotes] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState("");

    const applyTemplate = (templateId: string) => {
        const template = PRESCRIPTION_TEMPLATES.find(t => t.id === templateId);
        if (template) {
            const newMedicines = template.medicines.map((m, i) => ({
                ...m,
                id: Date.now() + i,
            }));
            setMedicines(newMedicines);
            setPrescriptionNotes(template.notes);
            setSelectedTemplate(templateId);
        }
    };

    const addMedicine = () => {
        setMedicines([
            ...medicines,
            { id: Date.now(), name: "", dosage: "", quantity: "", instructions: "" },
        ]);
    };

    const removeMedicine = (id: number) => {
        if (medicines.length > 1) {
            setMedicines(medicines.filter((m) => m.id !== id));
        }
    };

    const updateMedicine = (id: number, field: keyof Medicine, value: string) => {
        setMedicines(
            medicines.map((m) => (m.id === id ? { ...m, [field]: value } : m))
        );
    };

    const handleKeyDown = (e: React.KeyboardEvent, _medicineId: number, isLastField: boolean, isLastRow: boolean) => {
        if (e.key === "Enter" && isLastField && isLastRow) {
            e.preventDefault();
            addMedicine();
        }
    };

    const handleSave = () => {
        const validMedicines = medicines.filter(m => m.name.trim() !== "");
        onSave(validMedicines, prescriptionNotes);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose} title="Kê đơn thuốc" className="max-w-3xl w-[95vw]">
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Patient Info */}
                <div className="bg-blue-50 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FaPills className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Kê đơn cho bệnh nhân</p>
                            <p className="text-sm font-semibold text-slate-900">{patientName}</p>
                        </div>
                    </div>
                </div>

                {/* Template Selection */}
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                    <label className="block text-xs font-medium text-amber-800 mb-2">
                        ⚡ Chọn mẫu đơn thuốc nhanh
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {PRESCRIPTION_TEMPLATES.map((template) => (
                            <button
                                key={template.id}
                                onClick={() => applyTemplate(template.id)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${selectedTemplate === template.id
                                    ? "bg-amber-500 text-white border-amber-500"
                                    : "bg-white text-amber-700 border-amber-200 hover:border-amber-400"
                                    }`}
                            >
                                {template.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table Entry */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-semibold text-slate-700">
                            Danh sách thuốc ({medicines.filter(m => m.name).length})
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
                                    <th className="text-left text-[10px] font-semibold text-slate-600 px-2 py-2 w-[25%]">Tên thuốc *</th>
                                    <th className="text-left text-[10px] font-semibold text-slate-600 px-2 py-2 w-[15%]">Liều lượng</th>
                                    <th className="text-left text-[10px] font-semibold text-slate-600 px-2 py-2 w-[15%]">Số lượng</th>
                                    <th className="text-left text-[10px] font-semibold text-slate-600 px-2 py-2 w-[35%]">Cách dùng</th>
                                    <th className="w-[10%]"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {medicines.map((medicine, index) => {
                                    const isLastRow = index === medicines.length - 1;
                                    return (
                                        <tr key={medicine.id} className="border-t border-slate-100 hover:bg-slate-50">
                                            <td className="px-1 py-1">
                                                <input
                                                    type="text"
                                                    placeholder="Nhập tên thuốc"
                                                    className="w-full px-2 py-1.5 text-xs border-0 bg-transparent focus:bg-white focus:ring-1 focus:ring-blue-500 rounded outline-none"
                                                    value={medicine.name}
                                                    onChange={(e) => updateMedicine(medicine.id, "name", e.target.value)}
                                                />
                                            </td>
                                            <td className="px-1 py-1">
                                                <input
                                                    type="text"
                                                    placeholder="500mg"
                                                    className="w-full px-2 py-1.5 text-xs border-0 bg-transparent focus:bg-white focus:ring-1 focus:ring-blue-500 rounded outline-none"
                                                    value={medicine.dosage}
                                                    onChange={(e) => updateMedicine(medicine.id, "dosage", e.target.value)}
                                                />
                                            </td>
                                            <td className="px-1 py-1">
                                                <input
                                                    type="text"
                                                    placeholder="20 viên"
                                                    className="w-full px-2 py-1.5 text-xs border-0 bg-transparent focus:bg-white focus:ring-1 focus:ring-blue-500 rounded outline-none"
                                                    value={medicine.quantity}
                                                    onChange={(e) => updateMedicine(medicine.id, "quantity", e.target.value)}
                                                />
                                            </td>
                                            <td className="px-1 py-1">
                                                <input
                                                    type="text"
                                                    placeholder="2 viên/ngày sau ăn"
                                                    className="w-full px-2 py-1.5 text-xs border-0 bg-transparent focus:bg-white focus:ring-1 focus:ring-blue-500 rounded outline-none"
                                                    value={medicine.instructions}
                                                    onChange={(e) => updateMedicine(medicine.id, "instructions", e.target.value)}
                                                    onKeyDown={(e) => handleKeyDown(e, medicine.id, true, isLastRow)}
                                                />
                                            </td>
                                            <td className="px-1 py-1 text-center">
                                                {medicines.length > 1 && (
                                                    <button
                                                        onClick={() => removeMedicine(medicine.id)}
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
                    <p className="text-[10px] text-slate-400 mt-1">💡 Nhấn Enter ở ô cuối để thêm dòng mới. Tab để di chuyển giữa các ô.</p>
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
    const [patients, setPatients] = useState<Patient[]>(WAITING_PATIENTS);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [teethType, setTeethType] = useState<"adult" | "child">("adult");
    const [selectedTeeth, setSelectedTeeth] = useState<Record<number, ToothStatus>>({});
    const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [formData, setFormData] = useState({
        reason: "",
        diagnosis: "",
        treatment: "",
        prescriptionNotes: "",
        notes: "",
        followUpDate: "",
    });

    const handleStartExam = (patient: Patient) => {
        setPatients(patients.map(p =>
            p.id === patient.id ? { ...p, status: "in-progress" as const } : p
        ));
        setSelectedPatient(patient);
        setFormData({ reason: "", diagnosis: "", treatment: "", prescriptionNotes: "", notes: "", followUpDate: "" });
        setSelectedTeeth({});
        setMedicines([]);
    };

    const handleBack = () => {
        setSelectedPatient(null);
    };

    const handleToothClick = (toothNumber: number) => {
        const currentStatus = selectedTeeth[toothNumber];
        const statuses: ToothStatus[] = ["normal", "cavity", "missing", "treated", "crown", "nextTreatment"];
        const currentIndex = currentStatus ? statuses.indexOf(currentStatus) : -1;
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

    const handleSavePrescription = (newMedicines: Medicine[], notes: string) => {
        setMedicines(newMedicines);
        setFormData({ ...formData, prescriptionNotes: notes });
    };

    const handleSave = () => {
        if (!formData.diagnosis || !formData.treatment) {
            alert("Vui lòng nhập chẩn đoán và phương pháp điều trị!");
            return;
        }

        console.log("Treatment data:", {
            patient: selectedPatient,
            teeth: selectedTeeth,
            medicines,
            ...formData,
        });

        setPatients(patients.filter(p => p.id !== selectedPatient?.id));
        setSelectedPatient(null);
        alert("Đã lưu phiếu khám thành công!");
    };

    const handleCreateInvoice = () => {
        if (!formData.diagnosis || !formData.treatment) {
            alert("Vui lòng điền thông tin khám trước khi tạo hoá đơn!");
            return;
        }
        alert("Đã tạo yêu cầu thanh toán. Lễ tân sẽ xử lý.");
    };

    // Show patient list if no patient selected
    if (!selectedPatient) {
        return (
            <div className="px-6 py-8 lg:px-10">
                <div className="max-w-[1000px] mx-auto space-y-6">
                    {/* Header */}
                    <div>
                        <span className="inline-flex items-center rounded-full bg-[#E0ECFF] text-[#2563EB] text-[11px] font-semibold px-4 py-1.5 tracking-wide uppercase mb-3">
                            TREATMENT
                        </span>
                        <h1 className="text-xl font-semibold text-slate-900">Khám bệnh</h1>
                        <p className="text-sm text-slate-500 mt-1">Chọn bệnh nhân để bắt đầu khám</p>
                    </div>

                    {/* Waiting Patients List */}
                    {patients.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                            <FiClipboard className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-sm font-semibold text-slate-900 mb-1">Không có bệnh nhân chờ khám</h3>
                            <p className="text-xs text-slate-500">Tất cả bệnh nhân đã được khám xong</p>
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
                                                <h3 className="text-sm font-semibold text-slate-900">{patient.name}</h3>
                                                <p className="text-xs text-slate-500">{patient.service}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                            <FiClock className="w-3.5 h-3.5" />
                                            <span>{patient.time}</span>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-semibold ${patient.status === "in-progress"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-amber-100 text-amber-700"
                                            }`}>
                                            {patient.status === "in-progress" ? "Đang khám" : "Đang chờ"}
                                        </span>
                                        <button
                                            onClick={() => handleStartExam(patient)}
                                            className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white text-xs font-semibold rounded-lg hover:bg-[#1D4ED8] transition"
                                        >
                                            <FiPlay className="w-3.5 h-3.5" />
                                            Bắt đầu khám
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
    const upperTeeth = teethType === "adult" ? adultUpperTeeth : childUpperTeeth;
    const lowerTeeth = teethType === "adult" ? adultLowerTeeth : childLowerTeeth;

    return (
        <div className="px-6 py-8 lg:px-10">
            <div className="max-w-[1200px] mx-auto space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <span className="inline-flex items-center rounded-full bg-[#E0ECFF] text-[#2563EB] text-[11px] font-semibold px-4 py-1.5 tracking-wide uppercase mb-2">
                            TREATMENT FORM
                        </span>
                        <h1 className="text-lg font-semibold text-slate-900">Phiếu khám bệnh</h1>
                        <p className="text-xs text-slate-500">Ghi nhận thông tin khám và điều trị</p>
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
                        <h2 className="text-sm font-semibold text-slate-900">{selectedPatient.name}</h2>
                        <p className="text-xs text-slate-500">
                            {selectedPatient.age} tuổi • {selectedPatient.gender} • Khám gần nhất: {selectedPatient.lastVisit}
                        </p>
                    </div>
                </div>

                {/* Main Content - Two Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Left: Dental Chart */}
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-slate-900">Sơ đồ răng miệng</h3>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => setTeethType("adult")}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${teethType === "adult"
                                        ? "bg-[#2563EB] text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                        }`}
                                >
                                    Người lớn (32)
                                </button>
                                <button
                                    onClick={() => setTeethType("child")}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${teethType === "child"
                                        ? "bg-[#2563EB] text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                        }`}
                                >
                                    Trẻ em (20)
                                </button>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="mb-5 p-3 bg-slate-50 rounded-lg">
                            <p className="text-[10px] font-medium text-slate-600 mb-2">Chú thích: (Click vào răng để thay đổi trạng thái)</p>
                            <div className="grid grid-cols-3 gap-2">
                                {Object.entries(toothStatusConfig).map(([key, config]) => (
                                    <div key={key} className="flex items-center gap-1.5">
                                        <div className={`w-3 h-3 rounded ${config.color}`} />
                                        <span className="text-[10px] text-slate-600">{config.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Teeth Diagram */}
                        <div className="bg-gradient-to-b from-pink-50 to-white rounded-xl p-4 border border-pink-100">
                            {/* Upper Teeth */}
                            <div className="mb-2">
                                <p className="text-[10px] text-slate-500 mb-2 text-center font-medium">Hàm trên</p>
                                <div className="flex justify-center gap-0.5 flex-wrap">
                                    {upperTeeth.slice(0, upperTeeth.length / 2).map((tooth) => (
                                        <ToothButton
                                            key={tooth}
                                            number={tooth}
                                            status={selectedTeeth[tooth]}
                                            onClick={() => handleToothClick(tooth)}
                                            isUpper={true}
                                        />
                                    ))}
                                    <div className="w-2" />
                                    {upperTeeth.slice(upperTeeth.length / 2).map((tooth) => (
                                        <ToothButton
                                            key={tooth}
                                            number={tooth}
                                            status={selectedTeeth[tooth]}
                                            onClick={() => handleToothClick(tooth)}
                                            isUpper={true}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Divider line */}
                            <div className="flex items-center gap-2 my-3">
                                <div className="flex-1 h-px bg-pink-200" />
                                <span className="text-[9px] text-pink-400 font-medium">đường viền nướu</span>
                                <div className="flex-1 h-px bg-pink-200" />
                            </div>

                            {/* Lower Teeth */}
                            <div>
                                <div className="flex justify-center gap-0.5 flex-wrap">
                                    {lowerTeeth.slice(0, lowerTeeth.length / 2).map((tooth) => (
                                        <ToothButton
                                            key={tooth}
                                            number={tooth}
                                            status={selectedTeeth[tooth]}
                                            onClick={() => handleToothClick(tooth)}
                                            isUpper={false}
                                        />
                                    ))}
                                    <div className="w-2" />
                                    {lowerTeeth.slice(lowerTeeth.length / 2).map((tooth) => (
                                        <ToothButton
                                            key={tooth}
                                            number={tooth}
                                            status={selectedTeeth[tooth]}
                                            onClick={() => handleToothClick(tooth)}
                                            isUpper={false}
                                        />
                                    ))}
                                </div>
                                <p className="text-[10px] text-slate-500 mt-2 text-center font-medium">Hàm dưới</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Treatment Form */}
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <h3 className="text-sm font-semibold text-slate-900 mb-4">Thông tin điều trị</h3>

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
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                />
                            </div>

                            {/* Diagnosis */}
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                                    Chẩn đoán <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="Chẩn đoán bệnh..."
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-[#2563EB] outline-none resize-none"
                                    value={formData.diagnosis}
                                    onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                                />
                            </div>

                            {/* Treatment */}
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                                    Điều trị <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="Mô tả điều trị đã thực hiện..."
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-[#2563EB] outline-none resize-none"
                                    value={formData.treatment}
                                    onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                                />
                            </div>

                            {/* Prescription */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-xs font-medium text-slate-700">Đơn thuốc</label>
                                    <button
                                        onClick={() => setPrescriptionModalOpen(true)}
                                        className="flex items-center gap-1 text-xs text-[#2563EB] hover:underline"
                                    >
                                        <FiPlus className="w-3 h-3" />
                                        Kê đơn
                                    </button>
                                </div>
                                <div
                                    onClick={() => setPrescriptionModalOpen(true)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm cursor-pointer hover:border-slate-300 min-h-[38px] flex items-center"
                                >
                                    {medicines.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {medicines.map((m, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                                                    {m.name} ({m.quantity})
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-slate-400">Click để kê đơn thuốc...</span>
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
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                                    onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handleSave}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-[#1D4ED8] transition"
                    >
                        <FiSave className="w-4 h-4" />
                        Lưu phiếu khám
                    </button>
                    <button
                        onClick={handleCreateInvoice}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition"
                    >
                        <FiDollarSign className="w-4 h-4" />
                        Tạo hoá đơn thanh toán
                    </button>
                </div>
            </div>

            {/* Prescription Modal */}
            <PrescriptionModal
                open={prescriptionModalOpen}
                onClose={() => setPrescriptionModalOpen(false)}
                medicines={medicines}
                onSave={handleSavePrescription}
                patientName={selectedPatient.name}
            />
        </div>
    );
};

export default DoctorTreatment;
