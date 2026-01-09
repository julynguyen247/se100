import React, { useState, useEffect } from 'react';
import {
    FiHome,
    FiUsers,
    FiCalendar,
    FiFileText,
    FiCreditCard,
    FiLogOut,
    FiMenu,
    FiX,
} from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';

type TabId = 'dashboard' | 'queue' | 'appointments' | 'patients' | 'billing';

type NavTab = {
    id: TabId;
    label: string;
    path: string;
    icon: React.ElementType;
};

const TABS: NavTab[] = [
    {
        id: 'dashboard',
        label: 'Trang chủ',
        path: '/receptionist',
        icon: FiHome,
    },
    {
        id: 'queue',
        label: 'Hàng đợi',
        path: '/receptionist/queue',
        icon: FiUsers,
    },
    {
        id: 'appointments',
        label: 'Quản lý lịch hẹn',
        path: '/receptionist/appointments',
        icon: FiCalendar,
    },
    {
        id: 'patients',
        label: 'Hồ sơ bệnh nhân',
        path: '/receptionist/patients',
        icon: FiFileText,
    },
    {
        id: 'billing',
        label: 'Thanh toán',
        path: '/receptionist/billing',
        icon: FiCreditCard,
    },
];

const ReceptionistHeader: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userName, setUserName] = useState('Lễ tân');

    useEffect(() => {
        // Get user info from localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setUserName(user.name || user.fullName || 'Lễ tân');
            } catch (error) {
                console.error('Failed to parse user data:', error);
            }
        }
    }, []);

    const isActive = (tab: NavTab) => {
        if (tab.path === '/receptionist') {
            return (
                location.pathname === '/receptionist' ||
                location.pathname === '/receptionist/'
            );
        }
        return location.pathname.startsWith(tab.path);
    };

    const handleLogout = () => {
        console.log('logout');
        navigate('/login');
    };

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-[1600px] mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 lg:h-20">
                    {/* Logo + User Info */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                                <FiCalendar className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-slate-900">
                                    {userName}
                                </h2>
                                <p className="text-xs text-slate-500">Lễ tân</p>
                            </div>
                        </div>
                        <div className="hidden xl:block w-px h-10 bg-slate-200" />
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden xl:flex items-center gap-1">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            const active = isActive(tab);
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => navigate(tab.path)}
                                    className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                        active
                                            ? 'bg-blue-50 text-[#2563EB] shadow-sm'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
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

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                            <FiLogOut className="w-4 h-4" />
                            <span className="text-sm font-medium">
                                Đăng xuất
                            </span>
                        </button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="xl:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
                        >
                            {mobileMenuOpen ? (
                                <FiX className="w-6 h-6" />
                            ) : (
                                <FiMenu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="xl:hidden border-t border-slate-200 bg-white shadow-lg">
                    <nav className="px-4 py-3 space-y-1">
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
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                        active
                                            ? 'bg-blue-50 text-[#2563EB] shadow-sm'
                                            : 'text-slate-700 hover:bg-slate-50'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="text-sm font-medium">
                                        {tab.label}
                                    </span>
                                    {active && (
                                        <div className="ml-auto w-2 h-2 bg-[#2563EB] rounded-full" />
                                    )}
                                </button>
                            );
                        })}
                        <div className="border-t border-slate-200 my-2" />
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                            <FiLogOut className="w-5 h-5" />
                            <span className="text-sm font-medium">
                                Đăng xuất
                            </span>
                        </button>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default ReceptionistHeader;
