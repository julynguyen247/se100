import React, { useState } from "react";
import { FiHome, FiUsers, FiBarChart2, FiSettings, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

type AdminTabId = "home" | "users" | "reports" | "settings";

type AdminTab = {
  id: AdminTabId;
  label: string;
  path: string;
  icon: React.ElementType;
};

const ADMIN_TABS: AdminTab[] = [
  { id: "home", label: "Trang chủ", path: "/admin", icon: FiHome },
  { id: "users", label: "Quản lý người dùng", path: "/admin/users", icon: FiUsers },
  { id: "reports", label: "Báo cáo", path: "/admin/reports", icon: FiBarChart2 },
  // { id: "settings", label: "Cài đặt hệ thống", path: "/admin/settings", icon: FiSettings },
];

const AdminHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // TODO: Get from context
  const userName = "Admin";

  const isActive = (tab: AdminTab) => {
    if (tab.path === "/admin") {
      return location.pathname === "/admin" || location.pathname === "/admin/";
    }
    return location.pathname.startsWith(tab.path);
  };

  const handleLogout = () => {
    console.log("logout");
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo + User Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
                <FiSettings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900">{userName}</h2>
                <p className="text-xs text-slate-500">Quản trị viên</p>
              </div>
            </div>
            <div className="hidden xl:block w-px h-10 bg-slate-200" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
            {ADMIN_TABS.map((tab) => {
              const Icon = tab.icon;
              const active = isActive(tab);
              return (
                <button
                  key={tab.id}
                  onClick={() => navigate(tab.path)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${active
                    ? "bg-blue-50 text-[#2563EB] shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {active && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-[#2563EB] rounded-full" />
                  )}
                </button>
              );
            })}

            <div className="w-px h-10 bg-slate-200 mx-2" />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <FiLogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Đăng xuất</span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="xl:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white shadow-lg">
          <nav className="px-4 py-3 space-y-1">
            {ADMIN_TABS.map((tab) => {
              const Icon = tab.icon;
              const active = isActive(tab);
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    navigate(tab.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active
                    ? "bg-blue-50 text-[#2563EB] shadow-sm"
                    : "text-slate-700 hover:bg-slate-50"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{tab.label}</span>
                  {active && <div className="ml-auto w-2 h-2 bg-[#2563EB] rounded-full" />}
                </button>
              );
            })}
            <div className="border-t border-slate-200 my-2" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
            >
              <FiLogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Đăng xuất</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;
