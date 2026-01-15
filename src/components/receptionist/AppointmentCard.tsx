import { useState } from 'react';
import { FiCheck, FiAlertCircle } from 'react-icons/fi';
import { FiUser, FiPhone, FiCalendar, FiClock, FiFileText } from 'react-icons/fi';
import {
    confirmAppointment,
    cancelAppointment,
    checkinAppointment,
    type ReceptionistAppointment,
} from '@/services/apiReceptionist';
import CredentialModal from './CredentialModal';

interface AppointmentCardProps {
    appointment: ReceptionistAppointment;
    onUpdate: () => void;
}

export default function AppointmentCard({
    appointment,
    onUpdate,
}: AppointmentCardProps) {
    const [loading, setLoading] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    // Credential modal state
    const [showCredentialModal, setShowCredentialModal] = useState(false);
    const [credentials, setCredentials] = useState<{
        username: string;
        password: string;
        patientName: string;
        patientPhone: string;
    } | null>(null);

    // Success/Error Modal states
    const [successModal, setSuccessModal] = useState<{
        show: boolean;
        message: string;
    }>({ show: false, message: '' });
    const [errorModal, setErrorModal] = useState<{
        show: boolean;
        message: string;
    }>({ show: false, message: '' });

    // Helper function to format datetime
    const formatDateTime = (isoString: string) => {
        const date = new Date(isoString);
        return {
            date: date.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            }),
            time: date.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            }),
        };
    };

    const startDateTime = formatDateTime(appointment.startAt);
    const endTime = formatDateTime(appointment.endAt).time;

    const handleConfirm = async () => {
        try {
            setLoading(true);
            const result = await confirmAppointment(appointment.id);

            // Debug logging
            console.log('🔍 Confirm API Response:', result);
            console.log('🔍 Credentials:', {
                username: result.data?.username,
                password: result.data?.password,
            });

            if (result.isSuccess && result.data) {
                // Check if new account was created (credentials present)
                if (result.data.username && result.data.password) {
                    setCredentials({
                        username: result.data.username,
                        password: result.data.password,
                        patientName: appointment.patientName,
                        patientPhone: appointment.phone,
                    });
                    setShowCredentialModal(true);
                } else {
                    setSuccessModal({
                        show: true,
                        message: 'Xác nhận lịch hẹn thành công!',
                    });
                }
                onUpdate();
            }
        } catch (error: any) {
            console.error('Error confirming appointment:', error);
            setErrorModal({
                show: true,
                message: error.message || 'Không thể xác nhận',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCheckin = async () => {
        try {
            setLoading(true);
            const result = await checkinAppointment(appointment.id);
            if (result.isSuccess && result.data) {
                setSuccessModal({
                    show: true,
                    message: 'Check-in thành công!',
                });
                onUpdate();
            }
        } catch (error: any) {
            console.error('Error checking in:', error);
            setErrorModal({
                show: true,
                message: error.message || 'Không thể check-in',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancelSubmit = async () => {
        try {
            setLoading(true);
            const result = await cancelAppointment(
                appointment.id,
                cancelReason || undefined
            );
            if (result.isSuccess && result.data) {
                setShowCancelDialog(false);
                setCancelReason('');
                setSuccessModal({
                    show: true,
                    message: 'Hủy lịch hẹn thành công!',
                });
                onUpdate();
            }
        } catch (error: any) {
            console.error('Error cancelling appointment:', error);
            setErrorModal({
                show: true,
                message: error.message || 'Không thể hủy',
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const badges: Record<
            string,
            { bg: string; text: string; label: string }
        > = {
            confirmed: {
                bg: 'bg-[#E0ECFF]',
                text: 'text-[#2563EB]',
                label: 'Đã xác nhận',
            },
            pending: {
                bg: 'bg-[#FEF3C7]',
                text: 'text-[#92400E]',
                label: 'Chờ xác nhận',
            },
            'checked-in': {
                bg: 'bg-[#DBEAFE]',
                text: 'text-[#1E40AF]',
                label: 'Đã check-in',
            },
            inprogress: {
                bg: 'bg-[#E0E7FF]',
                text: 'text-[#4338CA]',
                label: 'Đang khám',
            },
            completed: {
                bg: 'bg-[#DCFCE7]',
                text: 'text-[#15803D]',
                label: 'Hoàn thành',
            },
            cancelled: {
                bg: 'bg-[#FEE2E2]',
                text: 'text-[#B91C1C]',
                label: 'Đã huỷ',
            },
            noshow: {
                bg: 'bg-[#FEE2E2]',
                text: 'text-[#DC2626]',
                label: 'Không đến',
            },
        };
        const badge = badges[status] || badges.pending;
        return (
            <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}
            >
                {badge.label}
            </span>
        );
    };

    return (
        <>
            <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 transition-all">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <FiUser className="w-4 h-4 text-[#2563EB]" />
                            <h3 className="font-semibold text-lg text-slate-900">
                                {appointment.patientName}
                            </h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <FiPhone className="w-3.5 h-3.5" />
                            <p>{appointment.phone}</p>
                        </div>
                    </div>
                    {getStatusBadge(appointment.status)}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-start gap-2">
                        <FiFileText className="w-4 h-4 text-slate-400 mt-0.5" />
                        <div>
                            <span className="text-xs text-slate-500 block">Dịch vụ</span>
                            <p className="text-sm font-medium text-slate-900">{appointment.service}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <FiUser className="w-4 h-4 text-slate-400 mt-0.5" />
                        <div>
                            <span className="text-xs text-slate-500 block">Bác sĩ</span>
                            <p className="text-sm font-medium text-slate-900">{appointment.doctor}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <FiCalendar className="w-4 h-4 text-slate-400 mt-0.5" />
                        <div>
                            <span className="text-xs text-slate-500 block">Ngày</span>
                            <p className="text-sm font-medium text-slate-900">{startDateTime.date}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <FiClock className="w-4 h-4 text-slate-400 mt-0.5" />
                        <div>
                            <span className="text-xs text-slate-500 block">Giờ</span>
                            <p className="text-sm font-medium text-slate-900">
                                {startDateTime.time} - {endTime} ({appointment.duration} phút)
                            </p>
                        </div>
                    </div>
                </div>

                {appointment.notes && (
                    <div className="text-sm bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4">
                        <span className="text-blue-900 font-medium">Ghi chú:</span>{' '}
                        <span className="text-blue-800">{appointment.notes}</span>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap">
                    {appointment.status === 'pending' && (
                        <button
                            onClick={handleConfirm}
                            disabled={loading}
                            className="px-4 py-2 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 font-medium transition"
                        >
                            {loading ? 'Đang xử lý...' : 'Xác nhận'}
                        </button>
                    )}

                    {appointment.status === 'confirmed' && (
                        <button
                            onClick={handleCheckin}
                            disabled={loading}
                            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium transition"
                        >
                            {loading ? 'Đang xử lý...' : 'Check-in'}
                        </button>
                    )}

                    {(appointment.status === 'pending' ||
                        appointment.status === 'confirmed') && (
                            <button
                                onClick={() => setShowCancelDialog(true)}
                                disabled={loading}
                                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 font-medium transition"
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
                        <h3 className="text-lg font-semibold mb-4">
                            Hủy lịch hẹn
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Bạn có chắc muốn hủy lịch hẹn của{' '}
                            <strong>{appointment.patientName}</strong>?
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

            {/* Credential Modal */}
            {showCredentialModal && credentials && (
                <CredentialModal
                    isOpen={showCredentialModal}
                    onClose={() => {
                        setShowCredentialModal(false);
                        setCredentials(null);
                    }}
                    credentials={credentials}
                />
            )}

            {/* Success Modal */}
            {successModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                            <FiCheck className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            Thành công!
                        </h3>
                        <p className="text-sm text-slate-600 mb-4">
                            {successModal.message}
                        </p>
                        <button
                            onClick={() =>
                                setSuccessModal({ show: false, message: '' })
                            }
                            className="w-full px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 transition"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}

            {/* Error Modal */}
            {errorModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                            <FiAlertCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            Lỗi
                        </h3>
                        <p className="text-sm text-slate-600 mb-4">
                            {errorModal.message}
                        </p>
                        <button
                            onClick={() =>
                                setErrorModal({ show: false, message: '' })
                            }
                            className="w-full px-4 py-2.5 text-sm font-medium text-white bg-slate-600 rounded-xl hover:bg-slate-700 transition"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
