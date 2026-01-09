import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cancelAppointmentByToken } from '@/services/apiPatient';
import { FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';

export default function CancelAppointmentPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<
        'idle' | 'loading' | 'success' | 'error'
    >('idle');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setErrorMessage('Token không hợp lệ');
            return;
        }

        // Optionally fetch appointment details first
        // For now, we'll just show the cancel button
    }, [token]);

    const handleCancel = async () => {
        if (!token) {
            setErrorMessage('Token không hợp lệ');
            setStatus('error');
            return;
        }

        try {
            setLoading(true);
            setStatus('loading');
            const response = await cancelAppointmentByToken(token);

            if (response?.isSuccess) {
                setStatus('success');
            } else {
                setStatus('error');
                setErrorMessage(response?.message || 'Không thể hủy lịch hẹn');
            }
        } catch (error: any) {
            setStatus('error');
            if (error?.response?.data?.message) {
                setErrorMessage(error.response.data.message);
            } else if (error?.message) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage('Đã xảy ra lỗi khi hủy lịch hẹn');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#E5F0FF] via-[#EFF4FF] to-[#DDEBFF] p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                {status === 'idle' && (
                    <>
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-500 mb-4">
                                <FiAlertCircle className="w-8 h-8" />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-800 text-center">
                                Hủy Lịch Hẹn
                            </h1>
                            <p className="text-sm text-slate-500 mt-2 text-center">
                                Bạn có chắc chắn muốn hủy lịch hẹn này không?
                            </p>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-yellow-800">
                                <strong>Lưu ý:</strong> Hành động này không thể
                                hoàn tác. Bạn cần đặt lịch mới nếu muốn khám
                                lại.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/')}
                                className="flex-1 px-4 py-2.5 text-sm font-medium border border-slate-300 rounded-lg hover:bg-slate-50 transition"
                            >
                                Quay lại
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={loading}
                                className="flex-1 px-4 py-2.5 text-sm font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                {loading ? 'Đang hủy...' : 'Xác nhận hủy'}
                            </button>
                        </div>
                    </>
                )}

                {status === 'loading' && (
                    <div className="flex flex-col items-center py-8">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-blue-500 mb-4"></div>
                        <p className="text-slate-600">Đang xử lý...</p>
                    </div>
                )}

                {status === 'success' && (
                    <>
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-500 mb-4">
                                <FiCheckCircle className="w-8 h-8" />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-800 text-center">
                                Hủy Thành Công
                            </h1>
                            <p className="text-sm text-slate-500 mt-2 text-center">
                                Lịch hẹn của bạn đã được hủy thành công.
                            </p>
                        </div>

                        <button
                            onClick={() => navigate('/')}
                            className="w-full px-4 py-2.5 text-sm font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                            Về Trang Chủ
                        </button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-500 mb-4">
                                <FiXCircle className="w-8 h-8" />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-800 text-center">
                                Có Lỗi Xảy Ra
                            </h1>
                            <p className="text-sm text-red-500 mt-2 text-center">
                                {errorMessage}
                            </p>
                        </div>

                        <button
                            onClick={() => navigate('/')}
                            className="w-full px-4 py-2.5 text-sm font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                            Về Trang Chủ
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
