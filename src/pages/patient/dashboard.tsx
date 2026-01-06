import React, { useState } from "react";
import {
  FiCalendar,
  FiClipboard,
  FiClock,
  FiChevronRight,
  FiPhone,
  FiFileText,
  FiUser,
} from "react-icons/fi";
import BookingModal from "../../components/patient/BookingModal";
import { useNavigate } from "react-router-dom";

const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const stats = [
    { icon: FiCalendar, label: "Lịch hẹn sắp tới", value: "2", color: "text-[#2563EB]", bg: "bg-blue-50" },
    { icon: FiClipboard, label: "Điều trị hoàn thành", value: "8", color: "text-emerald-600", bg: "bg-emerald-50" },
    { icon: FiClock, label: "Lần khám gần nhất", value: "10/12/2024", color: "text-purple-600", bg: "bg-purple-50" },
  ];

  const upcomingAppointments = [
    { id: 1, title: "Khám định kỳ", doctor: "BS. Nguyễn Văn A", date: "28/12/2024", time: "10:00", status: "confirmed" },
    { id: 2, title: "Tẩy trắng răng", doctor: "BS. Trần Thị B", date: "5/1/2025", time: "14:00", status: "pending" },
  ];

  const treatments = [
    { id: 1, title: "Trám răng", doctor: "BS. Lê Văn C", date: "10/12/2024" },
    { id: 2, title: "Khám tổng quát", doctor: "BS. Nguyễn Văn A", date: "22/11/2024" },
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
            PATIENT DASHBOARD
          </span>
          <h1 className="text-xl font-semibold text-slate-900">
            Xin chào, Nguyễn Văn A!
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Tổng quan về tình trạng sức khỏe răng miệng của bạn
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
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

        {/* Upcoming Appointments - Full Width */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-slate-900">Lịch hẹn sắp tới</h2>
            <button
              onClick={() => navigate("/patient/appointments")}
              className="flex items-center gap-1 text-sm text-[#2563EB] hover:underline"
            >
              <span>Xem tất cả</span>
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {upcomingAppointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#E0ECFF] rounded-xl flex items-center justify-center text-[#2563EB]">
                    <FiCalendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{apt.title}</p>
                    <p className="text-xs text-slate-500">{apt.doctor}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-600 font-medium">{apt.date} • {apt.time}</p>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 ${statusColors[apt.status]} text-[10px] font-medium rounded-full`}>
                    {statusLabels[apt.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="mt-5 w-full py-3 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1D4ED8] transition"
          >
            Đặt lịch hẹn mới
          </button>
        </div>

        {/* Quick Actions + Treatment History - 2 columns */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-5">Thao tác nhanh</h2>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => navigate("/patient/appointments")}
                className="p-4 bg-blue-50 rounded-xl text-left hover:bg-blue-100 transition"
              >
                <FiCalendar className="w-6 h-6 text-[#2563EB] mb-2" />
                <p className="text-sm font-medium text-slate-900">Lịch hẹn</p>
                <p className="text-xs text-slate-500">Xem lịch hẹn của bạn</p>
              </button>

              <button
                onClick={() => navigate("/patient/medical-history")}
                className="p-4 bg-emerald-50 rounded-xl text-left hover:bg-emerald-100 transition"
              >
                <FiFileText className="w-6 h-6 text-emerald-600 mb-2" />
                <p className="text-sm font-medium text-slate-900">Hồ sơ bệnh án</p>
                <p className="text-xs text-slate-500">Xem lịch sử khám</p>
              </button>

              <button
                onClick={() => navigate("/patient/profile")}
                className="p-4 bg-purple-50 rounded-xl text-left hover:bg-purple-100 transition"
              >
                <FiUser className="w-6 h-6 text-purple-600 mb-2" />
                <p className="text-sm font-medium text-slate-900">Hồ sơ cá nhân</p>
                <p className="text-xs text-slate-500">Cập nhật thông tin</p>
              </button>

              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="p-4 bg-amber-50 rounded-xl text-left hover:bg-amber-100 transition"
              >
                <FiClock className="w-6 h-6 text-amber-600 mb-2" />
                <p className="text-sm font-medium text-slate-900">Đặt lịch</p>
                <p className="text-xs text-slate-500">Đặt lịch hẹn mới</p>
              </button>
            </div>
          </div>

          {/* Treatment History */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-900">Lịch sử điều trị</h2>
              <button
                onClick={() => navigate("/patient/medical-history")}
                className="flex items-center gap-1 text-sm text-[#2563EB] hover:underline"
              >
                <span>Xem tất cả</span>
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {treatments.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <FiClipboard className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.doctor}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">{item.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Support banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white px-7 py-6 lg:px-10 lg:py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-base font-semibold">Cần hỗ trợ?</p>
            <p className="text-sm text-blue-100 mt-1">
              Liên hệ với chúng tôi để được tư vấn và hỗ trợ
            </p>
          </div>

          <button className="inline-flex items-center gap-2 rounded-full bg-white text-[#2563EB] px-5 py-2.5 text-sm font-semibold shadow-sm hover:bg-slate-50 transition">
            <FiPhone className="w-4 h-4" />
            <span>Gọi ngay: 028 1234 5678</span>
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSubmit={(data) => {
          console.log("Booking data:", data);
        }}
      />
    </div>
  );
};

export default PatientDashboard;
