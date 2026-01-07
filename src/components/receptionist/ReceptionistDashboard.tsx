import { useEffect, useState } from 'react';
import {
    getDashboardStats,
    getTodayAppointments,
    type DashboardStats,
    type ReceptionistAppointment,
} from '@/services/apiReceptionist';
import AppointmentCard from './AppointmentCard.tsx';

export default function ReceptionistDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [appointments, setAppointments] = useState<ReceptionistAppointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [statsRes, appointmentsRes] = await Promise.all([
                getDashboardStats(),
                getTodayAppointments(undefined, 10),
            ]);

            if (statsRes.isSuccess && statsRes.data) {
                setStats(statsRes.data);
            }
            if (appointmentsRes.isSuccess && appointmentsRes.data) {
                setAppointments(appointmentsRes.data);
            }
        } catch (err: any) {
            console.error('Error fetching dashboard data:', err);
            setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Đang tải dữ liệu...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">
                    <p className="text-lg font-semibold">Lỗi!</p>
                    <p>{error}</p>
                    <button
                        onClick={fetchDashboardData}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Dashboard Lễ Tân</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-sm font-medium text-blue-600 mb-2">
                        Bệnh nhân chờ khám
                    </h3>
                    <p className="text-3xl font-bold text-blue-900">
                        {stats?.patientsWaiting || 0}
                    </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-sm font-medium text-green-600 mb-2">
                        Lịch hẹn hôm nay
                    </h3>
                    <p className="text-3xl font-bold text-green-900">
                        {stats?.todayAppointments || 0}
                    </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="text-sm font-medium text-yellow-600 mb-2">
                        Chờ xác nhận
                    </h3>
                    <p className="text-3xl font-bold text-yellow-900">
                        {stats?.pendingConfirmation || 0}
                    </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <h3 className="text-sm font-medium text-purple-600 mb-2">
                        Chờ thanh toán
                    </h3>
                    <p className="text-3xl font-bold text-purple-900">
                        {stats?.pendingPayment || 0}
                    </p>
                </div>
            </div>

            {/* Today's Appointments */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Lịch hẹn hôm nay</h2>
                    <button
                        onClick={fetchDashboardData}
                        className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Làm mới
                    </button>
                </div>

                {appointments.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                        Không có lịch hẹn nào hôm nay
                    </p>
                ) : (
                    <div className="space-y-3">
                        {appointments.map((appointment) => (
                            <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                                onUpdate={fetchDashboardData}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
