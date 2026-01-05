import React, { useState } from "react";
import { FiX, FiAlertTriangle } from "react-icons/fi";

interface CancelAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    appointmentTitle?: string;
}

const CancelAppointmentModal: React.FC<CancelAppointmentModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    appointmentTitle,
}) => {
    const [reason, setReason] = useState("");

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm(reason);
        setReason("");
    };

    const handleClose = () => {
        setReason("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold text-slate-900">Huỷ lịch hẹn</h2>
                    <button
                        onClick={handleClose}
                        className="p-1.5 hover:bg-slate-100 rounded-lg transition"
                    >
                        <FiX className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-5 space-y-4">
                    {/* Warning */}
                    <div className="flex items-start gap-3 bg-red-50 rounded-xl p-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                            <FiAlertTriangle className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-red-800">
                                Bạn có chắc chắn muốn huỷ lịch hẹn này?
                            </p>
                            {appointmentTitle && (
                                <p className="text-xs text-red-600 mt-1">
                                    Lịch hẹn: <span className="font-semibold">{appointmentTitle}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Reason */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-slate-700">
                            Lý do huỷ <span className="text-slate-400 font-normal">(không bắt buộc)</span>
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Nhập lý do huỷ lịch hẹn..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all resize-none"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 border-t bg-slate-50 flex gap-3">
                    <button
                        onClick={handleClose}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
                    >
                        Không, giữ lại
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 py-2.5 rounded-xl bg-red-500 text-sm font-semibold text-white hover:bg-red-600 transition"
                    >
                        Xác nhận huỷ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancelAppointmentModal;
