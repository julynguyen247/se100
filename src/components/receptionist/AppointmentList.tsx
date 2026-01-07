import { useState, useEffect } from 'react';
import {
    getAppointments,
    type ReceptionistAppointment,
} from '@/services/apiReceptionist';
import AppointmentCard from './AppointmentCard.tsx';

export default function AppointmentList() {
    const [appointments, setAppointments] = useState<ReceptionistAppointment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split('T')[0] // Today
    );
    const [selectedDoctor, setSelectedDoctor] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await getAppointments({
                date: selectedDate,
                doctor: selectedDoctor || undefined,
                status: selectedStatus || undefined,
                search: searchQuery || undefined,
            });

            if (result.isSuccess && result.data) {
                setAppointments(result.data);
            }
        } catch (err: any) {
            console.error('Error fetching appointments:', err);
            setError(err.message || 'Có lỗi xảy ra khi tải danh sách lịch hẹn');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [selectedDate, selectedDoctor, selectedStatus]);

    const handleSearch = () => {
        fetchAppointments();
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Danh sách lịch hẹn</h1>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Date Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ngày khám
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                    </div>

                    {/* Doctor Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bác sĩ
                        </label>
                        <input
                            type="text"
                            value={selectedDoctor}
                            onChange={(e) => setSelectedDoctor(e.target.value)}
                            placeholder="Tên bác sĩ"
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Trạng thái
                        </label>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        >
                            <option value="">Tất cả</option>
                            <option value="pending">Chờ xác nhận</option>
                            <option value="confirmed">Đã xác nhận</option>
                            <option value="checked-in">Đang khám</option>
                            <option value="cancelled">Đã hủy</option>
                        </select>
                    </div>

                    {/* Search */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tìm kiếm
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Tên hoặc SĐT"
                                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                            />
                            <button
                                onClick={handleSearch}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                            >
                                Tìm
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">
                        Kết quả ({appointments.length})
                    </h2>
                    <button
                        onClick={fetchAppointments}
                        disabled={loading}
                        className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {loading ? 'Đang tải...' : 'Làm mới'}
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <p className="text-gray-500 mt-2">Đang tải dữ liệu...</p>
                    </div>
                ) : appointments.length === 0 ? (
                    <p className="text-gray-500 text-center py-12">
                        Không tìm thấy lịch hẹn nào phù hợp
                    </p>
                ) : (
                    <div className="space-y-3">
                        {appointments.map((appointment) => (
                            <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                                onUpdate={fetchAppointments}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
