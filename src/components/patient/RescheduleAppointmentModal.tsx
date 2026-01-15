import React, { useState, useEffect } from 'react';
import { FiX, FiCalendar, FiClock } from 'react-icons/fi';
import { rescheduleAppointmentByToken, type AppointmentDto, type SlotDto } from '@/services/apiPatient';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

interface RescheduleAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointment: AppointmentDto | null;
    onRescheduleSuccess: () => void;
}

const RescheduleAppointmentModal: React.FC<RescheduleAppointmentModalProps> = ({
    isOpen,
    onClose,
    appointment,
    onRescheduleSuccess,
}) => {
    const [selectedDate, setSelectedDate] = useState<string>('');
    // TODO: Uncomment when slot fetching is implemented
    // const [slots, setSlots] = useState<SlotDto[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<SlotDto | null>(null);
    // const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setSelectedDate('');
            setSelectedSlot(null);
        }
    }, [isOpen]);

    // Fetch slots when date changes
    // TODO: Uncomment when backend provides clinicId/doctorId in AppointmentDto
    // useEffect(() => {
    //     if (selectedDate && appointment) {
    //         fetchAvailableSlots();
    //     }
    // }, [selectedDate, appointment]);

    const handleReschedule = async () => {
        if (!appointment || !selectedSlot) return;

        setIsSubmitting(true);
        try {
            // For guest appointments with token
            // In real implementation, you'd need the reschedule token from appointment
            const token = 'reschedule_token'; // TODO: Get from appointment

            const response = await rescheduleAppointmentByToken(
                token,
                selectedSlot.startAt,
                selectedSlot.endAt
            );

            if (response.isSuccess) {
                alert('Đổi lịch thành công!');
                onRescheduleSuccess();
                onClose();
            } else {
                alert(response.message || 'Không thể đổi lịch');
            }
        } catch (error: any) {
            console.error('Error rescheduling:', error);
            alert(error.response?.data?.message || 'Đã xảy ra lỗi khi đổi lịch');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !appointment) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Đổi lịch hẹn
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition"
                    >
                        <FiX className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    {/* Current appointment info */}
                    <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                            Lịch hẹn hiện tại
                        </div>
                        <div className="text-sm font-medium text-slate-900">
                            {appointment.title}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <FiCalendar className="w-3.5 h-3.5" />
                            <span>{appointment.date}</span>
                            <FiClock className="w-3.5 h-3.5 ml-2" />
                            <span>{appointment.time}</span>
                        </div>
                    </div>

                    {/* Date picker */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">
                            Chọn ngày mới
                        </label>
                        <div className="relative">
                            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="date"
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                min={new Date().toISOString().split('T')[0]}
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Slots - Simplified version */}
                    {selectedDate && (
                        <div className="space-y-3">
                            <h3 className="font-semibold text-slate-800 text-sm">
                                Chọn giờ mới
                            </h3>
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                <p className="text-xs text-amber-800">
                                    ⚠️ Chức năng chọn slot đang được phát triển.
                                    Vui lòng liên hệ phòng khám để đổi lịch.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t bg-slate-50 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleReschedule}
                        disabled={!selectedSlot || isSubmitting}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đổi lịch'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RescheduleAppointmentModal;
