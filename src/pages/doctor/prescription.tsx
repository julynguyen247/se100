import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiArrowLeft, FiFileText } from 'react-icons/fi';
import { FaPills } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {
    getMedicines,
    getPrescriptionTemplates,
    createPrescriptionTemplate,
    MedicineCatalogItem,
    PrescriptionTemplate,
} from '@/services/apiDoctor';

type Medicine = {
    id: number;
    medicineId: string; // empty GUID if free text
    name: string;
    dosage: string;
    quantity: string;
    instructions: string;
};

const DoctorPrescription: React.FC = () => {
    const navigate = useNavigate();

    // Data from APIs
    const [medicineCatalog, setMedicineCatalog] = useState<
        MedicineCatalogItem[]
    >([]);
    const [templates, setTemplates] = useState<PrescriptionTemplate[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [medicines, setMedicines] = useState<Medicine[]>([
        {
            id: 1,
            medicineId: '00000000-0000-0000-0000-000000000000',
            name: '',
            dosage: '',
            quantity: '',
            instructions: '',
        },
    ]);
    const [notes, setNotes] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('');

    // Save Template Modal
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [newTemplateName, setNewTemplateName] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [medsRes, templatesRes] = await Promise.all([
                getMedicines(),
                getPrescriptionTemplates(),
            ]);

            if (medsRes.isSuccess && medsRes.data) {
                setMedicineCatalog(medsRes.data);
            }
            if (templatesRes.isSuccess && templatesRes.data) {
                setTemplates(templatesRes.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyTemplate = (templateId: string) => {
        const template = templates.find((t) => t.id === templateId);
        if (template) {
            const newMedicines = template.medicines.map((m, i) => ({
                id: Date.now() + i,
                medicineId:
                    m.medicineId || '00000000-0000-0000-0000-000000000000',
                name: m.name,
                dosage: m.dosage,
                quantity: m.quantity,
                instructions: m.instructions,
            }));
            setMedicines(newMedicines);
            setNotes(template.notes || '');
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

                    // If name is selected from catalog (this logic handles free text vs selection)
                    // For now, simple text input. Ideally, we would select from catalog to set medicineId.
                    // If exact match found in catalog, set ID?
                    // Let's rely on user selecting from a list if implemented, but for now keep text.
                    // If we want to support catalog selection, we need a datalist or Select component.

                    if (field === 'name') {
                        const found = medicineCatalog.find(
                            (c) => c.name === value
                        );
                        updated.medicineId = found
                            ? found.medicineId
                            : '00000000-0000-0000-0000-000000000000';
                        if (found) {
                            updated.dosage = found.unit; // Suggest unit/dosage?
                        }
                    }

                    return updated;
                }
                return m;
            })
        );
    };

    const handleKeyDown = (e: React.KeyboardEvent, isLastRow: boolean) => {
        if (e.key === 'Enter' && isLastRow) {
            e.preventDefault();
            addMedicine();
        }
    };

    const handleSaveTemplate = async () => {
        if (!newTemplateName.trim()) {
            alert('Vui lòng nhập tên mẫu đơn thuốc');
            return;
        }

        const validMedicines = medicines.filter((m) => m.name.trim() !== '');
        if (validMedicines.length === 0) {
            alert('Vui lòng thêm ít nhất 1 thuốc!');
            return;
        }

        // Check if any medicines are free-text (not from catalog)
        const freeTextMedicines = validMedicines.filter(
            (m) => m.medicineId === '00000000-0000-0000-0000-000000000000'
        );

        if (freeTextMedicines.length > 0) {
            alert(
                `⚠️ Không thể lưu template!\n\n` +
                    `Các thuốc sau chưa có trong danh mục:\n` +
                    `${freeTextMedicines
                        .map((m) => `• ${m.name}`)
                        .join('\n')}\n\n` +
                    `Vui lòng chọn thuốc từ danh mục (autocomplete) để lưu template.`
            );
            return;
        }

        try {
            const response = await createPrescriptionTemplate({
                name: newTemplateName,
                category: 'General',
                notes: notes,
                medicines: validMedicines.map((m) => ({
                    medicineId: m.medicineId,
                    name: m.name,
                    dosage: m.dosage,
                    quantity: m.quantity,
                    instructions: m.instructions,
                })),
            });

            if (response.isSuccess) {
                alert('Đã lưu mẫu đơn thuốc!');
                setShowSaveModal(false);
                setNewTemplateName('');
                fetchData(); // Refresh list
            } else {
                alert(response.message || 'Không thể lưu mẫu');
            }
        } catch (error) {
            console.error('Error saving template:', error);
            alert('Lỗi kết nối server');
        }
    };

    return (
        <div className="px-6 py-8 lg:px-10">
            <div className="max-w-[1000px] mx-auto space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <span className="inline-flex items-center rounded-full bg-[#E0ECFF] text-[#2563EB] text-[11px] font-semibold px-4 py-1.5 tracking-wide uppercase mb-2">
                            PRESCRIPTION
                        </span>
                        <h1 className="text-lg font-semibold text-slate-900">
                            Kê đơn thuốc
                        </h1>
                        <p className="text-xs text-slate-500">
                            Tạo đơn thuốc vả quản lý mẫu
                        </p>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        Quay lại
                    </button>
                </div>

                {/* Template Selection */}
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                    <label className="block text-xs font-medium text-amber-800 mb-3">
                        ⚡ Chọn mẫu đơn thuốc nhanh ({templates.length})
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {loading ? (
                            <span className="text-xs text-amber-600">
                                Đang tải mẫu...
                            </span>
                        ) : templates.length > 0 ? (
                            templates.map((template) => (
                                <button
                                    key={template.id}
                                    onClick={() => applyTemplate(template.id)}
                                    className={`px-4 py-2 text-xs font-medium rounded-lg border transition ${
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

                {/* Prescription Form */}
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <FaPills className="w-5 h-5 text-[#2563EB]" />
                            <h2 className="text-sm font-semibold text-slate-900">
                                Danh sách thuốc (
                                {medicines.filter((m) => m.name).length})
                            </h2>
                        </div>
                        <button
                            onClick={addMedicine}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-[#2563EB] text-xs font-medium rounded-lg hover:bg-blue-100"
                        >
                            <FiPlus className="w-4 h-4" />
                            Thêm dòng
                        </button>
                    </div>

                    {/* Table */}
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="text-left text-[10px] font-semibold text-slate-600 px-3 py-2.5 w-[30%]">
                                        Tên thuốc *
                                    </th>
                                    <th className="text-left text-[10px] font-semibold text-slate-600 px-3 py-2.5 w-[15%]">
                                        Liều lượng
                                    </th>
                                    <th className="text-left text-[10px] font-semibold text-slate-600 px-3 py-2.5 w-[15%]">
                                        Số lượng
                                    </th>
                                    <th className="text-left text-[10px] font-semibold text-slate-600 px-3 py-2.5 w-[30%]">
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
                                            <td className="px-2 py-1.5 relative group">
                                                <input
                                                    type="text"
                                                    placeholder="Nhập tên thuốc..."
                                                    className="w-full px-2 py-2 text-sm border-0 bg-transparent focus:bg-white focus:ring-1 focus:ring-blue-500 rounded outline-none"
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
                                                '00000000-0000-0000-0000-000000000000' ? (
                                                    <span className="absolute right-2 top-3 text-[10px] text-green-600 bg-green-50 px-1 rounded">
                                                        ✓ Catalog
                                                    </span>
                                                ) : medicine.name.trim() !==
                                                  '' ? (
                                                    <span className="absolute right-2 top-3 text-[10px] text-red-600 bg-red-50 px-1 rounded">
                                                        ⚠️ Free-text
                                                    </span>
                                                ) : null}
                                            </td>
                                            <td className="px-2 py-1.5">
                                                <input
                                                    type="text"
                                                    placeholder="500mg"
                                                    className="w-full px-2 py-2 text-sm border-0 bg-transparent focus:bg-white focus:ring-1 focus:ring-blue-500 rounded outline-none"
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
                                            <td className="px-2 py-1.5">
                                                <input
                                                    type="text"
                                                    placeholder="20 viên"
                                                    className="w-full px-2 py-2 text-sm border-0 bg-transparent focus:bg-white focus:ring-1 focus:ring-blue-500 rounded outline-none"
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
                                            <td className="px-2 py-1.5">
                                                <input
                                                    type="text"
                                                    placeholder="2 viên/ngày sau ăn"
                                                    className="w-full px-2 py-2 text-sm border-0 bg-transparent focus:bg-white focus:ring-1 focus:ring-blue-500 rounded outline-none"
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
                                                            isLastRow
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td className="px-2 py-1.5 text-center">
                                                {medicines.length > 1 && (
                                                    <button
                                                        onClick={() =>
                                                            removeMedicine(
                                                                medicine.id
                                                            )
                                                        }
                                                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                    >
                                                        <FiTrash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex items-start gap-2 mt-2">
                        <p className="text-[10px] text-slate-400 flex-1">
                            💡 Nhấn Enter ở ô cuối để thêm dòng mới. Chọn từ gợi
                            ý để lưu template.
                        </p>
                        <a
                            href="/doctor/medicines"
                            className="text-[10px] text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap"
                        >
                            + Thêm thuốc vào danh mục
                        </a>
                    </div>

                    {/* Notes */}
                    <div className="mt-5">
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                            Ghi chú / Lời dặn
                        </label>
                        <textarea
                            rows={2}
                            placeholder="Lời dặn cho bệnh nhân..."
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:border-[#2563EB] focus:bg-white outline-none resize-none"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-5 flex gap-3">
                        <button
                            onClick={() => setShowSaveModal(true)}
                            disabled={
                                medicines.filter((m) => m.name.trim() !== '')
                                    .length === 0 ||
                                medicines.some(
                                    (m) =>
                                        m.name.trim() !== '' &&
                                        m.medicineId ===
                                            '00000000-0000-0000-0000-000000000000'
                                )
                            }
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
                            title={
                                medicines.some(
                                    (m) =>
                                        m.name.trim() !== '' &&
                                        m.medicineId ===
                                            '00000000-0000-0000-0000-000000000000'
                                )
                                    ? 'Chỉ thuốc từ danh mục mới được lưu template'
                                    : ''
                            }
                        >
                            <FiFileText className="w-4 h-4" />
                            Lưu thành mẫu mới
                        </button>
                    </div>
                </div>
            </div>

            {/* Save Template Modal */}
            {showSaveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">
                            Lưu mẫu đơn thuốc
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                    Tên mẫu
                                </label>
                                <input
                                    type="text"
                                    value={newTemplateName}
                                    onChange={(e) =>
                                        setNewTemplateName(e.target.value)
                                    }
                                    placeholder="Ví dụ: Đơn đau răng nhẹ..."
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                    autoFocus
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowSaveModal(false)}
                                    className="flex-1 px-4 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleSaveTemplate}
                                    className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                >
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorPrescription;
