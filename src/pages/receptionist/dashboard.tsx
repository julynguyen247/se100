import React, { useEffect, useState } from "react";
import { FiUsers, FiCalendar, FiClock, FiCreditCard, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getDashboardStats, getTodayAppointments } from "@/services/apiReceptionist";
import type { DashboardStats, ReceptionistAppointment } from "@/services/apiReceptionist";

const ReceptionistDashboard: React.FC = () => {
    const navigate = useNavigate();

    // State
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [appointments, setAppointments] = useState<ReceptionistAppointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch dashboard data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [statsRes, aptsRes] = await Promise.all([
                    getDashboardStats(),
                    getTodayAppointments(undefined, 4) // Limit 4 for dashboard preview
                ]);

                if (statsRes.isSuccess && statsRes.data) {
                    setStats(statsRes.data);
                }
                if (aptsRes.isSuccess && aptsRes.data) {
                    setAppointments(aptsRes.data);
                }
            } catch (err: any) {
                console.error('Error fetching dashboard data:', err);
                setError('Có lỗi xảy ra khi tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Stats configuration
    const statsConfig = [
        {
            icon: FiUsers,
            label: "Bệnh nhân chờ",
            value: stats?.patientsWaiting ?? 0,
            color: "text-[#2563EB]",
            bg: "bg-blue-50"
        },
        {
            icon: FiCalendar,
            label: "Lịch hẹn hôm nay",
            value: stats?.todayAppointments ?? 0,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        {
            icon: FiClock,
            label: "Chờ xác nhận",
            value: stats?.pendingConfirmation ?? 0,
            color: "text-amber-600",
            bg: "bg-amber-50"
        },
        {
            icon: FiCreditCard,
            label: "Chờ thanh toán",
            value: stats?.pendingPayment ?? 0,
            color: "text-purple-600",
            bg: "bg-purple-50"
        },
    ];

    const statusColors: Record<string, string> = {
        confirmed: "bg-emerald-100 text-emerald-700",
        pending: "bg-amber-100 text-amber-700",
        "checked-in": "bg-blue-100 text-blue-700",
        cancelled: "bg-red-100 text-red-700",
    };

    const statusLabels: Record<string, string> = {
        confirmed: "Đã xác nhận",
        pending: "Chờ xác nhận",
        "checked-in": "Đã check-in",
        cancelled: "Đã hủy",
    };

    if (loading) {
        return (
            <div className="px-6 py-8 lg:px-10">
                <div className="max-w-[1400px] mx-auto flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mb-4"></div>
                        <p className="text-slate-600">Đang tải dữ liệu dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-6 py-8 lg:px-10">
                <div className="max-w-[1400px] mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                        <p className="text-red-700 font-semibold mb-2">Lỗi tải dữ liệu</p>
                        <p className="text-red-600 text-sm">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
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
                        RECEPTIONIST DASHBOARD
                    </span>
                    <h1 className="text-xl font-semibold text-slate-900">
                        Xin chào, Lễ tân!
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Tổng quan hoạt động tiếp nhận hôm nay
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {statsConfig.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
                                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                                    <Icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">{stat.label}</p>
                                    <p className="text-lg font-semibold text-slate-900 mt-0.5">{stat.value}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Main content */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Today's Appointments */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-base font-semibold text-slate-900">Lịch hẹn hôm nay</h2>
                            <button
                                onClick={() => navigate("/receptionist/appointments")}
                                className="flex items-center gap-1 text-sm text-[#2563EB] hover:underline"
                            >
                                <span>Xem tất cả</span>
                                <FiChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {appointments.length === 0 ? (
                            <div className="text-center py-8">
                                <FiCalendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-sm text-slate-500">Không có lịch hẹn nào hôm nay</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {appointments.map((apt) => (
                                    <div
                                        key={apt.id}
                                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#E0ECFF] rounded-full flex items-center justify-center text-[#2563EB] font-semibold text-sm">
                                                {apt.patientName.charAt(apt.patientName.lastIndexOf(" ") + 1)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{apt.patientName}</p>
                                                <p className="text-xs text-slate-500">{apt.service}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-500">{apt.time}</p>
                                            <span className={`inline-block mt-1 px-2 py-0.5 ${statusColors[apt.status]} text-[10px] font-medium rounded-full`}>
                                                {statusLabels[apt.status]}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={() => navigate("/receptionist/appointments")}
                            className="mt-4 w-full py-3 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1D4ED8] transition"
                        >
                            Quản lý lịch hẹn
                        </button>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-base font-semibold text-slate-900 mb-5">Thao tác nhanh</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => navigate("/receptionist/queue")}
                                className="p-4 bg-blue-50 rounded-xl text-left hover:bg-blue-100 transition"
                            >
                                <FiUsers className="w-6 h-6 text-[#2563EB] mb-2" />
                                <p className="text-sm font-medium text-slate-900">Hàng đợi</p>
                                <p className="text-xs text-slate-500">Quản lý hàng chờ</p>
                            </button>

                            <button
                                onClick={() => navigate("/receptionist/appointments")}
                                className="p-4 bg-emerald-50 rounded-xl text-left hover:bg-emerald-100 transition"
                            >
                                <FiCalendar className="w-6 h-6 text-emerald-600 mb-2" />
                                <p className="text-sm font-medium text-slate-900">Lịch hẹn</p>
                                <p className="text-xs text-slate-500">Quản lý lịch hẹn</p>
                            </button>

                            <button
                                onClick={() => navigate("/receptionist/patients")}
                                className="p-4 bg-purple-50 rounded-xl text-left hover:bg-purple-100 transition"
                            >
                                <FiUsers className="w-6 h-6 text-purple-600 mb-2" />
                                <p className="text-sm font-medium text-slate-900">Bệnh nhân</p>
                                <p className="text-xs text-slate-500">Hồ sơ bệnh nhân</p>
                            </button>

                            <button
                                onClick={() => navigate("/receptionist/billing")}
                                className="p-4 bg-amber-50 rounded-xl text-left hover:bg-amber-100 transition"
                            >
                                <FiCreditCard className="w-6 h-6 text-amber-600 mb-2" />
                                <p className="text-sm font-medium text-slate-900">Thanh toán</p>
                                <p className="text-xs text-slate-500">Quản lý thanh toán</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceptionistDashboard;
