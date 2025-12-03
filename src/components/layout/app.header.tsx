import React from "react";
import {
  FiUsers,
  FiHome,
  FiCalendar,
  FiMoon,
  FiLogOut,
  FiFileText,
  FiUser,
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

type TabId = "home" | "appointments" | "medical" | "profile";

type NavTab = {
  id: TabId;
  label: string;
  path: string;
  icon: React.ElementType;
};

const TABS: NavTab[] = [
  { id: "home", label: "Trang chủ", path: "/patient/dashboard", icon: FiHome },
  {
    id: "appointments",
    label: "Lịch hẹn",
    path: "/patient/appointments",
    icon: FiCalendar,
  },
  {
    id: "medical",
    label: "Hồ sơ bệnh án",
    path: "/patient/medical-history",
    icon: FiFileText,
  },
  {
    id: "profile",
    label: "Thông tin cá nhân",
    path: "/patient/profile",
    icon: FiUser,
  },
];

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabClick = (tab: NavTab) => {
    navigate(tab.path);
  };

  // tab active dựa trên URL hiện tại
  const isActive = (tab: NavTab) => {
    const pathname = location.pathname;
    // active nếu trùng path hoặc là prefix (vd: /patient/appointments/123)
    if (tab.path === "/") return pathname === "/";
    return pathname.startsWith(tab.path);
  };

  const handleLogout = () => {
    // TODO: xoá token, clear state...
    console.log("logout");
  };

  return (
    <header className="relative z-[100] w-full   ">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo + tên phòng khám / bệnh nhân */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-md shadow-black/30">
            <FiUsers className="w-5 h-5" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-white">
              Nha Khoa Dental Care
            </p>
            <p className="text-xs text-slate-200/80">Bệnh nhân</p>
          </div>  
        </div>

        {/* Nav bên phải */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-white font-bold">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab);
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 transition ${
                  active
                    ? "bg-white/25 text-white shadow-sm shadow-black/30"
                    : "text-white/75 hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          {/* Dark mode (dummy) */}
          <button
            type="button"
            className="ml-1 p-1 rounded-full text-white/80 hover:bg-white/10"
          >
            <FiMoon className="w-4 h-4" />
          </button>

          {/* Đăng xuất */}
          <button
            type="button"
            onClick={handleLogout}
            className="ml-1 inline-flex items-center gap-1.5 text-red-300 hover:text-red-200"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
