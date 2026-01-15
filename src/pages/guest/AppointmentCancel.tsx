import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiX, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { cancelAppointment } from '@/services/apiGuest';

const AppointmentCancel: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleCancel = () => {
        if (!token) {
            setError('Token không hợp lệ');
            return;
        }
        setShowConfirmModal(true);
    };

    const confirmCancel = async () => {
        if (!token) return;

        setShowConfirmModal(false);
        setLoading(true);
        setError(null);

        try {
            const response = await cancelAppointment(token);
            if (response.isSuccess) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/booking');
                }, 3000);
            } else {
                setError(
                    response.message ||
                        'Không thể hủy lịch hẹn. Vui lòng thử lại.'
                );
            }
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                    'Đã xảy ra lỗi. Vui lòng thử lại sau.'
            );
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiAlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Link không hợp lệ
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Đường link hủy lịch hẹn không hợp lệ. Vui lòng kiểm tra
                        lại email của bạn.
                    </p>
                    <button
                        onClick={() => navigate('/booking')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Quay lại trang đặt lịch
                    </button>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiCheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Đã hủy lịch hẹn thành công!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Lịch hẹn của bạn đã được hủy. Bạn sẽ được chuyển về
                        trang đặt lịch...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiX className="w-8 h-8 text-red-600" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                    Hủy lịch hẹn
                </h1>
                <p className="text-gray-600 text-center mb-8">
                    Bạn có chắc chắn muốn hủy lịch hẹn này?
                </p>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                <div className="space-y-3">
                    <button
                        onClick={handleCancel}
                        disabled={loading}
                        className="w-full px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Đang xử lý...' : 'Xác nhận hủy lịch hẹn'}
                    </button>
                    <button
                        onClick={() => navigate('/booking')}
                        disabled={loading}
                        className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
                    >
                        Quay lại
                    </button>
                </div>

                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                        <strong>Lưu ý:</strong> Bạn không thể hủy lịch hẹn trong
                        vòng 2 giờ trước giờ khám.
                    </p>
                </div>
            </div>

            {/* Confirm Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                            <FiAlertCircle className="w-7 h-7 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            Xác nhận hủy lịch hẹn
                        </h3>
                        <p className="text-sm text-slate-600 mb-4">
                            Bạn có chắc chắn muốn hủy lịch hẹn này?
                        </p>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                            <p className="text-xs text-amber-800">
                                ⚠️ Không thể hủy lịch hẹn trong vòng 2 giờ trước
                                giờ khám.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={confirmCancel}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentCancel;
