import React from "react";
import { FiX, FiCalendar, FiClock, FiUser, FiFileText } from "react-icons/fi";

type AppointmentStatus = "confirmed" | "pending" | "completed" | "cancelled";

type Appointment = {
    id: number;
    title: string;
    doctor: string;
    date: string;
    time: string;
    note: string;
    status: AppointmentStatus;
};

interface AppointmentDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointment: Appointment | null;
    onCancel?: (id: number) => void;
}

const statusMap: Record<AppointmentStatus, { label: string; className: string }> = {
    confirmed: { label: "Đã xác nhận", className: "bg-[#E0ECFF] text-[#2563EB]" },
    pending: { label: "Chờ xác nhận", className: "bg-[#FEF3C7] text-[#92400E]" },
    completed: { label: "Hoàn thành", className: "bg-[#DCFCE7] text-[#15803D]" },
    cancelled: { label: "Đã huỷ", className: "bg-[#FEE2E2] text-[#B91C1C]" },
};

const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
    isOpen,
    onClose,
    appointment,
    onCancel,
}) => {
    if (!isOpen || !appointment) return null;

    const status = statusMap[appointment.status];
    const canCancel = appointment.status === "confirmed" || appointment.status === "pending";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]">
                    <h2 className="text-lg font-semibold text-white">Chi tiết lịch hẹn</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-white/20 rounded-lg transition"
                    >
                        <FiX className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-5 space-y-5">
                    {/* Title + Status */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">{appointment.title}</h3>
                            <p className="text-sm text-slate-500 mt-0.5">{appointment.doctor}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>
                            {status.label}
                        </span>
                    </div>

                    {/* Info cards */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 rounded-xl p-3.5">
                            <div className="flex items-center gap-2 text-slate-400 mb-1">
                                <FiCalendar className="w-4 h-4" />
                                <span className="text-xs font-medium">Ngày hẹn</span>
                            </div>
                            <p className="text-sm font-semibold text-slate-900">{appointment.date}</p>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-3.5">
                            <div className="flex items-center gap-2 text-slate-400 mb-1">
                                <FiClock className="w-4 h-4" />
                                <span className="text-xs font-medium">Giờ hẹn</span>
                            </div>
                            <p className="text-sm font-semibold text-slate-900">{appointment.time}</p>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-3.5">
                            <div className="flex items-center gap-2 text-slate-400 mb-1">
                                <FiUser className="w-4 h-4" />
                                <span className="text-xs font-medium">Bác sĩ</span>
                            </div>
                            <p className="text-sm font-semibold text-slate-900">{appointment.doctor}</p>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-3.5">
                            <div className="flex items-center gap-2 text-slate-400 mb-1">
                                <FiFileText className="w-4 h-4" />
                                <span className="text-xs font-medium">Dịch vụ</span>
                            </div>
                            <p className="text-sm font-semibold text-slate-900">{appointment.title}</p>
                        </div>
                    </div>

                    {/* Note */}
                    {appointment.note && (
                        <div className="bg-blue-50 rounded-xl p-4">
                            <p className="text-xs font-medium text-[#2563EB] mb-1">Ghi chú</p>
                            <p className="text-sm text-slate-700">{appointment.note}</p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="px-6 py-4 border-t bg-slate-50 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
                    >
                        Đóng
                    </button>
                    {canCancel && (
                        <button
                            onClick={() => onCancel?.(appointment.id)}
                            className="flex-1 py-2.5 rounded-xl bg-red-500 text-sm font-semibold text-white hover:bg-red-600 transition"
                        >
                            Huỷ lịch hẹn
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppointmentDetailModal;
