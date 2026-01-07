import React, { useState, useEffect } from "react";
import { FiX, FiUser } from "react-icons/fi";
import { createPatient, getClinics, type CreatePatientRequest, type ClinicDto } from "@/services/apiReceptionist";
import { toast } from "sonner";

interface CreatePatientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CreatePatientModal: React.FC<CreatePatientModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [clinics, setClinics] = useState<ClinicDto[]>([]);
    const [formData, setFormData] = useState<CreatePatientRequest>({
        clinicId: "",
        patientCode: "",
        fullName: "",
        gender: "Male",
        primaryPhone: "",
        email: "",
        addressLine1: "",
        dob: null,
        note: ""
    });

    useEffect(() => {
        if (isOpen) {
            fetchClinics();
        }
    }, [isOpen]);

    const fetchClinics = async () => {
        try {
            const result = await getClinics();
            if (result.isSuccess && result.data) {
                setClinics(result.data);
                // Auto-select first clinic if available
                if (result.data.length > 0) {
                    setFormData(prev => ({ ...prev, clinicId: result.data[0].id }));
                }
            }
        } catch (err) {
            console.error('Error fetching clinics:', err);
            toast.error('Không thể tải danh sách phòng khám');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.fullName.trim()) {
            toast.error('Vui lòng nhập họ tên');
            return;
        }
        if (!formData.primaryPhone?.trim()) {
            toast.error('Vui lòng nhập số điện thoại');
            return;
        }
        if (!formData.clinicId) {
            toast.error('Vui lòng chọn phòng khám');
            return;
        }

        try {
            setLoading(true);
            const result = await createPatient(formData);

            if (result.isSuccess) {
                toast.success('Tạo bệnh nhân thành công');
                onSuccess();
                handleClose();
            } else {
                toast.error(result.message || 'Không thể tạo bệnh nhân');
            }
        } catch (err: any) {
            console.error('Error creating patient:', err);
            toast.error('Có lỗi xảy ra khi tạo bệnh nhân');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            clinicId: "",
            patientCode: "",
            fullName: "",
            gender: "Male",
            primaryPhone: "",
            email: "",
            addressLine1: "",
            dob: null,
            note: ""
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#E0ECFF] rounded-full flex items-center justify-center">
                            <FiUser className="w-5 h-5 text-[#2563EB]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Thêm bệnh nhân mới</h2>
                            <p className="text-xs text-slate-500">Nhập thông tin bệnh nhân</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <FiX className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Clinic Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Phòng khám <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.clinicId}
                            onChange={(e) => setFormData({ ...formData, clinicId: e.target.value })}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB]"
                            required
                        >
                            <option value="">Chọn phòng khám</option>
                            {clinics.map((clinic) => (
                                <option key={clinic.id} value={clinic.id}>
                                    {clinic.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Patient Code */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Mã bệnh nhân
                        </label>
                        <input
                            type="text"
                            value={formData.patientCode}
                            onChange={(e) => setFormData({ ...formData, patientCode: e.target.value })}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB]"
                            placeholder="Ví dụ: BN001"
                        />
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB]"
                            placeholder="Nhập họ và tên"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Giới tính
                            </label>
                            <select
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' | 'Other' })}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB]"
                            >
                                <option value="Male">Nam</option>
                                <option value="Female">Nữ</option>
                                <option value="Other">Khác</option>
                            </select>
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Ngày sinh
                            </label>
                            <input
                                type="date"
                                value={formData.dob || ""}
                                onChange={(e) => setFormData({ ...formData, dob: e.target.value || null })}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Số điện thoại <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                value={formData.primaryPhone || ""}
                                onChange={(e) => setFormData({ ...formData, primaryPhone: e.target.value })}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB]"
                                placeholder="0901234567"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.email || ""}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value || null })}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB]"
                                placeholder="example@email.com"
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Địa chỉ
                        </label>
                        <input
                            type="text"
                            value={formData.addressLine1 || ""}
                            onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value || null })}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB]"
                            placeholder="Nhập địa chỉ"
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Ghi chú
                        </label>
                        <textarea
                            value={formData.note || ""}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value || null })}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] resize-none"
                            rows={3}
                            placeholder="Nhập ghi chú (nếu có)"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50"
                            disabled={loading}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 bg-[#2563EB] text-white font-medium rounded-lg hover:bg-[#1D4ED8] disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Đang tạo...' : 'Tạo bệnh nhân'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePatientModal;
