import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    rescheduleAppointmentByToken,
    getSlots,
    SlotDto,
} from '@/services/apiPatient';
import { FiCheckCircle, FiXCircle, FiCalendar, FiClock } from 'react-icons/fi';

export default function RescheduleAppointmentPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Parse URL params
    const token = searchParams.get('token');
    const clinicId = searchParams.get('clinicId');
    const doctorId = searchParams.get('doctorId');
    const serviceId = searchParams.get('serviceId');

    const [loading, setLoading] = useState(false);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [availableSlots, setAvailableSlots] = useState<SlotDto[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<SlotDto | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>('');

    const [status, setStatus] = useState<
        'idle' | 'loading' | 'success' | 'error'
    >('idle');
    const [errorMessage, setErrorMessage] = useState('');

    // Check required params on mount
    useEffect(() => {
        if (!token) {
            setStatus('error');
            setErrorMessage('Token không hợp lệ');
            return;
        }

        if (!clinicId || !doctorId) {
            setStatus('error');
            setErrorMessage(
                'Thiếu thông tin để lấy khung giờ. Vui lòng liên hệ hỗ trợ.'
            );
            return;
        }

        // Set default date to today
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        setSelectedDate(`${yyyy}-${mm}-${dd}`);
    }, [token, clinicId, doctorId]);

    // Fetch available slots when date changes
    useEffect(() => {
        if (!clinicId || !doctorId || !selectedDate) return;

        const fetchSlots = async () => {
            try {
                setLoadingSlots(true);
                const response = await getSlots(
                    clinicId,
                    doctorId,
                    selectedDate,
                    serviceId || undefined
                );
                if (response?.isSuccess && response.data) {
                    setAvailableSlots(response.data);
                } else {
                    setAvailableSlots([]);
                }
            } catch (error) {
                console.error('Error fetching slots:', error);
                setAvailableSlots([]);
            } finally {
                setLoadingSlots(false);
            }
        };

        fetchSlots();
    }, [clinicId, doctorId, serviceId, selectedDate]);

    const handleReschedule = async () => {
        if (!token || !selectedSlot) {
            setErrorMessage('Vui lòng chọn khung giờ mới');
            return;
        }

        try {
            setLoading(true);
            setStatus('loading');
            const response = await rescheduleAppointmentByToken(
                token,
                selectedSlot.startAt,
                selectedSlot.endAt
            );

            if (response?.isSuccess) {
                setStatus('success');
            } else {
                setStatus('error');
                setErrorMessage(response?.message || 'Không thể đổi lịch hẹn');
            }
        } catch (error: any) {
            setStatus('error');
            if (error?.response?.data?.message) {
                setErrorMessage(error.response.data.message);
            } else if (error?.message) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage('Đã xảy ra lỗi khi đổi lịch hẹn');
            }
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#E5F0FF] via-[#EFF4FF] to-[#DDEBFF] p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
                {status === 'idle' && (
                    <>
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mb-4">
                                <FiCalendar className="w-8 h-8" />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-800 text-center">
                                Đổi Lịch Hẹn
                            </h1>
                            <p className="text-sm text-slate-500 mt-2 text-center">
                                Chọn ngày và khung giờ mới cho lịch hẹn của bạn
                            </p>
                        </div>

                        {/* Date Picker */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Chọn ngày
                            </label>
                            <div className="relative">
                                <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => {
                                        setSelectedDate(e.target.value);
                                        setSelectedSlot(null);
                                    }}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Time Slots */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Chọn khung giờ
                            </label>
                            {loadingSlots ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-blue-500"></div>
                                </div>
                            ) : availableSlots.length > 0 ? (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-60 overflow-y-auto">
                                    {availableSlots.map((slot, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setSelectedSlot(slot)
                                            }
                                            className={`px-4 py-2.5 text-sm font-medium rounded-lg border transition ${
                                                selectedSlot === slot
                                                    ? 'bg-blue-500 text-white border-blue-500'
                                                    : 'bg-white text-slate-700 border-slate-300 hover:border-blue-500 hover:bg-blue-50'
                                            }`}
                                        >
                                            <FiClock
                                                className="inline mr-1"
                                                size={14}
                                            />
                                            {formatTime(slot.startAt)}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-slate-50 rounded-lg">
                                    <p className="text-sm text-slate-500">
                                        Không có khung giờ trống cho ngày này
                                    </p>
                                </div>
                            )}
                        </div>

                        {selectedSlot && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-blue-800">
                                    <strong>Lịch hẹn mới:</strong>{' '}
                                    {selectedDate} lúc{' '}
                                    {formatTime(selectedSlot.startAt)} -{' '}
                                    {formatTime(selectedSlot.endAt)}
                                </p>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/')}
                                className="flex-1 px-4 py-2.5 text-sm font-medium border border-slate-300 rounded-lg hover:bg-slate-50 transition"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleReschedule}
                                disabled={loading || !selectedSlot}
                                className="flex-1 px-4 py-2.5 text-sm font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                {loading
                                    ? 'Đang xử lý...'
                                    : 'Xác nhận đổi lịch'}
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
                                Đổi Lịch Thành Công
                            </h1>
                            <p className="text-sm text-slate-500 mt-2 text-center">
                                Lịch hẹn của bạn đã được cập nhật thành công.
                            </p>
                        </div>

                        {selectedSlot && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-green-800 text-center">
                                    <strong>Lịch hẹn mới:</strong>{' '}
                                    {selectedDate} lúc{' '}
                                    {formatTime(selectedSlot.startAt)} -{' '}
                                    {formatTime(selectedSlot.endAt)}
                                </p>
                            </div>
                        )}

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

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStatus('idle')}
                                className="flex-1 px-4 py-2.5 text-sm font-medium border border-slate-300 rounded-lg hover:bg-slate-50 transition"
                            >
                                Thử lại
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="flex-1 px-4 py-2.5 text-sm font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                            >
                                Về Trang Chủ
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
