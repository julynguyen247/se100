import React, { useEffect, useState } from 'react';
import {
    FiUsers,
    FiClipboard,
    FiClock,
    FiCalendar,
    FiChevronRight,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import {
    getDashboardStats,
    DoctorDashboardStats,
    DoctorQueueItem,
} from '@/services/apiDoctor';

const DoctorDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dashboardData, setDashboardData] =
        useState<DoctorDashboardStats | null>(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getDashboardStats();
                if (response.isSuccess && response.data) {
                    setDashboardData(response.data);
                } else {
                    setError(
                        response.message || 'Không thể tải dữ liệu dashboard'
                    );
                }
            } catch (err: unknown) {
                console.error('Error fetching dashboard:', err);
                setError('Lỗi kết nối server');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const getStatusConfig = (status: string) => {
        const configs: Record<
            string,
            { label: string; bg: string; text: string }
        > = {
            pending: {
                label: 'Chờ xác nhận',
                bg: 'bg-gray-100',
                text: 'text-gray-700',
            },
            confirmed: {
                label: 'Đã xác nhận',
                bg: 'bg-blue-100',
                text: 'text-blue-700',
            },
            checkedin: {
                label: 'Đã check-in',
                bg: 'bg-amber-100',
                text: 'text-amber-700',
            },
            inprogress: {
                label: 'Đang khám',
                bg: 'bg-purple-100',
                text: 'text-purple-700',
            },
            completed: {
                label: 'Hoàn thành',
                bg: 'bg-emerald-100',
                text: 'text-emerald-700',
            },
        };
        return (
            configs[status] || {
                label: status,
                bg: 'bg-gray-100',
                text: 'text-gray-700',
            }
        );
    };

    const stats = dashboardData
        ? [
              {
                  icon: FiUsers,
                  label: 'Bệnh nhân chờ khám',
                  value: String(dashboardData.waitingCount),
                  color: 'text-[#2563EB]',
                  bg: 'bg-blue-50',
              },
              {
                  icon: FiClipboard,
                  label: 'Đã khám hôm nay',
                  value: String(dashboardData.examinedToday),
                  color: 'text-emerald-600',
                  bg: 'bg-emerald-50',
              },
              {
                  icon: FiClock,
                  label: 'Thời gian khám TB',
                  value: dashboardData.averageExamTime,
                  color: 'text-amber-600',
                  bg: 'bg-amber-50',
              },
              {
                  icon: FiCalendar,
                  label: 'Lịch hẹn hôm nay',
                  value: String(dashboardData.appointmentsToday),
                  color: 'text-purple-600',
                  bg: 'bg-purple-50',
              },
          ]
        : [
              {
                  icon: FiUsers,
                  label: 'Bệnh nhân chờ khám',
                  value: '-',
                  color: 'text-[#2563EB]',
                  bg: 'bg-blue-50',
              },
              {
                  icon: FiClipboard,
                  label: 'Đã khám hôm nay',
                  value: '-',
                  color: 'text-emerald-600',
                  bg: 'bg-emerald-50',
              },
              {
                  icon: FiClock,
                  label: 'Thời gian khám TB',
                  value: '-',
                  color: 'text-amber-600',
                  bg: 'bg-amber-50',
              },
              {
                  icon: FiCalendar,
                  label: 'Lịch hẹn hôm nay',
                  value: '-',
                  color: 'text-purple-600',
                  bg: 'bg-purple-50',
              },
          ];

    const waitingPatients: DoctorQueueItem[] =
        dashboardData?.waitingQueue || [];

    if (loading) {
        return (
            <div className="px-6 py-8 lg:px-10">
                <div className="max-w-[1400px] mx-auto flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
                        <p className="mt-4 text-slate-500">
                            Đang tải dữ liệu...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-6 py-8 lg:px-10">
                <div className="max-w-[1400px] mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <p className="text-red-600">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="px-6 py-8 lg:px-10">
            <div className="max-w-[1400px] mx-auto space-y-8">
                {/* Header */}
                <div>
                    <span className="inline-flex items-center rounded-full bg-[#E0ECFF] text-[#2563EB] text-[11px] font-semibold px-4 py-1.5 tracking-wide uppercase mb-3">
                        DOCTOR DASHBOARD
                    </span>
                    <h1 className="text-xl font-semibold text-slate-900">
                        Xin chào, Bác sĩ!
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Tổng quan hoạt động khám bệnh hôm nay
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4"
                            >
                                <div
                                    className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}
                                >
                                    <Icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">
                                        {stat.label}
                                    </p>
                                    <p className="text-lg font-semibold text-slate-900 mt-0.5">
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Main content */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Waiting Queue */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-base font-semibold text-slate-900">
                                Hàng đợi bệnh nhân
                            </h2>
                            <button
                                onClick={() => navigate('/doctor/queue')}
                                className="flex items-center gap-1 text-sm text-[#2563EB] hover:underline"
                            >
                                <span>Xem tất cả</span>
                                <FiChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {waitingPatients.length === 0 ? (
                            <div className="text-center py-8 text-slate-400">
                                <FiUsers className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>Không có bệnh nhân trong hàng đợi</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {waitingPatients.slice(0, 5).map((patient) => {
                                    const statusConfig = getStatusConfig(
                                        patient.status
                                    );
                                    return (
                                        <div
                                            key={patient.id}
                                            className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-[#E0ECFF] rounded-full flex items-center justify-center text-[#2563EB] font-semibold text-sm">
                                                    {patient.queueNumber}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">
                                                        {patient.patientName}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {patient.service}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-slate-500">
                                                    {patient.time}
                                                </p>
                                                <span
                                                    className={`inline-block mt-1 px-2 py-0.5 ${statusConfig.bg} ${statusConfig.text} text-[10px] font-medium rounded-full`}
                                                >
                                                    {statusConfig.label}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <button
                            onClick={() => navigate('/doctor/treatment')}
                            className="mt-4 w-full py-3 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1D4ED8] transition"
                        >
                            Bắt đầu khám bệnh
                        </button>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-base font-semibold text-slate-900 mb-5">
                            Thao tác nhanh
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => navigate('/doctor/queue')}
                                className="p-4 bg-blue-50 rounded-xl text-left hover:bg-blue-100 transition"
                            >
                                <FiUsers className="w-6 h-6 text-[#2563EB] mb-2" />
                                <p className="text-sm font-medium text-slate-900">
                                    Hàng đợi
                                </p>
                                <p className="text-xs text-slate-500">
                                    Xem danh sách chờ
                                </p>
                            </button>

                            <button
                                onClick={() => navigate('/doctor/patients')}
                                className="p-4 bg-emerald-50 rounded-xl text-left hover:bg-emerald-100 transition"
                            >
                                <FiClipboard className="w-6 h-6 text-emerald-600 mb-2" />
                                <p className="text-sm font-medium text-slate-900">
                                    Hồ sơ bệnh nhân
                                </p>
                                <p className="text-xs text-slate-500">
                                    Tra cứu hồ sơ
                                </p>
                            </button>

                            <button
                                onClick={() => navigate('/doctor/treatment')}
                                className="p-4 bg-purple-50 rounded-xl text-left hover:bg-purple-100 transition"
                            >
                                <FiClipboard className="w-6 h-6 text-purple-600 mb-2" />
                                <p className="text-sm font-medium text-slate-900">
                                    Khám bệnh
                                </p>
                                <p className="text-xs text-slate-500">
                                    Nhập kết quả khám
                                </p>
                            </button>

                            <button
                                onClick={() => navigate('/doctor/prescription')}
                                className="p-4 bg-amber-50 rounded-xl text-left hover:bg-amber-100 transition"
                            >
                                <FiClipboard className="w-6 h-6 text-amber-600 mb-2" />
                                <p className="text-sm font-medium text-slate-900">
                                    Kê đơn thuốc
                                </p>
                                <p className="text-xs text-slate-500">
                                    Tạo đơn thuốc
                                </p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
