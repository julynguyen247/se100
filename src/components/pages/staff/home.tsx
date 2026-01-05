// src/pages/StaffHomePage.tsx
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiTrendingUp,
  FiClock as FiTime,
} from "react-icons/fi";

type StatCard = {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
};

type ScheduleItem = {
  time: string;
  name: string;
  reason: string;
  status: "completed" | "in-progress" | "waiting" | "confirmed";
  hasStartButton?: boolean;
};

const STAT_CARDS: StatCard[] = [
  {
    id: "today",
    label: "Bệnh nhân hôm nay",
    value: "12",
    icon: <FiUsers className="w-5 h-5 text-blue-500" />,
  },
  {
    id: "waiting",
    label: "Đang chờ khám",
    value: "3",
    icon: <FiClock className="w-5 h-5 text-yellow-500" />,
  },
  {
    id: "done",
    label: "Hoàn thành",
    value: "8",
    icon: <FiCheckCircle className="w-5 h-5 text-emerald-500" />,
  },
  {
    id: "rate",
    label: "Tỷ lệ hoàn thành",
    value: "95%",
    icon: <FiTrendingUp className="w-5 h-5 text-purple-500" />,
  },
];

const TODAY_SCHEDULE: ScheduleItem[] = [
  {
    time: "09:00",
    name: "Nguyễn Văn A",
    reason: "Khám định kỳ",
    status: "completed",
  },
  {
    time: "10:00",
    name: "Trần Thị B",
    reason: "Trám răng",
    status: "in-progress",
  },
  {
    time: "11:00",
    name: "Lê Văn C",
    reason: "Nhổ răng khôn",
    status: "waiting",
    hasStartButton: true,
  },
  {
    time: "14:00",
    name: "Phạm Thị D",
    reason: "Tẩy trắng răng",
    status: "confirmed",
  },
  {
    time: "15:30",
    name: "Hoàng Văn E",
    reason: "Khám tổng quát",
    status: "confirmed",
  },
];

const StaffHomePage: React.FC = () => {
  const navigate = useNavigate();

  const todayLabel = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, []);

  const renderStatusBadge = (status: ScheduleItem["status"]) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-600 text-xs px-3 py-1">
            Hoàn thành
          </span>
        );
      case "in-progress":
        return (
          <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-600 text-xs px-3 py-1">
            Đang khám
          </span>
        );
      case "waiting":
        return (
          <span className="inline-flex items-center rounded-full bg-amber-50 text-amber-600 text-xs px-3 py-1">
            Đang chờ
          </span>
        );
      case "confirmed":
        return (
          <span className="inline-flex items-center rounded-full bg-fuchsia-50 text-fuchsia-600 text-xs px-3 py-1">
            Đã xác nhận
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Chào user + ngày hiện tại */}
        <section>
          <p className="text-sm text-slate-500">
            Chào{" "}
            <span className="font-semibold text-slate-800">Nguyễn Văn B!</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">{todayLabel}</p>
        </section>

        {/* Thống kê nhanh */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map((card) => (
            <div
              key={card.id}
              className="flex items-center justify-between rounded-2xl bg-white border border-slate-100 shadow-sm px-4 py-3"
            >
              <div>
                <p className="text-xs text-slate-400">{card.label}</p>
                <p className="mt-1 text-xl font-semibold text-slate-900">
                  {card.value}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                {card.icon}
              </div>
            </div>
          ))}
        </section>

        {/* Lịch hôm nay */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900">
              Lịch hôm nay
            </h2>
            <button
              type="button"
              onClick={() => navigate("/staff/appointments")}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              Xem tất cả
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {TODAY_SCHEDULE.map((item, idx) => (
              <div
                key={item.time + idx}
                className="flex items-center justify-between px-5 py-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center">
                      <FiTime className="w-3 h-3" />
                    </span>
                    <span className="font-medium text-slate-700">
                      {item.time}
                    </span>
                  </div>
                  <div className="leading-tight">
                    <p className="text-sm font-semibold text-slate-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {item.reason}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {renderStatusBadge(item.status)}
                  {item.hasStartButton && (
                    <button
                      type="button"
                      onClick={() => navigate("/staff/examinations")}
                      className="inline-flex items-center rounded-full bg-blue-600 text-white text-xs px-3 py-1 hover:bg-blue-700"
                    >
                      Bắt đầu khám
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick actions */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-8">
          {/* Hàng đợi bệnh nhân */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-5 flex flex-col justify-between shadow-md">
            <div>
              <p className="text-sm font-semibold">Hàng đợi bệnh nhân</p>
              <p className="mt-2 text-xs text-blue-100">
                3 bệnh nhân đang chờ khám
              </p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => navigate("/staff/queue")}
                className="inline-flex items-center justify-center rounded-full bg-white/90 text-blue-700 text-xs font-medium px-4 py-1.5 hover:bg-white"
              >
                Xem hàng đợi
              </button>
            </div>
          </div>

          {/* Hồ sơ bệnh nhân */}
          <div className="rounded-2xl bg-gradient-to-r from-fuchsia-600 to-purple-700 text-white px-6 py-5 flex flex-col justify-between shadow-md">
            <div>
              <p className="text-sm font-semibold">Hồ sơ bệnh nhân</p>
              <p className="mt-2 text-xs text-fuchsia-100">
                Tra cứu hồ sơ bệnh án
              </p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => navigate("/staff/patients")}
                className="inline-flex items-center justify-center rounded-full bg-white/90 text-fuchsia-700 text-xs font-medium px-4 py-1.5 hover:bg-white"
              >
                Tra cứu hồ sơ
              </button>
            </div>
          </div>

          {/* Quản lý lịch hẹn */}
          <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-5 flex flex-col justify-between shadow-md">
            <div>
              <p className="text-sm font-semibold">Quản lý lịch hẹn</p>
              <p className="mt-2 text-xs text-emerald-100">
                Thêm và xác nhận lịch hẹn
              </p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => navigate("/staff/appointments")}
                className="inline-flex items-center justify-center rounded-full bg-white/90 text-emerald-700 text-xs font-medium px-4 py-1.5 hover:bg-white"
              >
                Quản lý lịch hẹn
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StaffHomePage;
