import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    FiCalendar,
    FiClock,
    FiAlertCircle,
    FiCheckCircle,
} from 'react-icons/fi';
import { rescheduleAppointment } from '@/services/apiGuest';

const AppointmentReschedule: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleReschedule = async () => {
        if (!token) {
            setError('Token không hợp lệ');
            return;
        }

        if (!selectedDate || !selectedTime) {
            setError('Vui lòng chọn ngày và giờ khám mới');
            return;
        }

        // Combine date and time
        const startTime = new Date(
            `${selectedDate}T${selectedTime}:00`
        ).toISOString();
        // Assume 30 minute duration
        const endTime = new Date(
            new Date(startTime).getTime() + 30 * 60000
        ).toISOString();

        setLoading(true);
        setError(null);

        try {
            const response = await rescheduleAppointment(
                token,
                startTime,
                endTime
            );
            if (response.isSuccess) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/booking');
                }, 3000);
            } else {
                setError(
                    response.message ||
                        'Không thể đổi lịch hẹn. Vui lòng thử lại.'
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

    // Get minimum date (tomorrow)
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);
    const minDateStr = minDate.toISOString().split('T')[0];

    // Get maximum date (30 days from now)
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    const maxDateStr = maxDate.toISOString().split('T')[0];

    if (!token) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiAlertCircle className="w-8 h-8 text-orange-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Link không hợp lệ
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Đường link đổi lịch hẹn không hợp lệ. Vui lòng kiểm tra
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
                        Đổi lịch hẹn thành công!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Lịch hẹn của bạn đã được cập nhật. Bạn sẽ được chuyển về
                        trang đặt lịch...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiCalendar className="w-8 h-8 text-blue-600" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                    Đổi lịch hẹn
                </h1>
                <p className="text-gray-600 text-center mb-8">
                    Chọn ngày và giờ khám mới
                </p>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                <div className="space-y-6 mb-8">
                    {/* Date Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FiCalendar className="inline w-4 h-4 mr-2" />
                            Chọn ngày
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            min={minDateStr}
                            max={maxDateStr}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Time Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FiClock className="inline w-4 h-4 mr-2" />
                            Chọn giờ
                        </label>
                        <input
                            type="time"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            min="08:00"
                            max="17:00"
                            step="1800"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Giờ khám: 8:00 - 17:00
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={handleReschedule}
                        disabled={loading || !selectedDate || !selectedTime}
                        className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Đang xử lý...' : 'Xác nhận đổi lịch'}
                    </button>
                    <button
                        onClick={() => navigate('/booking')}
                        disabled={loading}
                        className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
                    >
                        Quay lại
                    </button>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                        <strong>Lưu ý:</strong> Vui lòng chọn thời gian phù hợp
                        và đảm bảo bác sĩ còn lịch trống.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AppointmentReschedule;
