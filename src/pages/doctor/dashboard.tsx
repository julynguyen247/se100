import React from "react";
import { FiUsers, FiClipboard, FiClock, FiCalendar, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const DoctorDashboard: React.FC = () => {
    const navigate = useNavigate();

    const stats = [
        { icon: FiUsers, label: "Bệnh nhân chờ khám", value: "8", color: "text-[#2563EB]", bg: "bg-blue-50" },
        { icon: FiClipboard, label: "Đã khám hôm nay", value: "12", color: "text-emerald-600", bg: "bg-emerald-50" },
        { icon: FiClock, label: "Thời gian khám TB", value: "25 phút", color: "text-amber-600", bg: "bg-amber-50" },
        { icon: FiCalendar, label: "Lịch hẹn hôm nay", value: "15", color: "text-purple-600", bg: "bg-purple-50" },
    ];

    const waitingPatients = [
        { id: 1, name: "Nguyễn Văn A", service: "Khám tổng quát", time: "08:30", status: "Đang chờ" },
        { id: 2, name: "Trần Thị B", service: "Trám răng", time: "09:00", status: "Đang chờ" },
        { id: 3, name: "Lê Văn C", service: "Nhổ răng khôn", time: "09:30", status: "Đang chờ" },
    ];

    return (
        <div className="px-6 py-8 lg:px-10">
            <div className="max-w-[1400px] mx-auto space-y-8">
                {/* Header */}
                <div>
                    <span className="inline-flex items-center rounded-full bg-[#E0ECFF] text-[#2563EB] text-[11px] font-semibold px-4 py-1.5 tracking-wide uppercase mb-3">
                        DOCTOR DASHBOARD
                    </span>
                    <h1 className="text-xl font-semibold text-slate-900">
                        Xin chào, BS. Nguyễn Văn A!
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
                    {/* Waiting Queue */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-base font-semibold text-slate-900">Hàng đợi bệnh nhân</h2>
                            <button
                                onClick={() => navigate("/doctor/queue")}
                                className="flex items-center gap-1 text-sm text-[#2563EB] hover:underline"
                            >
                                <span>Xem tất cả</span>
                                <FiChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {waitingPatients.map((patient) => (
                                <div
                                    key={patient.id}
                                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#E0ECFF] rounded-full flex items-center justify-center text-[#2563EB] font-semibold text-sm">
                                            {patient.id}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{patient.name}</p>
                                            <p className="text-xs text-slate-500">{patient.service}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500">{patient.time}</p>
                                        <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-medium rounded-full">
                                            {patient.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => navigate("/doctor/treatment")}
                            className="mt-4 w-full py-3 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1D4ED8] transition"
                        >
                            Bắt đầu khám bệnh
                        </button>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-base font-semibold text-slate-900 mb-5">Thao tác nhanh</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => navigate("/doctor/queue")}
                                className="p-4 bg-blue-50 rounded-xl text-left hover:bg-blue-100 transition"
                            >
                                <FiUsers className="w-6 h-6 text-[#2563EB] mb-2" />
                                <p className="text-sm font-medium text-slate-900">Hàng đợi</p>
                                <p className="text-xs text-slate-500">Xem danh sách chờ</p>
                            </button>

                            <button
                                onClick={() => navigate("/doctor/patients")}
                                className="p-4 bg-emerald-50 rounded-xl text-left hover:bg-emerald-100 transition"
                            >
                                <FiClipboard className="w-6 h-6 text-emerald-600 mb-2" />
                                <p className="text-sm font-medium text-slate-900">Hồ sơ bệnh nhân</p>
                                <p className="text-xs text-slate-500">Tra cứu hồ sơ</p>
                            </button>

                            <button
                                onClick={() => navigate("/doctor/treatment")}
                                className="p-4 bg-purple-50 rounded-xl text-left hover:bg-purple-100 transition"
                            >
                                <FiClipboard className="w-6 h-6 text-purple-600 mb-2" />
                                <p className="text-sm font-medium text-slate-900">Khám bệnh</p>
                                <p className="text-xs text-slate-500">Nhập kết quả khám</p>
                            </button>

                            <button
                                onClick={() => navigate("/doctor/prescription")}
                                className="p-4 bg-amber-50 rounded-xl text-left hover:bg-amber-100 transition"
                            >
                                <FiClipboard className="w-6 h-6 text-amber-600 mb-2" />
                                <p className="text-sm font-medium text-slate-900">Kê đơn thuốc</p>
                                <p className="text-xs text-slate-500">Tạo đơn thuốc</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
