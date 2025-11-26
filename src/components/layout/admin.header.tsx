import React from "react";
import {
  FiHome,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiMoon,
  FiLogOut,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

type AdminTabId = "home" | "users" | "reports" | "settings";

type AdminTab = {
  id: AdminTabId;
  label: string;
  path: string;
  icon: React.ElementType;
  activeClass: string;
};

const ADMIN_TABS: AdminTab[] = [
  {
    id: "home",
    label: "Trang chủ",
    path: "/admin",
    icon: FiHome,
    activeClass: "bg-slate-100 text-slate-900",
  },
  {
    id: "users",
    label: "Quản lý người dùng",
    path: "/admin/users",
    icon: FiUsers,
    activeClass: "bg-slate-100 text-slate-900",
  },
  {
    id: "reports",
    label: "Báo cáo",
    path: "/admin/reports",
    icon: FiBarChart2,
    activeClass: "bg-slate-100 text-slate-900",
  },
  {
    id: "settings",
    label: "Cài đặt hệ thống",
    path: "/admin/settings",
    icon: FiSettings,
    // tab Cài đặt có nền đỏ nhạt như screenshot
    activeClass: "bg-[#FEE2E2] text-[#DC2626]",
  },
];

const AdminHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (tab: AdminTab) => {
    const pathname = location.pathname;
    if (tab.path === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(tab.path);
  };

  const handleTabClick = (tab: AdminTab) => {
    navigate(tab.path);
  };

  const handleLogout = () => {
    // TODO: clear token, reset store...
    console.log("admin logout");
  };

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo + thông tin admin */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#EF4444] text-white flex items-center justify-center text-sm font-semibold">
            A
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">Admin</p>
            <p className="text-xs text-slate-400">Quản trị viên</p>
          </div>
        </div>

        {/* Nav bên phải */}
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          {ADMIN_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab);

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 transition
                  ${
                    active
                      ? tab.activeClass
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          {/* Dark mode icon (dummy, em nối hook dark mode nếu muốn) */}
          <button
            type="button"
            className="ml-1 p-1 rounded-full text-slate-500 hover:bg-slate-50"
          >
            <FiMoon className="w-4 h-4" />
          </button>

          {/* Đăng xuất */}
          <button
            type="button"
            onClick={handleLogout}
            className="ml-1 inline-flex items-center gap-1.5 text-red-500 hover:text-red-600"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
