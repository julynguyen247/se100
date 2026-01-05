import React from "react";
import {
  FiHome,
  FiUsers,
  FiFileText,
  FiActivity,
  FiEdit3,
  FiCalendar,
  FiLogOut,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

type StaffTabId =
  | "home"
  | "waiting"
  | "patient-records"
  | "examination"
  | "medicine"
  | "appointments";

type StaffTab = {
  id: StaffTabId;
  label: string;
  path: string;
  icon: React.ElementType;
};

const STAFF_TABS: StaffTab[] = [
  {
    id: "home",
    label: "Trang chủ",
    path: "/staff",
    icon: FiHome,
  },
  {
    id: "waiting",
    label: "Hàng đợi",
    path: "/staff/waiting",
    icon: FiUsers,
  },
  {
    id: "patient-records",
    label: "Hồ sơ bệnh nhân",
    path: "/staff/patients",
    icon: FiFileText,
  },
  {
    id: "examination",
    label: "Khám bệnh",
    path: "/staff/examination",
    icon: FiActivity,
  },
  {
    id: "medicine",
    label: "Kê đơn thuốc",
    path: "/staff/medicine",
    icon: FiEdit3,
  },
  {
    id: "appointments",
    label: "Quản lý lịch hẹn",
    path: "/staff/appointments",
    icon: FiCalendar,
  },
];

const StaffHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (tab: StaffTab) => {
    const pathname = location.pathname;

    if (tab.path === "/staff") {
      return pathname === "/staff" || pathname === "/staff/";
    }

    return pathname.startsWith(tab.path);
  };

  const handleTabClick = (tab: StaffTab) => {
    navigate(tab.path);
  };

  const handleLogout = () => {
    console.log("staff logout");
  };

  return (
    <header className="w-full bg-white shadow-sm border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-lg font-semibold">
            B
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">Nguyễn Văn B</p>
            <p className="text-xs text-slate-400">Nhân viên</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs sm:text-sm">
          {STAFF_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab);

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition
                  ${
                    active
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={handleLogout}
            className="ml-2 inline-flex items-center gap-1.5 text-red-500 hover:text-red-600"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default StaffHeader;
