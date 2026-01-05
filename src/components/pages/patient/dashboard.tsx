import React, { useState } from "react";
import {
  FiCalendar,
  FiClipboard,
  FiClock,
  FiMessageSquare,
  FiChevronRight,
  FiPhone,
} from "react-icons/fi";
import BookingModal from "../../patient/BookingModal";

const PatientDashboard: React.FC = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const upcomingAppointments = [
    {
      id: 1,
      title: "Khám định kỳ",
      doctor: "BS. Nguyễn Văn A",
      date: "28/12/2024",
      time: "10:00",
      status: "Đã xác nhận",
      statusColor: "bg-[#E0F2FE] text-[#0369A1]",
    },
    {
      id: 2,
      title: "Tẩy trắng răng",
      doctor: "BS. Trần Thị B",
      date: "5/1/2025",
      time: "14:00",
      status: "Chờ xác nhận",
      statusColor: "bg-[#FEF3C7] text-[#92400E]",
    },
  ];

  const treatments = [
    {
      id: 1,
      title: "Trám răng",
      doctor: "BS. Lê Văn C",
      date: "10/12/2024",
      status: "Hoàn thành",
    },
    {
      id: 2,
      title: "Khám tổng quát",
      doctor: "BS. Nguyễn Văn A",
      date: "22/11/2024",
      status: "Hoàn thành",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F5F7FB] px-6 py-8 sm:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Chip + welcome */}
        <div>
          <span className="inline-flex items-center justify-center rounded-full bg-[#E0ECFF] text-[#2563EB] text-[11px] font-semibold px-5 py-1.5 tracking-[0.16em] uppercase mb-4">
            PATIENT DASHBOARD
          </span>
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
            Chào mừng trở lại, Nguyễn Văn A!
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Đây là tổng quan về tình trạng sức khỏe răng miệng của bạn
          </p>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <StatCard
            icon={<FiCalendar className="w-5 h-5" />}
            label="Lịch hẹn sắp tới"
            value="2"
          />
          <StatCard
            icon={<FiClipboard className="w-5 h-5" />}
            label="Điều trị đã hoàn thành"
            value="8"
          />
          <StatCard
            icon={<FiClock className="w-5 h-5" />}
            label="Lần khám gần nhất"
            value="10/12/2024"
          />
          <StatCard
            icon={<FiMessageSquare className="w-5 h-5" />}
            label="Tin nhắn mới"
            value="3"
          />
        </div>

        {/* Main content */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* Upcoming appointments */}
          <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-7 flex flex-col gap-5 min-h-[260px]">
            <div className="flex items-center justify-between">
              <h2 className="text-sm lg:text-base font-semibold text-slate-900">
                Lịch hẹn sắp tới
              </h2>
              <button className="flex items-center gap-1 text-xs lg:text-sm text-[#2563EB] hover:underline">
                <span>Xem tất cả</span>
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {upcomingAppointments.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-100 bg-[#F9FAFB] px-5 py-4 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm lg:text-base font-medium text-slate-900">
                        {item.title}
                      </p>
                      <p className="text-xs lg:text-sm text-slate-500">
                        {item.doctor}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold ${item.statusColor}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-5 mt-1 text-[11px] lg:text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <FiCalendar className="w-3.5 h-3.5" />
                      <span>{item.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FiClock className="w-3.5 h-3.5" />
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="mt-2 w-full rounded-lg bg-[#2563EB] py-3 text-sm lg:text-base font-semibold text-white shadow-sm hover:bg-[#1D4ED8]"
            >
              Đặt lịch mới
            </button>
          </div>

          {/* Treatment history */}
          <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-7 flex flex-col gap-5 min-h-[260px]">
            <div className="flex items-center justify-between">
              <h2 className="text-sm lg:text-base font-semibold text-slate-900">
                Lịch sử điều trị
              </h2>
              <button className="flex items-center gap-1 text-xs lg:text-sm text-[#2563EB] hover:underline">
                <span>Xem tất cả</span>
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {treatments.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-100 bg-[#F9FAFB] px-5 py-4 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-sm lg:text-base font-medium text-slate-900">
                      {item.title}
                    </p>
                    <p className="text-xs lg:text-sm text-slate-500">
                      {item.doctor}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 text-[11px] lg:text-xs text-slate-500">
                      <FiCalendar className="w-3.5 h-3.5" />
                      <span>{item.date}</span>
                    </div>
                  </div>
                  <span className="whitespace-nowrap rounded-full bg-[#DCFCE7] text-[#15803D] px-3.5 py-1.5 text-[11px] font-semibold">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Support banner */}
        <div className="mt-2 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white px-7 py-6 lg:px-10 lg:py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm lg:text-base font-semibold">Cần hỗ trợ?</p>
            <p className="text-xs sm:text-sm lg:text-base text-blue-100 mt-1">
              Liên hệ với chúng tôi để được tư vấn và hỗ trợ
            </p>
          </div>

          <button className="inline-flex items-center gap-2 rounded-full bg-white text-[#2563EB] px-5 py-2.5 text-xs sm:text-sm lg:text-base font-semibold shadow-sm hover:bg-slate-50">
            <FiPhone className="w-4 h-4 lg:w-5 lg:h-5" />
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

/* ---- card thống kê (to hơn tí) ---- */

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm px-5 py-4 h-28 flex items-center justify-between">
      <div>
        <p className="text-[11px] lg:text-xs text-slate-500 flex items-center gap-2">
          {icon}
          <span>{label}</span>
        </p>
        <p className="mt-2 text-sm lg:text-lg font-semibold text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
};

export default PatientDashboard;
