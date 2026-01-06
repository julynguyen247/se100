import React from "react";
import { FiUsers, FiCalendar, FiClock, FiCreditCard, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ReceptionistDashboard: React.FC = () => {
    const navigate = useNavigate();

    const stats = [
        { icon: FiUsers, label: "Bệnh nhân chờ", value: "12", color: "text-[#2563EB]", bg: "bg-blue-50" },
        { icon: FiCalendar, label: "Lịch hẹn hôm nay", value: "24", color: "text-emerald-600", bg: "bg-emerald-50" },
        { icon: FiClock, label: "Chờ xác nhận", value: "5", color: "text-amber-600", bg: "bg-amber-50" },
        { icon: FiCreditCard, label: "Chờ thanh toán", value: "3", color: "text-purple-600", bg: "bg-purple-50" },
    ];

    const todayAppointments = [
        { id: 1, name: "Nguyễn Văn A", service: "Khám tổng quát", time: "08:30", status: "confirmed" },
        { id: 2, name: "Trần Thị B", service: "Tẩy trắng răng", time: "09:00", status: "pending" },
        { id: 3, name: "Lê Văn C", service: "Nhổ răng khôn", time: "09:30", status: "confirmed" },
        { id: 4, name: "Phạm Thị D", service: "Trám răng", time: "10:00", status: "pending" },
    ];

    const statusColors: Record<string, string> = {
        confirmed: "bg-emerald-100 text-emerald-700",
        pending: "bg-amber-100 text-amber-700",
    };

    const statusLabels: Record<string, string> = {
        confirmed: "Đã xác nhận",
        pending: "Chờ xác nhận",
    };

    return (
        <div className="px-6 py-8 lg:px-10">
            <div className="max-w-[1400px] mx-auto space-y-8">
                {/* Header */}
                <div>
                    <span className="inline-flex items-center rounded-full bg-[#E0ECFF] text-[#2563EB] text-[11px] font-semibold px-4 py-1.5 tracking-wide uppercase mb-3">
                        RECEPTIONIST DASHBOARD
                    </span>
                    <h1 className="text-xl font-semibold text-slate-900">
                        Xin chào, Trần Thị B!
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Tổng quan hoạt động tiếp nhận hôm nay
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => {
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

                        <div className="space-y-3">
                            {todayAppointments.map((apt) => (
                                <div
                                    key={apt.id}
                                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#E0ECFF] rounded-full flex items-center justify-center text-[#2563EB] font-semibold text-sm">
                                            {apt.name.charAt(apt.name.lastIndexOf(" ") + 1)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{apt.name}</p>
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
