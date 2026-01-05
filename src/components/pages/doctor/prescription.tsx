import React, { useState } from "react";
import { FiUser, FiPlus, FiTrash2, FiSave, FiArrowLeft } from "react-icons/fi";
import { FaPills } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

type Medicine = {
    id: number;
    name: string;
    dosage: string;
    quantity: string;
    instructions: string;
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

const DoctorPrescription: React.FC = () => {
    const navigate = useNavigate();
    const [medicines, setMedicines] = useState<Medicine[]>([
        { id: 1, name: "", dosage: "", quantity: "", instructions: "" },
    ]);
    const [notes, setNotes] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState("");

    const currentPatient = {
        name: "Trần Thị B",
        age: 28,
        diagnosis: "Sâu răng hàm số 6",
    };

    const applyTemplate = (templateId: string) => {
        const template = PRESCRIPTION_TEMPLATES.find(t => t.id === templateId);
        if (template) {
            const newMedicines = template.medicines.map((m, i) => ({
                ...m,
                id: Date.now() + i,
            }));
            setMedicines(newMedicines);
            setNotes(template.notes);
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

    const handleKeyDown = (e: React.KeyboardEvent, isLastRow: boolean) => {
        if (e.key === "Enter" && isLastRow) {
            e.preventDefault();
            addMedicine();
        }
    };

    const handleSave = () => {
        const validMedicines = medicines.filter(m => m.name.trim() !== "");
        if (validMedicines.length === 0) {
            alert("Vui lòng thêm ít nhất 1 thuốc!");
            return;
        }
        console.log("Prescription:", { medicines: validMedicines, notes });
        alert("Đã lưu đơn thuốc!");
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
                        <h1 className="text-lg font-semibold text-slate-900">Kê đơn thuốc</h1>
                        <p className="text-xs text-slate-500">Tạo đơn thuốc cho bệnh nhân</p>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        Quay lại
                    </button>
                </div>

                {/* Patient Info */}
                <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#E0ECFF] rounded-full flex items-center justify-center">
                        <FiUser className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <div className="grid grid-cols-3 gap-6 flex-1">
                        <div>
                            <p className="text-[10px] text-slate-500">Họ tên</p>
                            <p className="text-sm font-medium text-slate-900">{currentPatient.name}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500">Tuổi</p>
                            <p className="text-sm font-medium text-slate-900">{currentPatient.age}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500">Chẩn đoán</p>
                            <p className="text-sm font-medium text-slate-900">{currentPatient.diagnosis}</p>
                        </div>
                    </div>
                </div>

                {/* Template Selection */}
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                    <label className="block text-xs font-medium text-amber-800 mb-3">
                        ⚡ Chọn mẫu đơn thuốc nhanh
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {PRESCRIPTION_TEMPLATES.map((template) => (
                            <button
                                key={template.id}
                                onClick={() => applyTemplate(template.id)}
                                className={`px-4 py-2 text-xs font-medium rounded-lg border transition ${selectedTemplate === template.id
                                    ? "bg-amber-500 text-white border-amber-500"
                                    : "bg-white text-amber-700 border-amber-200 hover:border-amber-400"
                                    }`}
                            >
                                {template.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Prescription Form - Table Style */}
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <FaPills className="w-5 h-5 text-[#2563EB]" />
                            <h2 className="text-sm font-semibold text-slate-900">
                                Danh sách thuốc ({medicines.filter(m => m.name).length})
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
                                    <th className="text-left text-[10px] font-semibold text-slate-600 px-3 py-2.5 w-[25%]">Tên thuốc *</th>
                                    <th className="text-left text-[10px] font-semibold text-slate-600 px-3 py-2.5 w-[15%]">Liều lượng</th>
                                    <th className="text-left text-[10px] font-semibold text-slate-600 px-3 py-2.5 w-[15%]">Số lượng</th>
                                    <th className="text-left text-[10px] font-semibold text-slate-600 px-3 py-2.5 w-[35%]">Cách dùng</th>
                                    <th className="w-[10%]"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {medicines.map((medicine, index) => {
                                    const isLastRow = index === medicines.length - 1;
                                    return (
                                        <tr key={medicine.id} className="border-t border-slate-100 hover:bg-slate-50">
                                            <td className="px-2 py-1.5">
                                                <input
                                                    type="text"
                                                    placeholder="Nhập tên thuốc"
                                                    className="w-full px-2 py-2 text-sm border-0 bg-transparent focus:bg-white focus:ring-1 focus:ring-blue-500 rounded outline-none"
                                                    value={medicine.name}
                                                    onChange={(e) => updateMedicine(medicine.id, "name", e.target.value)}
                                                />
                                            </td>
                                            <td className="px-2 py-1.5">
                                                <input
                                                    type="text"
                                                    placeholder="500mg"
                                                    className="w-full px-2 py-2 text-sm border-0 bg-transparent focus:bg-white focus:ring-1 focus:ring-blue-500 rounded outline-none"
                                                    value={medicine.dosage}
                                                    onChange={(e) => updateMedicine(medicine.id, "dosage", e.target.value)}
                                                />
                                            </td>
                                            <td className="px-2 py-1.5">
                                                <input
                                                    type="text"
                                                    placeholder="20 viên"
                                                    className="w-full px-2 py-2 text-sm border-0 bg-transparent focus:bg-white focus:ring-1 focus:ring-blue-500 rounded outline-none"
                                                    value={medicine.quantity}
                                                    onChange={(e) => updateMedicine(medicine.id, "quantity", e.target.value)}
                                                />
                                            </td>
                                            <td className="px-2 py-1.5">
                                                <input
                                                    type="text"
                                                    placeholder="2 viên/ngày sau ăn"
                                                    className="w-full px-2 py-2 text-sm border-0 bg-transparent focus:bg-white focus:ring-1 focus:ring-blue-500 rounded outline-none"
                                                    value={medicine.instructions}
                                                    onChange={(e) => updateMedicine(medicine.id, "instructions", e.target.value)}
                                                    onKeyDown={(e) => handleKeyDown(e, isLastRow)}
                                                />
                                            </td>
                                            <td className="px-2 py-1.5 text-center">
                                                {medicines.length > 1 && (
                                                    <button
                                                        onClick={() => removeMedicine(medicine.id)}
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
                    <p className="text-[10px] text-slate-400 mt-2">💡 Nhấn Enter ở ô cuối để thêm dòng mới. Tab để di chuyển giữa các ô.</p>

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
                            onClick={handleSave}
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1D4ED8] transition"
                        >
                            <FiSave className="w-4 h-4" />
                            Lưu đơn thuốc
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorPrescription;
