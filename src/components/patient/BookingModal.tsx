import React, { useState, FormEvent } from "react";
import { FiX, FiCalendar, FiUser, FiPhone, FiMail } from "react-icons/fi";

type Step = 1 | 2 | 3;

type BookingData = {
    fullName: string;
    phone: string;
    email: string;
    date: string;
    time: string;
    service: string;
    doctor: string;
    note: string;
};

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (data: BookingData) => void;
    initialData?: Partial<BookingData>;
}

const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "13:30", "14:00", "14:30", "15:00",
    "15:30", "16:00", "16:30", "17:00",
];

const BookingModal: React.FC<BookingModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
}) => {
    const [step, setStep] = useState<Step>(1);
    const [data, setData] = useState<BookingData>({
        fullName: initialData?.fullName || "",
        phone: initialData?.phone || "",
        email: "",
        date: initialData?.date || "",
        time: initialData?.time || "",
        service: initialData?.service || "",
        doctor: initialData?.doctor || "",
        note: initialData?.note || "",
    });

    const updateField = <K extends keyof BookingData>(key: K, value: BookingData[K]) => {
        setData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit?.(data);
        alert("Đặt lịch thành công!");
        onClose();
        // Reset
        setStep(1);
    };

    const handleClose = () => {
        setStep(1);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Đặt lịch hẹn</h2>
                        <p className="text-xs text-slate-500">Bước {step}/3</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition"
                    >
                        <FiX className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Stepper */}
                <div className="px-6 py-3 flex items-center justify-center gap-2">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step === s
                                    ? "bg-[#2563EB] text-white"
                                    : step > s
                                        ? "bg-emerald-500 text-white"
                                        : "bg-slate-100 text-slate-400"
                                    }`}
                            >
                                {s}
                            </div>
                            {s < 3 && <div className="w-8 h-px bg-slate-200 mx-1" />}
                        </div>
                    ))}
                </div>

                {/* Content */}
                <div className="px-6 py-4">
                    {step === 1 && (
                        <form
                            className="space-y-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                setStep(2);
                            }}
                        >
                            <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-slate-700">
                                    Họ và tên <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Nhập họ và tên"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                                        value={data.fullName}
                                        onChange={(e) => updateField("fullName", e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-slate-700">
                                    Số điện thoại <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <input
                                        type="tel"
                                        placeholder="Nhập số điện thoại"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                                        value={data.phone}
                                        onChange={(e) => updateField("phone", e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-slate-700">
                                    Email <span className="text-slate-400 font-normal">(không bắt buộc)</span>
                                </label>
                                <div className="relative">
                                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <input
                                        type="email"
                                        placeholder="example@email.com"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                                        value={data.email}
                                        onChange={(e) => updateField("email", e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1D4ED8] transition-colors shadow-sm"
                            >
                                Tiếp tục
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <form
                            className="space-y-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                setStep(3);
                            }}
                        >
                            <div className="space-y-1">
                                <label className="block text-xs font-medium text-slate-700">
                                    Ngày hẹn <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <input
                                        type="date"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:border-[#2563EB] focus:bg-white outline-none"
                                        value={data.date}
                                        onChange={(e) => updateField("date", e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-medium text-slate-700">
                                    Giờ hẹn <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {timeSlots.map((slot) => (
                                        <button
                                            key={slot}
                                            type="button"
                                            onClick={() => updateField("time", slot)}
                                            className={`py-2 text-xs rounded-md border transition ${data.time === slot
                                                ? "bg-[#2563EB] border-[#2563EB] text-white"
                                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                                                }`}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                >
                                    Quay lại
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 rounded-lg bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1D4ED8]"
                                >
                                    Tiếp tục
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 3 && (
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="space-y-1">
                                <label className="block text-xs font-medium text-slate-700">
                                    Dịch vụ <span className="text-red-500">*</span>
                                </label>
                                <select
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:border-[#2563EB] focus:bg-white outline-none"
                                    value={data.service}
                                    onChange={(e) => updateField("service", e.target.value)}
                                    required
                                >
                                    <option value="">Chọn dịch vụ</option>
                                    <option value="kham-tong-quat">Khám tổng quát</option>
                                    <option value="tay-trang">Tẩy trắng răng</option>
                                    <option value="nieng-rang">Niềng răng</option>
                                    <option value="trong-rang">Trồng răng Implant</option>
                                    <option value="nho-rang">Nhổ răng</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-xs font-medium text-slate-700">
                                    Bác sĩ <span className="text-red-500">*</span>
                                </label>
                                <select
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:border-[#2563EB] focus:bg-white outline-none"
                                    value={data.doctor}
                                    onChange={(e) => updateField("doctor", e.target.value)}
                                    required
                                >
                                    <option value="">Chọn bác sĩ</option>
                                    <option value="bs-nguyen-van-a">BS. Nguyễn Văn A</option>
                                    <option value="bs-tran-thi-b">BS. Trần Thị B</option>
                                    <option value="bs-le-van-c">BS. Lê Văn C</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-xs font-medium text-slate-700">
                                    Ghi chú
                                </label>
                                <textarea
                                    rows={2}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:border-[#2563EB] focus:bg-white outline-none resize-none"
                                    placeholder="Triệu chứng, yêu cầu..."
                                    value={data.note}
                                    onChange={(e) => updateField("note", e.target.value)}
                                />
                            </div>

                            {/* Summary */}
                            <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600">
                                <p className="font-semibold text-slate-700 mb-2">Thông tin đặt lịch:</p>
                                <div className="grid grid-cols-2 gap-1">
                                    <span>Họ tên: {data.fullName}</span>
                                    <span>SĐT: {data.phone}</span>
                                    <span>Ngày: {data.date}</span>
                                    <span>Giờ: {data.time}</span>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="flex-1 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                >
                                    Quay lại
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 rounded-lg bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1D4ED8]"
                                >
                                    Xác nhận
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
