import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiTrendingUp,
  FiActivity,
  FiRefreshCw,
  FiAlertCircle,
  FiArrowLeft,
} from "react-icons/fi";
import {
  getAdminDashboardStats,
  getPatients,
  getTodayAppointments,
  type AdminDashboardStats,
  type PatientItem,
  type TodayAppointmentItem,
} from "@/services/apiAdmin";
import {
  formatVND,
  formatNumber,
  formatPercentage,
} from "@/services/helper";

const AdminDashboardPage: React.FC = () => {
  // State management
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState<string | null>(null);
  
  // Patients list state
  const [showPatientsList, setShowPatientsList] = useState(false);
  const [patients, setPatients] = useState<PatientItem[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [errorPatients, setErrorPatients] = useState<string | null>(null);
  const [totalPatientsCount, setTotalPatientsCount] = useState<number | null>(null);
  const [loadingTotalPatients, setLoadingTotalPatients] = useState(false);

  // Appointments list state
  const [showAppointmentsList, setShowAppointmentsList] = useState(false);
  const [appointments, setAppointments] = useState<TodayAppointmentItem[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [errorAppointments, setErrorAppointments] = useState<string | null>(null);
  const [totalAppointmentsCount, setTotalAppointmentsCount] = useState<number | null>(null);
  const [loadingTotalAppointments, setLoadingTotalAppointments] = useState(false);

  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    try {
      setLoadingStats(true);
      setErrorStats(null);
      const data = await getAdminDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      setErrorStats(
        error instanceof Error ? error.message : "Không thể tải thống kê"
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
      console.error("Error fetching total patients count:", error);
      // Don't set error state here, just log it
    } finally {
      setLoadingTotalPatients(false);
    }
  };

  // Fetch patients list
  const fetchPatients = async () => {
    try {
      setLoadingPatients(true);
      setErrorPatients(null);
      const data = await getPatients();
      setPatients(data);
      setTotalPatientsCount(data.length); // Update count when fetching list
      setShowPatientsList(true);
    } catch (error) {
      console.error("Error fetching patients:", error);
      setErrorPatients(
        error instanceof Error ? error.message : "Không thể tải danh sách bệnh nhân"
      );
    } finally {
      setLoadingPatients(false);
    }
  };

  // Handle click on "Tổng bệnh nhân" card
  const handleTotalPatientsClick = () => {
    if (!showPatientsList) {
      // Ẩn appointments list nếu đang hiển thị
      setShowAppointmentsList(false);
      setErrorAppointments(null);
      // Hiển thị patients list
      fetchPatients();
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
      console.error("Error fetching total appointments count:", error);
      // Don't set error state here, just log it
      setTotalAppointmentsCount(0);
    } finally {
      setLoadingTotalAppointments(false);
    }
  };

  // Fetch appointments list
  const fetchAppointments = async () => {
    try {
      setLoadingAppointments(true);
      setErrorAppointments(null);
      const data = await getTodayAppointments(100); // Get all for display
      
      // Đảm bảo data là array
      const appointmentsArray = Array.isArray(data) ? data : [];
      setAppointments(appointmentsArray);
      setTotalAppointmentsCount(appointmentsArray.length); // Update count when fetching list
      setShowAppointmentsList(true);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setErrorAppointments(
        error instanceof Error ? error.message : "Không thể tải danh sách lịch hẹn"
      );
      setAppointments([]); // Set empty array on error
    } finally {
      setLoadingAppointments(false);
    }
  };

  // Handle click on "Lịch hẹn hôm nay" card
  const handleTodayAppointmentsClick = () => {
    if (!showAppointmentsList) {
      // Ẩn patients list nếu đang hiển thị
      setShowPatientsList(false);
      setErrorPatients(null);
      // Hiển thị appointments list
      fetchAppointments();
    }
  };

  // Handle back to activities
  const handleBackToActivities = () => {
    setShowPatientsList(false);
    setShowAppointmentsList(false);
    setErrorPatients(null);
    setErrorAppointments(null);
  };

  // Load data on mount
  useEffect(() => {
    fetchDashboardStats();
    fetchTotalPatientsCount(); // Fetch total patients count for card
    fetchTotalAppointmentsCount(); // Fetch total appointments count for card
  }, []);

  // Prepare stats for display
  const displayStats = [
    {
      id: 1,
      label: "Tổng bệnh nhân",
      value: totalPatientsCount !== null 
        ? formatNumber(totalPatientsCount) 
        : loadingTotalPatients 
          ? "..." 
          : "—",
      change: "+12% so với tháng trước", // TODO: Calculate from API if available
      icon: FiUsers,
      loading: loadingTotalPatients,
    },
    {
      id: 2,
      label: "Lịch hẹn hôm nay",
      value: totalAppointmentsCount !== null 
        ? formatNumber(totalAppointmentsCount) 
        : loadingTotalAppointments 
          ? "..." 
          : "—",
      change: "+5% so với tháng trước", // TODO: Calculate from API if available
      icon: FiCalendar,
      loading: loadingTotalAppointments,
    },
    {
      id: 3,
      label: "Doanh thu tháng",
      value: stats ? formatVND(stats.monthlyRevenue) : "—",
      change: "+18% so với tháng trước", // TODO: Calculate from API if available
      icon: FiDollarSign,
      loading: loadingStats,
    },
    {
      id: 4,
      label: "Tỷ lệ hài lòng",
      value: stats ? formatPercentage(stats.satisfactionRate) : "—",
      change: "+2% so với tháng trước", // TODO: Calculate from API if available
      icon: FiTrendingUp,
      loading: loadingStats,
    },
  ];

  // Mock activities (chưa có API)
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
          {displayStats.map((stat) => (
            <StatCard
              key={stat.id}
              {...stat}
              onRetry={stat.id === 1 ? fetchDashboardStats : undefined}
              onClick={
                stat.id === 1 
                  ? handleTotalPatientsClick 
                  : stat.id === 2 
                    ? handleTodayAppointmentsClick 
                    : undefined
              }
              clickable={stat.id === 1 || stat.id === 2}
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
              <p className="text-xs text-red-700 mt-1">{errorStats}</p>
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

        {/* Main 2-column content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent activities or Patients/Appointments list */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 lg:p-6">
            {!showPatientsList && !showAppointmentsList ? (
              <>
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
              </>
            ) : showPatientsList ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FiUsers className="w-4 h-4 text-[#2563EB]" />
                    <h2 className="text-sm font-semibold text-slate-900">
                      Danh sách bệnh nhân
                    </h2>
                  </div>
                  <button
                    onClick={handleBackToActivities}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-[#2563EB] transition-colors"
                  >
                    <FiArrowLeft className="w-3.5 h-3.5" />
                    Trở lại
                  </button>
                </div>

                {errorPatients ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-red-700">{errorPatients}</p>
                    <button
                      onClick={fetchPatients}
                      className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                    >
                      Thử lại
                    </button>
                  </div>
                ) : loadingPatients ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="w-12 h-12 bg-slate-200 rounded animate-pulse" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-slate-200 rounded animate-pulse w-32" />
                          <div className="h-3 bg-slate-200 rounded animate-pulse w-48" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <div className="max-h-[320px] overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-[#F9FAFB] z-10">
                          <tr className="text-xs text-slate-500 border-b border-slate-200">
                            <th className="text-left font-medium px-3 py-2">Mã BN</th>
                            <th className="text-left font-medium px-3 py-2">Họ tên</th>
                            <th className="text-left font-medium px-3 py-2">SĐT</th>
                            <th className="text-left font-medium px-3 py-2">Phòng khám</th>
                          </tr>
                        </thead>
                        <tbody>
                          {patients.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="px-3 py-6 text-center text-sm text-slate-400">
                                Không có bệnh nhân nào
                              </td>
                            </tr>
                          ) : (
                            patients.map((patient, idx) => (
                              <tr
                                key={patient.patientId}
                                className={`border-b border-slate-100 ${
                                  idx % 2 === 1 ? "bg-[#FCFCFD]" : "bg-white"
                                }`}
                              >
                                <td className="px-3 py-2.5 text-slate-800 font-medium">
                                  {patient.patientCode}
                                </td>
                                <td className="px-3 py-2.5 text-slate-800">
                                  {patient.fullName}
                                </td>
                                <td className="px-3 py-2.5 text-slate-600">
                                  {patient.primaryPhone || "—"}
                                </td>
                                <td className="px-3 py-2.5 text-slate-600 text-xs">
                                  {patient.clinic?.name || "—"}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="w-4 h-4 text-[#2563EB]" />
                    <h2 className="text-sm font-semibold text-slate-900">
                      Lịch hẹn hôm nay
                    </h2>
                  </div>
                  <button
                    onClick={handleBackToActivities}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-[#2563EB] transition-colors"
                  >
                    <FiArrowLeft className="w-3.5 h-3.5" />
                    Trở lại
                  </button>
                </div>

                {errorAppointments ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-red-700">{errorAppointments}</p>
                    <button
                      onClick={fetchAppointments}
                      className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                    >
                      Thử lại
                    </button>
                  </div>
                ) : loadingAppointments ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="w-12 h-12 bg-slate-200 rounded animate-pulse" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-slate-200 rounded animate-pulse w-32" />
                          <div className="h-3 bg-slate-200 rounded animate-pulse w-48" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <div className="max-h-[320px] overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-[#F9FAFB] z-10">
                          <tr className="text-xs text-slate-500 border-b border-slate-200">
                            <th className="text-left font-medium px-3 py-2">Bệnh nhân</th>
                            <th className="text-left font-medium px-3 py-2">SĐT</th>
                            <th className="text-left font-medium px-3 py-2">Dịch vụ</th>
                            <th className="text-left font-medium px-3 py-2">Bác sĩ</th>
                            <th className="text-left font-medium px-3 py-2">Thời gian</th>
                            <th className="text-left font-medium px-3 py-2">Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody>
                          {appointments.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="px-3 py-6 text-center text-sm text-slate-400">
                                Không có lịch hẹn nào hôm nay
                              </td>
                            </tr>
                          ) : (
                            appointments.map((appointment, idx) => (
                              <tr
                                key={appointment.id}
                                className={`border-b border-slate-100 ${
                                  idx % 2 === 1 ? "bg-[#FCFCFD]" : "bg-white"
                                }`}
                              >
                                <td className="px-3 py-2.5 text-slate-800 font-medium">
                                  {appointment.patientName}
                                </td>
                                <td className="px-3 py-2.5 text-slate-600">
                                  {appointment.phone}
                                </td>
                                <td className="px-3 py-2.5 text-slate-600">
                                  {appointment.service}
                                </td>
                                <td className="px-3 py-2.5 text-slate-600">
                                  {appointment.doctor}
                                </td>
                                <td className="px-3 py-2.5 text-slate-600">
                                  {appointment.time}
                                </td>
                                <td className="px-3 py-2.5">
                                  <StatusBadge status={appointment.status} />
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Quick actions */}
          <div className="space-y-4">
            <GradientCard
              title="Quản lý người dùng"
              description="Thêm, sửa, xóa tài khoản nhân viên"
              buttonLabel="Quản lý ngay"
              gradient="from-[#2563EB] to-[#1D4ED8]"
              route="/admin/users"
            />
            <GradientCard
              title="Báo cáo & Thống kê"
              description="Xem báo cáo chi tiết về hoạt động"
              buttonLabel="Xem báo cáo"
              gradient="from-[#7C3AED] to-[#EC4899]"
              route="/admin/reports"
            />
            <GradientCard
              title="Cài đặt hệ thống"
              description="Cấu hình và tùy chỉnh hệ thống"
              buttonLabel="Cài đặt"
              gradient="from-[#F97316] to-[#EF4444]"
              route="/admin/settings"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ====== Status Badge cho appointments ====== */

const StatusBadge: React.FC<{ status: "confirmed" | "pending" | "checked-in" | "cancelled" }> = ({ status }) => {
  const statusConfig = {
    confirmed: { label: "Đã xác nhận", className: "bg-[#DCFCE7] text-[#15803D]" },
    pending: { label: "Chờ xác nhận", className: "bg-[#FEF3C7] text-[#D97706]" },
    "checked-in": { label: "Đã check-in", className: "bg-[#DBEAFE] text-[#2563EB]" },
    cancelled: { label: "Đã hủy", className: "bg-[#FEE2E2] text-[#DC2626]" },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${config.className}`}>
      {config.label}
    </span>
  );
};

export default AdminDashboardPage;

/* ====== Sub components ====== */

type StatCardProps = {
  label: string;
  value: string;
  change: string;
  icon: React.ElementType;
  loading?: boolean;
  onRetry?: () => void;
  onClick?: () => void;
  clickable?: boolean;
};

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  icon,
  loading = false,
  onClick,
  clickable = false,
}) => {
  const Icon = icon;
  
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-slate-100 px-4 py-4 flex items-start justify-between ${
        clickable && !loading
          ? "cursor-pointer hover:shadow-md hover:border-[#2563EB] transition-all"
          : ""
      }`}
      onClick={clickable && !loading ? onClick : undefined}
    >
      <div className="flex-1 min-w-0">
        <p className="text-[12px] text-slate-500">{label}</p>
        {loading ? (
          <div className="mt-2 space-y-2">
            <div className="h-6 bg-slate-200 rounded animate-pulse w-20"></div>
            <div className="h-4 bg-slate-200 rounded animate-pulse w-32"></div>
          </div>
        ) : (
          <>
            <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
            <p className="mt-1 text-[11px] text-emerald-600">{change}</p>
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

type GradientCardProps = {
  title: string;
  description: string;
  buttonLabel: string;
  gradient: string; // tailwind gradient class
  route: string;
};

const GradientCard: React.FC<GradientCardProps> = ({
  title,
  description,
  buttonLabel,
  gradient,
  route,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(route);
  };

  return (
    <div
      className={`rounded-2xl px-6 py-5 text-white shadow-sm bg-gradient-to-r ${gradient}`}
    >
      <h3 className="text-sm sm:text-base font-semibold">{title}</h3>
      <p className="mt-2 text-xs sm:text-sm text-blue-100 max-w-xs">
        {description}
      </p>
      <button 
        onClick={handleClick}
        className="mt-4 inline-flex items-center justify-center rounded-lg bg-white/90 hover:bg-white text-xs sm:text-sm font-semibold text-slate-900 px-4 py-2 shadow-sm transition-colors cursor-pointer"
      >
        {buttonLabel}
      </button>
    </div>
  );
};
