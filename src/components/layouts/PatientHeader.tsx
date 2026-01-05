import React, { useState } from "react";
import { FiHome, FiCalendar, FiFileText, FiUser, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

type TabId = "dashboard" | "appointments" | "medical-history" | "profile";

type NavTab = {
    id: TabId;
    label: string;
    path: string;
    icon: React.ElementType;
};

const TABS: NavTab[] = [
    { id: "dashboard", label: "Trang chủ", path: "/patient/dashboard", icon: FiHome },
    { id: "appointments", label: "Lịch hẹn", path: "/patient/appointments", icon: FiCalendar },
    { id: "medical-history", label: "Hồ sơ bệnh án", path: "/patient/medical-history", icon: FiFileText },
    { id: "profile", label: "Thông tin cá nhân", path: "/patient/profile", icon: FiUser },
];

const PatientHeader: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // TODO: Get user info from context/store
    const userName = "Nguyễn Văn A";

    const isActive = (tab: NavTab) => {
        return location.pathname.startsWith(tab.path);
    };

    const handleLogout = () => {
        // TODO: Clear auth state
        console.log("logout");
        navigate("/login");
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* User Info */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center">
                            <FiUser className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">{userName}</h2>
                            <p className="text-xs text-gray-500">Bệnh nhân</p>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            const active = isActive(tab);
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => navigate(tab.path)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active
                                            ? "bg-blue-50 text-[#2563EB]"
                                            : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2"
                        >
                            <FiLogOut className="w-4 h-4" />
                            <span className="text-sm font-medium">Đăng xuất</span>
                        </button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                            {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t bg-white">
                    <nav className="px-4 py-2 space-y-1">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            const active = isActive(tab);
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        navigate(tab.path);
                                        setMobileMenuOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${active
                                            ? "bg-blue-50 text-[#2563EB]"
                                            : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="text-sm font-medium">{tab.label}</span>
                                </button>
                            );
                        })}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

export default PatientHeader;
