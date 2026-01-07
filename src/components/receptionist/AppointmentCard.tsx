import { useState } from 'react';
import {
    confirmAppointment,
    cancelAppointment,
    checkinAppointment,
    type ReceptionistAppointment,
} from '@/services/apiReceptionist';

interface AppointmentCardProps {
    appointment: ReceptionistAppointment;
    onUpdate: () => void;
}

export default function AppointmentCard({ appointment, onUpdate }: AppointmentCardProps) {
    const [loading, setLoading] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    const handleConfirm = async () => {
        try {
            setLoading(true);
            const result = await confirmAppointment(appointment.id);
            if (result.isSuccess && result.data) {
                alert('✅ Xác nhận lịch hẹn thành công!');
                onUpdate();
            }
        } catch (error: any) {
            console.error('Error confirming appointment:', error);
            alert('❌ Lỗi: ' + (error.message || 'Không thể xác nhận'));
        } finally {
            setLoading(false);
        }
    };

    const handleCheckin = async () => {
        try {
            setLoading(true);
            const result = await checkinAppointment(appointment.id);
            if (result.isSuccess && result.data) {
                alert('✅ Check-in thành công!');
                onUpdate();
            }
        } catch (error: any) {
            console.error('Error checking in:', error);
            alert('❌ Lỗi: ' + (error.message || 'Không thể check-in'));
        } finally {
            setLoading(false);
        }
    };

    const handleCancelSubmit = async () => {
        try {
            setLoading(true);
            const result = await cancelAppointment(appointment.id, cancelReason || undefined);
            if (result.isSuccess && result.data) {
                alert('✅ Hủy lịch hẹn thành công!');
                setShowCancelDialog(false);
                setCancelReason('');
                onUpdate();
            }
        } catch (error: any) {
            console.error('Error cancelling appointment:', error);
            alert('❌ Lỗi: ' + (error.message || 'Không thể hủy'));
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const badges: Record<string, { bg: string; text: string; label: string }> = {
            confirmed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Đã xác nhận' },
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Chờ xác nhận' },
            'checked-in': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Đang khám' },
            cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Đã hủy' },
        };
        const badge = badges[status] || badges.pending;
        return (
            <span className={`px-2 py-1 rounded text-xs font-medium ${badge.bg} ${badge.text}`}>
                {badge.label}
            </span>
        );
    };

    return (
        <>
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg">{appointment.patientName}</h3>
                        <p className="text-sm text-gray-600">{appointment.phone}</p>
                    </div>
                    {getStatusBadge(appointment.status)}
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                        <span className="text-gray-500">Dịch vụ:</span>
                        <p className="font-medium">{appointment.service}</p>
                    </div>
                    <div>
                        <span className="text-gray-500">Bác sĩ:</span>
                        <p className="font-medium">{appointment.doctor}</p>
                    </div>
                    <div>
                        <span className="text-gray-500">Ngày:</span>
                        <p className="font-medium">{appointment.date}</p>
                    </div>
                    <div>
                        <span className="text-gray-500">Giờ:</span>
                        <p className="font-medium">
                            {appointment.time} ({appointment.duration} phút)
                        </p>
                    </div>
                </div>

                {appointment.notes && (
                    <div className="text-sm bg-gray-50 p-2 rounded mb-3">
                        <span className="text-gray-500">Ghi chú:</span> {appointment.notes}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap">
                    {appointment.status === 'pending' && (
                        <button
                            onClick={handleConfirm}
                            disabled={loading}
                            className="px-3 py-1.5 text-sm bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                        >
                            {loading ? 'Đang xử lý...' : 'Xác nhận'}
                        </button>
                    )}

                    {appointment.status === 'confirmed' && (
                        <button
                            onClick={handleCheckin}
                            disabled={loading}
                            className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                        >
                            {loading ? 'Đang xử lý...' : 'Check-in'}
                        </button>
                    )}

                    {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                        <button
                            onClick={() => setShowCancelDialog(true)}
                            disabled={loading}
                            className="px-3 py-1.5 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                        >
                            Hủy lịch
                        </button>
                    )}
                </div>
            </div>

            {/* Cancel Dialog */}
            {showCancelDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Hủy lịch hẹn</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Bạn có chắc muốn hủy lịch hẹn của <strong>{appointment.patientName}</strong>?
                        </p>
                        <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Lý do hủy (không bắt buộc)"
                            className="w-full border border-gray-300 rounded p-2 mb-4 text-sm"
                            rows={3}
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => {
                                    setShowCancelDialog(false);
                                    setCancelReason('');
                                }}
                                className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                            >
                                Đóng
                            </button>
                            <button
                                onClick={handleCancelSubmit}
                                disabled={loading}
                                className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                            >
                                {loading ? 'Đang hủy...' : 'Xác nhận hủy'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
