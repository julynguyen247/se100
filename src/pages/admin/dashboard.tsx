import React from "react";
import {
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiTrendingUp,
  FiActivity,
} from "react-icons/fi";

const AdminDashboardPage: React.FC = () => {
  const stats = [
    {
      id: 1,
      label: "Tổng bệnh nhân",
      value: "1,234",
      change: "+12% so với tháng trước",
      icon: FiUsers,
    },
    {
      id: 2,
      label: "Lịch hẹn hôm nay",
      value: "48",
      change: "+5% so với tháng trước",
      icon: FiCalendar,
    },
    {
      id: 3,
      label: "Doanh thu tháng",
      value: "450M VND",
      change: "+18% so với tháng trước",
      icon: FiDollarSign,
    },
    {
      id: 4,
      label: "Tỷ lệ hài lòng",
      value: "96%",
      change: "+2% so với tháng trước",
      icon: FiTrendingUp,
    },
  ];

  const activities = [
    {
      id: 1,
      doctor: "BS. Nguyễn Văn A",
      action: "Hoàn thành khám bệnh: Nguyễn Văn B",
      time: "10 phút trước",
    },
    {
      id: 2,
      doctor: "Lễ tân C",
      action: "Tạo lịch hẹn mới: Trần Thị D",
      time: "25 phút trước",
    },
    {
      id: 3,
      doctor: "BS. Trần Thị B",
      action: "Kê đơn thuốc: Lê Văn E",
      time: "1 giờ trước",
    },
    {
      id: 4,
      doctor: "Lễ tân C",
      action: "Check-in bệnh nhân: Phạm Thị F",
      time: "2 giờ trước",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F5F7FB] px-6 py-8 sm:px-10 lg:px-16">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
            Chào Admin Admin!
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Tổng quan hệ thống quản lý nha khoa
          </p>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.id} {...stat} />
          ))}
        </div>

        {/* Main 2-column content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent activities */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FiActivity className="w-4 h-4 text-rose-500" />
                <h2 className="text-sm font-semibold text-slate-900">
                  Hoạt động gần đây
                </h2>
              </div>
              <span className="text-[11px] text-slate-400">Thời gian thực</span>
            </div>

            <div className="space-y-3">
              {activities.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-xl px-2 py-2 hover:bg-slate-50 transition"
                >
                  <div className="mt-1">
                    <div className="w-7 h-7 rounded-full bg-[#FEE2E2] flex items-center justify-center text-rose-500">
                      <FiActivity className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      {item.doctor}
                    </p>
                    <p className="text-xs text-slate-500">{item.action}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="space-y-4">
            <GradientCard
              title="Quản lý người dùng"
              description="Thêm, sửa, xóa tài khoản nhân viên"
              buttonLabel="Quản lý ngay"
              gradient="from-[#2563EB] to-[#1D4ED8]"
            />
            <GradientCard
              title="Báo cáo & Thống kê"
              description="Xem báo cáo chi tiết về hoạt động"
              buttonLabel="Xem báo cáo"
              gradient="from-[#7C3AED] to-[#EC4899]"
            />
            <GradientCard
              title="Cài đặt hệ thống"
              description="Cấu hình và tùy chỉnh hệ thống"
              buttonLabel="Cài đặt"
              gradient="from-[#F97316] to-[#EF4444]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

/* ====== Sub components ====== */

type StatCardProps = {
  label: string;
  value: string;
  change: string;
  icon: React.ElementType;
};

const StatCard: React.FC<StatCardProps> = ({ label, value, change, icon }) => {
  const Icon = icon;
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-4 py-4 flex items-start justify-between">
      <div>
        <p className="text-[12px] text-slate-500">{label}</p>
        <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
        <p className="mt-1 text-[11px] text-emerald-600">{change}</p>
      </div>
      <div className="w-9 h-9 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[#2563EB]">
        <Icon className="w-4 h-4" />
      </div>
    </div>
  );
};

type GradientCardProps = {
  title: string;
  description: string;
  buttonLabel: string;
  gradient: string; // tailwind gradient class
};

const GradientCard: React.FC<GradientCardProps> = ({
  title,
  description,
  buttonLabel,
  gradient,
}) => {
  return (
    <div
      className={`rounded-2xl px-6 py-5 text-white shadow-sm bg-gradient-to-r ${gradient}`}
    >
      <h3 className="text-sm sm:text-base font-semibold">{title}</h3>
      <p className="mt-2 text-xs sm:text-sm text-blue-100 max-w-xs">
        {description}
      </p>
      <button className="mt-4 inline-flex items-center justify-center rounded-lg bg-white/90 hover:bg-white text-xs sm:text-sm font-semibold text-slate-900 px-4 py-2 shadow-sm">
        {buttonLabel}
      </button>
    </div>
  );
};
