import React from "react";
import { FiHome, FiCalendar } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

type TabId = "home" | "booking";

type NavTab = {
  id: TabId;
  label: string;
  path: string;
  icon: React.ElementType;
};

const TABS: NavTab[] = [
  { id: "home", label: "Trang chủ", path: "/", icon: FiHome },
  { id: "booking", label: "Đặt lịch", path: "/booking", icon: FiCalendar },
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
    if (tab.path === "/") return pathname === "/";
    return pathname.startsWith(tab.path);
  };

  const isHomePage = location.pathname === "/";

  return (
    <header className="relative z-[100] w-full">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo + tên phòng khám */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-9 h-9 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-md shadow-black/30">
            <span className="font-bold text-sm">DC</span>
          </div>
          <div className="leading-tight">
            <p className={`text-sm font-bold ${isHomePage ? "text-white" : "text-[#0f172a]"}`}>
              Nha Khoa Dental Care
            </p>
            <p className={`text-xs ${isHomePage ? "text-slate-200/80" : "text-[#6b7280]"}`}>
              Chăm sóc nụ cười của bạn
            </p>
          </div>
        </div>

        {/* Nav bên phải */}
        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab);
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab)}
                className={`inline-flex items-center gap-1 sm:gap-1.5 rounded-full px-2 sm:px-3 py-1 transition flex-shrink-0 ${active
                  ? isHomePage
                    ? "bg-white/25 !text-white shadow-sm shadow-black/30"
                    : "bg-white/90 text-[#0f172a] shadow-sm shadow-black/30"
                  : isHomePage
                    ? "!text-white hover:bg-white/10"
                    : "text-[#0f172a] hover:bg-white/10"
                  }`}
              >
                <Icon className={`w-4 h-4 ${isHomePage ? "!text-white" : ""}`} />
                <span className={`hidden sm:inline ${isHomePage ? "!text-white" : ""}`}>{tab.label}</span>
              </button>
            );
          })}

          {/* Divider */}
          <div className={`hidden sm:block w-px h-5 mx-2 ${isHomePage ? "bg-white/30" : "bg-slate-300"}`} />

          {/* Login Button */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition ${isHomePage
              ? "text-white hover:bg-white/10"
              : "text-[#0f172a] hover:bg-slate-100"
              }`}
          >
            Đăng nhập
          </button>

          {/* Register Button */}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition ${isHomePage
              ? "border-white/50 text-white hover:bg-white/10"
              : "border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB]/10"
              }`}
          >
            Đăng ký
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

