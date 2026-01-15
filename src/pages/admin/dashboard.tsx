import React, { useEffect, useState, useMemo } from 'react';
import {
    FiUsers,
    FiCalendar,
    FiDollarSign,
    FiTrendingUp,
    FiRefreshCw,
    FiAlertCircle,
    FiAlertTriangle,
} from 'react-icons/fi';
import { FaPills } from 'react-icons/fa';
import {
    getAdminDashboardStatsNew,
    getPatients,
    getTodayAppointments,
    getHistoricalStats,
    getReviewStats,
    type AdminDashboardStats,
    type ReviewStatsDto,
} from '@/services/apiAdmin';
import { formatVND, formatNumber, formatPercentage } from '@/services/helper';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

const AdminDashboardPage: React.FC = () => {
    // State management
    const [stats, setStats] = useState<AdminDashboardStats | null>(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [errorStats, setErrorStats] = useState<string | null>(null);

    // Total counts for cards
    const [totalPatientsCount, setTotalPatientsCount] = useState<number | null>(
        null
    );
    const [loadingTotalPatients, setLoadingTotalPatients] = useState(false);
    const [totalAppointmentsCount, setTotalAppointmentsCount] = useState<
        number | null
    >(null);
    const [loadingTotalAppointments, setLoadingTotalAppointments] =
        useState(false);

    // Historical stats for percentage calculations
    const [historicalStats, setHistoricalStats] = useState<
        Array<{
            period: string;
            revenue: number;
            newPatients: number;
            completedAppointments: number;
        }>
    >([]);

    // Appointments modal state
    const [showAppointmentsModal, setShowAppointmentsModal] = useState(false);
    const [todayAppointments, setTodayAppointments] = useState<
        import('@/services/apiAdmin').TodayAppointmentItem[]
    >([]);
    const [loadingAppointments, setLoadingAppointments] = useState(false);

    // Additional stats for mini cards
    const [additionalStats, setAdditionalStats] = useState<{
        totalDoctors: number;
        totalStaff: number;
        activeClinics: number;
    } | null>(null);

    // Review stats
    const [reviewStats, setReviewStats] = useState<ReviewStatsDto | null>(null);
    const [loadingReviewStats, setLoadingReviewStats] = useState(false);

    // Low stock medicines
    const [lowStockMedicines, setLowStockMedicines] = useState<
        import('@/services/apiMedicine').LowStockMedicineDto[]
    >([]);
    const [loadingLowStock, setLoadingLowStock] = useState(false);

    // Fetch dashboard stats
    const fetchDashboardStats = async () => {
        try {
            setLoadingStats(true);
            setErrorStats(null);
            const data = await getAdminDashboardStatsNew();
            // Map backend AdminDashboardStatsDto to FE AdminDashboardStats
            // Note: Backend returns totalAppointments (all), but FE needs todayAppointments
            // We'll fetch todayAppointments separately, so set to 0 here
            setStats({
                totalPatients: data.totalPatients,
                todayAppointments: 0, // Will be updated by fetchTotalAppointmentsCount
                monthlyRevenue: data.totalRevenue, // Backend field name difference
                satisfactionRate: data.satisfactionRate,
            });

            // Store additional stats for mini cards
            setAdditionalStats({
                totalDoctors: data.totalDoctors,
                totalStaff: data.totalStaff,
                activeClinics: data.activeClinics,
            });
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            setErrorStats(
                error instanceof Error
                    ? error.message
                    : 'Không thể tải thống kê'
            );
        } finally {
            setLoadingStats(false);
        }
    };

    // Fetch total patients count (for card display)
    const fetchTotalPatientsCount = async () => {
        try {
            setLoadingTotalPatients(true);
            const data = await getPatients();
            setTotalPatientsCount(data.length);
        } catch (error) {
            console.error('Error fetching total patients count:', error);
            // Don't set error state here, just log it
        } finally {
            setLoadingTotalPatients(false);
        }
    };

    // Fetch total appointments count (for card display)
    const fetchTotalAppointmentsCount = async () => {
        try {
            setLoadingTotalAppointments(true);
            const data = await getTodayAppointments(100); // Get more to count

            // Đảm bảo data là array
            const appointmentsArray = Array.isArray(data) ? data : [];
            setTotalAppointmentsCount(appointmentsArray.length);
        } catch (error) {
            console.error('Error fetching total appointments count:', error);
            // Don't set error state here, just log it
            setTotalAppointmentsCount(0);
        } finally {
            setLoadingTotalAppointments(false);
        }
    };

    // Fetch historical stats for percentage calculations
    const fetchHistoricalStats = async () => {
        try {
            const data = await getHistoricalStats();
            setHistoricalStats(data);
        } catch (error) {
            console.error('Error fetching historical stats:', error);
            // Don't show error to user, just log it
        }
    };

    // Fetch review statistics
    const fetchReviewStats = async () => {
        try {
            setLoadingReviewStats(true);
            const data = await getReviewStats();
            setReviewStats(data);
        } catch (error) {
            console.error('Error fetching review stats:', error);
            // Don't show error to user, just log it
        } finally {
            setLoadingReviewStats(false);
        }
    };

    // Fetch low stock medicines
    const fetchLowStockMedicines = async () => {
        try {
            setLoadingLowStock(true);
            const { getLowStockMedicines } = await import(
                '@/services/apiMedicine'
            );
            const response = await getLowStockMedicines();
            if (response.isSuccess && response.data) {
                setLowStockMedicines(response.data);
            }
        } catch (error) {
            console.error('Error fetching low stock medicines:', error);
            // Don't show error to user, just log it
        } finally {
            setLoadingLowStock(false);
        }
    };

    // Fetch and show today's appointments
    const fetchAndShowAppointments = async () => {
        try {
            setLoadingAppointments(true);
            setShowAppointmentsModal(true);
            const appointments = await getTodayAppointments(100);
            setTodayAppointments(appointments);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setTodayAppointments([]);
        } finally {
            setLoadingAppointments(false);
        }
    };

    // Calculate percentage change
    const calculatePercentageChange = (
        current: number,
        previous: number
    ): string => {
        if (previous === 0) return '+100%';
        const change = ((current - previous) / previous) * 100;
        const sign = change >= 0 ? '+' : '';
        return `${sign}${change.toFixed(0)}% so với tháng trước`;
    };

    // Get current and previous month stats
    const getCurrentMonth = () => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
            2,
            '0'
        )}`;
    };

    const getPreviousMonth = () => {
        const now = new Date();
        const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        return `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(
            2,
            '0'
        )}`;
    };

    // Load data on mount
    useEffect(() => {
        fetchDashboardStats();
        fetchTotalPatientsCount(); // Fetch total patients count for card
        fetchTotalAppointmentsCount(); // Fetch total appointments count for card
        fetchHistoricalStats(); // Fetch historical stats for percentage calculations
        fetchReviewStats(); // Fetch review statistics
        fetchLowStockMedicines(); // Fetch low stock medicines
    }, []);

    // Prepare stats for display with dynamic percentage calculations
    const displayStats = useMemo(() => {
        const currentMonth = getCurrentMonth();
        const previousMonth = getPreviousMonth();
        const currentStats = historicalStats.find(
            (h) => h.period === currentMonth
        );
        const previousStats = historicalStats.find(
            (h) => h.period === previousMonth
        );

        // Calculate percentage changes
        const patientsChange =
            currentStats && previousStats
                ? calculatePercentageChange(
                      currentStats.newPatients,
                      previousStats.newPatients
                  )
                : '— so với tháng trước';

        const appointmentsChange =
            currentStats && previousStats
                ? calculatePercentageChange(
                      currentStats.completedAppointments,
                      previousStats.completedAppointments
                  )
                : '— so với tháng trước';

        const revenueChange =
            currentStats && previousStats
                ? calculatePercentageChange(
                      currentStats.revenue,
                      previousStats.revenue
                  )
                : '— so với tháng trước';

        return [
            {
                id: 1,
                label: 'Tổng bệnh nhân',
                value:
                    totalPatientsCount !== null
                        ? formatNumber(totalPatientsCount)
                        : loadingTotalPatients
                        ? '...'
                        : '—',
                change: patientsChange,
                icon: FiUsers,
                loading: loadingTotalPatients,
            },
            {
                id: 2,
                label: 'Lịch hẹn hôm nay',
                value:
                    totalAppointmentsCount !== null
                        ? formatNumber(totalAppointmentsCount)
                        : loadingTotalAppointments
                        ? '...'
                        : '—',
                change: appointmentsChange,
                icon: FiCalendar,
                loading: loadingTotalAppointments,
            },
            {
                id: 3,
                label: 'Doanh thu tháng',
                value: stats ? formatVND(stats.monthlyRevenue) : '—',
                change: revenueChange,
                icon: FiDollarSign,
                loading: loadingStats,
            },
            {
                id: 4,
                label: 'Tỷ lệ hài lòng',
                value: stats ? formatPercentage(stats.satisfactionRate) : '—',
                change: '— so với tháng trước', // Satisfaction rate percentage change not available from API
                icon: FiTrendingUp,
                loading: loadingStats,
            },
        ];
    }, [
        totalPatientsCount,
        loadingTotalPatients,
        totalAppointmentsCount,
        loadingTotalAppointments,
        stats,
        loadingStats,
        historicalStats,
    ]);

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
                    {displayStats.map((stat) => (
                        <StatCard
                            key={stat.id}
                            {...stat}
                            onRetry={
                                stat.id === 1 ? fetchDashboardStats : undefined
                            }
                        />
                    ))}
                </div>

                {/* Error message for stats */}
                {errorStats && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                        <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-red-900">
                                Lỗi khi tải thống kê
                            </p>
                            <p className="text-xs text-red-700 mt-1">
                                {errorStats}
                            </p>
                        </div>
                        <button
                            onClick={fetchDashboardStats}
                            className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                            <FiRefreshCw className="w-3.5 h-3.5" />
                            Thử lại
                        </button>
                    </div>
                )}

                {/* Charts và Calendar */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left: Charts - 2 cols */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Revenue Chart */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-semibold text-slate-900">
                                    Doanh thu 6 tháng gần đây
                                </h2>
                                <FiDollarSign className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div className="h-64">
                                {historicalStats.length > 0 ? (
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <LineChart
                                            data={historicalStats.slice(-6)}
                                            margin={{
                                                top: 10,
                                                right: 10,
                                                left: -20,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="#f0f0f0"
                                            />
                                            <XAxis
                                                dataKey="period"
                                                tick={{
                                                    fontSize: 11,
                                                    fill: '#64748b',
                                                }}
                                                tickFormatter={(value) => {
                                                    const [, month] =
                                                        value.split('-');
                                                    return `T${month}`;
                                                }}
                                            />
                                            <YAxis
                                                tick={{
                                                    fontSize: 11,
                                                    fill: '#64748b',
                                                }}
                                                tickFormatter={(value) =>
                                                    `${(
                                                        value / 1000000
                                                    ).toFixed(1)}M`
                                                }
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#fff',
                                                    border: '1px solid #e2e8f0',
                                                    borderRadius: '8px',
                                                    fontSize: '12px',
                                                }}
                                                formatter={(
                                                    value: number | undefined
                                                ) =>
                                                    value
                                                        ? [
                                                              `${formatVND(
                                                                  value
                                                              )}`,
                                                              'Doanh thu',
                                                          ]
                                                        : ['—', 'Doanh thu']
                                                }
                                                labelFormatter={(label) =>
                                                    `Tháng ${label}`
                                                }
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="revenue"
                                                stroke="#10b981"
                                                strokeWidth={2}
                                                dot={{ fill: '#10b981', r: 4 }}
                                                activeDot={{ r: 6 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                                        Đang tải dữ liệu...
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Patient Growth Chart */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-semibold text-slate-900">
                                    Bệnh nhân mới 6 tháng gần đây
                                </h2>
                                <FiUsers className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="h-64">
                                {historicalStats.length > 0 ? (
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart
                                            data={historicalStats.slice(-6)}
                                            margin={{
                                                top: 10,
                                                right: 10,
                                                left: -20,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="#f0f0f0"
                                            />
                                            <XAxis
                                                dataKey="period"
                                                tick={{
                                                    fontSize: 11,
                                                    fill: '#64748b',
                                                }}
                                                tickFormatter={(value) => {
                                                    const [, month] =
                                                        value.split('-');
                                                    return `T${month}`;
                                                }}
                                            />
                                            <YAxis
                                                tick={{
                                                    fontSize: 11,
                                                    fill: '#64748b',
                                                }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#fff',
                                                    border: '1px solid #e2e8f0',
                                                    borderRadius: '8px',
                                                    fontSize: '12px',
                                                }}
                                                formatter={(
                                                    value: number | undefined
                                                ) =>
                                                    value
                                                        ? [
                                                              `${value} bệnh nhân`,
                                                              'Mới',
                                                          ]
                                                        : ['—', 'Mới']
                                                }
                                                labelFormatter={(label) =>
                                                    `Tháng ${label}`
                                                }
                                            />
                                            <Bar
                                                dataKey="newPatients"
                                                fill="#3b82f6"
                                                radius={[8, 8, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                                        Đang tải dữ liệu...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Mini Calendar - 1 col */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-semibold text-slate-900">
                                Lịch làm việc
                            </h2>
                            <FiCalendar className="w-4 h-4 text-rose-500" />
                        </div>
                        <MiniCalendar onTodayClick={fetchAndShowAppointments} />

                        {/* Stats Mini Grid */}
                        <div className="mt-6 space-y-3">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-600">
                                        Bác sĩ
                                    </span>
                                    <span className="text-sm font-semibold text-blue-600">
                                        {additionalStats
                                            ? additionalStats.totalDoctors
                                            : '—'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-3 bg-emerald-50 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-600">
                                        Phòng khám
                                    </span>
                                    <span className="text-sm font-semibold text-emerald-600">
                                        {additionalStats
                                            ? additionalStats.activeClinics
                                            : '—'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-600">
                                        Nhân viên
                                    </span>
                                    <span className="text-sm font-semibold text-purple-600">
                                        {additionalStats
                                            ? additionalStats.totalStaff
                                            : '—'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Review Statistics - Separate Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-slate-900">
                            Đánh giá dịch vụ
                        </h2>
                        <FiTrendingUp className="w-4 h-4 text-amber-600" />
                    </div>

                    {loadingReviewStats ? (
                        <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                            Đang tải dữ liệu...
                        </div>
                    ) : reviewStats && reviewStats.totalReviews > 0 ? (
                        <div className="space-y-4">
                            {/* Summary Stats */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <span className="text-2xl font-bold text-slate-900">
                                            {reviewStats.averageRating.toFixed(
                                                1
                                            )}
                                        </span>
                                        <span className="text-lg text-yellow-400">
                                            ★
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        Trung bình
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-slate-900">
                                        {reviewStats.totalReviews}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Đánh giá
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-emerald-600">
                                        {reviewStats.satisfactionRate.toFixed(
                                            0
                                        )}
                                        %
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Hài lòng
                                    </p>
                                </div>
                            </div>

                            {/* Rating Distribution */}
                            <div className="space-y-2">
                                {[5, 4, 3, 2, 1].map((star) => {
                                    const key = `${
                                        ['five', 'four', 'three', 'two', 'one'][
                                            5 - star
                                        ]
                                    }Star` as keyof typeof reviewStats.ratingDistribution;
                                    const count =
                                        reviewStats.ratingDistribution[key];
                                    const percentage =
                                        reviewStats.totalReviews > 0
                                            ? (count /
                                                  reviewStats.totalReviews) *
                                              100
                                            : 0;

                                    return (
                                        <div
                                            key={star}
                                            className="flex items-center gap-2"
                                        >
                                            <span className="text-xs text-slate-600 w-8">
                                                {star}★
                                            </span>
                                            <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${
                                                        star === 5
                                                            ? 'bg-emerald-500'
                                                            : star === 4
                                                            ? 'bg-blue-500'
                                                            : star === 3
                                                            ? 'bg-yellow-500'
                                                            : star === 2
                                                            ? 'bg-orange-500'
                                                            : 'bg-red-500'
                                                    }`}
                                                    style={{
                                                        width: `${percentage}%`,
                                                    }}
                                                />
                                            </div>
                                            <span className="text-xs text-slate-600 w-8 text-right">
                                                {count}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-sm">
                            <p>Chưa có đánh giá nào</p>
                            <p className="text-xs mt-1">
                                Khuyến khích bệnh nhân đánh giá sau khám
                            </p>
                        </div>
                    )}
                </div>

                {/* Low Stock Alert Section */}
                {(loadingLowStock || lowStockMedicines.length > 0) && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <FiAlertTriangle className="w-4 h-4 text-orange-500" />
                                <h2 className="text-sm font-semibold text-slate-900">
                                    Cảnh báo thuốc sắp hết
                                </h2>
                            </div>
                            <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
                                {lowStockMedicines.length} thuốc
                            </span>
                        </div>

                        {loadingLowStock ? (
                            <div className="h-32 flex items-center justify-center text-slate-400 text-sm">
                                Đang tải dữ liệu...
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {lowStockMedicines.map((medicine) => (
                                    <div
                                        key={medicine.medicineId}
                                        className={`p-3 rounded-lg border ${
                                            medicine.isExpiringSoon
                                                ? 'bg-red-50 border-red-200'
                                                : 'bg-orange-50 border-orange-200'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <FaPills
                                                    className={`w-4 h-4 ${
                                                        medicine.isExpiringSoon
                                                            ? 'text-red-500'
                                                            : 'text-orange-500'
                                                    }`}
                                                />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">
                                                        {medicine.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        Mã: {medicine.code}{' '}
                                                        {medicine.unit &&
                                                            `• ${medicine.unit}`}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p
                                                    className={`text-sm font-semibold ${
                                                        medicine.stockQuantity ===
                                                        0
                                                            ? 'text-red-600'
                                                            : 'text-orange-600'
                                                    }`}
                                                >
                                                    {medicine.stockQuantity} /{' '}
                                                    {medicine.minStockLevel}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    Tồn kho / Mức tối thiểu
                                                </p>
                                                {medicine.isExpiringSoon && (
                                                    <p className="text-xs text-red-600 mt-1">
                                                        ⚠️ Sắp hết hạn
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {lowStockMedicines.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-slate-100">
                                <a
                                    href="/admin/medicines"
                                    className="text-sm text-orange-600 hover:text-orange-700 font-medium hover:underline"
                                >
                                    Xem chi tiết và cập nhật tồn kho →
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Appointments Modal */}
            {showAppointmentsModal && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={() => setShowAppointmentsModal(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">
                                    Lịch hẹn hôm nay
                                </h3>
                                <p className="text-sm text-slate-500 mt-0.5">
                                    {new Date().toLocaleDateString('vi-VN', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowAppointmentsModal(false)}
                                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
                            >
                                <FiAlertCircle className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
                            {loadingAppointments ? (
                                <div className="p-12 flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                                    <p className="text-sm text-slate-500">
                                        Đang tải...
                                    </p>
                                </div>
                            ) : todayAppointments.length === 0 ? (
                                <div className="p-12 flex flex-col items-center justify-center">
                                    <FiCalendar className="w-16 h-16 text-slate-300 mb-4" />
                                    <p className="text-sm font-medium text-slate-900">
                                        Không có lịch hẹn
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Hôm nay chưa có lịch hẹn nào
                                    </p>
                                </div>
                            ) : (
                                <div className="p-6 space-y-3">
                                    {todayAppointments.map((apt) => (
                                        <div
                                            key={apt.id}
                                            className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h4 className="font-semibold text-slate-900">
                                                            {apt.patientName}
                                                        </h4>
                                                        <span
                                                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                                                apt.status ===
                                                                'confirmed'
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : apt.status ===
                                                                      'pending'
                                                                    ? 'bg-yellow-100 text-yellow-700'
                                                                    : apt.status ===
                                                                      'checked-in'
                                                                    ? 'bg-blue-100 text-blue-700'
                                                                    : 'bg-red-100 text-red-700'
                                                            }`}
                                                        >
                                                            {apt.status ===
                                                            'confirmed'
                                                                ? 'Đã xác nhận'
                                                                : apt.status ===
                                                                  'pending'
                                                                ? 'Chờ xác nhận'
                                                                : apt.status ===
                                                                  'checked-in'
                                                                ? 'Đã check-in'
                                                                : 'Đã hủy'}
                                                        </span>
                                                    </div>
                                                    <div className="space-y-1 text-sm text-slate-600">
                                                        <div className="flex items-center gap-2">
                                                            <FiCalendar className="w-4 h-4 flex-shrink-0" />
                                                            <span>
                                                                {apt.time} •{' '}
                                                                {apt.duration}{' '}
                                                                phút
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <FiUsers className="w-4 h-4 flex-shrink-0" />
                                                            <span>
                                                                BS. {apt.doctor}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <FiDollarSign className="w-4 h-4 flex-shrink-0" />
                                                            <span>
                                                                {apt.service}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {apt.notes && (
                                                        <p className="mt-2 text-xs text-slate-500 italic">
                                                            {apt.notes}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        {!loadingAppointments &&
                            todayAppointments.length > 0 && (
                                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                                    <p className="text-sm text-slate-600">
                                        Tổng cộng:{' '}
                                        <span className="font-semibold text-slate-900">
                                            {todayAppointments.length}
                                        </span>{' '}
                                        lịch hẹn
                                    </p>
                                </div>
                            )}
                    </div>
                </div>
            )}
        </div>
    );
};

/* ====== Mini Calendar Component ====== */

interface MiniCalendarProps {
    onTodayClick?: () => void;
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({ onTodayClick }) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const currentDate = today.getDate();

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const monthNames = [
        'Tháng 1',
        'Tháng 2',
        'Tháng 3',
        'Tháng 4',
        'Tháng 5',
        'Tháng 6',
        'Tháng 7',
        'Tháng 8',
        'Tháng 9',
        'Tháng 10',
        'Tháng 11',
        'Tháng 12',
    ];

    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const handleDayClick = (day: number | null) => {
        if (day === currentDate && onTodayClick) {
            onTodayClick();
        }
    };

    return (
        <div>
            <div className="text-center mb-3">
                <h3 className="text-sm font-semibold text-slate-900">
                    {monthNames[currentMonth]} {currentYear}
                </h3>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((day) => (
                    <div
                        key={day}
                        className="text-center text-xs font-medium text-slate-500 py-1"
                    >
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => (
                    <div
                        key={index}
                        onClick={() => handleDayClick(day)}
                        className={`aspect-square flex items-center justify-center text-xs rounded-lg transition-all ${
                            day === null
                                ? ''
                                : day === currentDate
                                ? 'bg-rose-500 text-white font-semibold cursor-pointer hover:bg-rose-600 hover:scale-105'
                                : 'text-slate-700 hover:bg-slate-100 cursor-pointer'
                        }`}
                    >
                        {day || ''}
                    </div>
                ))}
            </div>

            <div className="mt-3 text-xs text-center text-slate-500">
                Hôm nay: {currentDate}/{currentMonth + 1}/{currentYear}
            </div>
        </div>
    );
};

/* ====== StatCard Component ====== */

type StatCardProps = {
    label: string;
    value: string;
    change: string;
    icon: React.ElementType;
    loading?: boolean;
    onRetry?: () => void;
};

const StatCard: React.FC<StatCardProps> = ({
    label,
    value,
    change,
    icon,
    loading = false,
}) => {
    const Icon = icon;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-4 py-4 flex items-start justify-between">
            <div className="flex-1 min-w-0">
                <p className="text-[12px] text-slate-500">{label}</p>
                {loading ? (
                    <div className="mt-2 space-y-2">
                        <div className="h-6 bg-slate-200 rounded animate-pulse w-20"></div>
                        <div className="h-4 bg-slate-200 rounded animate-pulse w-32"></div>
                    </div>
                ) : (
                    <>
                        <p className="mt-2 text-lg font-semibold text-slate-900">
                            {value}
                        </p>
                        <p className="mt-1 text-[11px] text-emerald-600">
                            {change}
                        </p>
                    </>
                )}
            </div>
            <div className="w-9 h-9 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[#2563EB] flex-shrink-0">
                {loading ? (
                    <div className="w-4 h-4 bg-slate-300 rounded animate-pulse"></div>
                ) : (
                    <Icon className="w-4 h-4" />
                )}
            </div>
        </div>
    );
};

export default AdminDashboardPage;
