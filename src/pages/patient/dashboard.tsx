import React, { useState, useEffect } from "react";
import {
  FiCalendar,
  FiClipboard,
  FiClock,
  FiChevronRight,
  FiPhone,
  FiFileText,
  FiUser,
} from "react-icons/fi";
import BookingModal from "../../components/patient/BookingModal";
import { useNavigate } from "react-router-dom";
import {
  getPatientProfile,
  getPatientAppointments,
  getMedicalRecords,
  type AppointmentDto,
} from "../../services/apiPatient";

const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data states
  const [patientName, setPatientName] = useState<string>("");
  const [stats, setStats] = useState([
    { icon: FiCalendar, label: "Lịch hẹn sắp tới", value: "0", color: "text-[#2563EB]", bg: "bg-blue-50" },
    { icon: FiClipboard, label: "Điều trị hoàn thành", value: "0", color: "text-emerald-600", bg: "bg-emerald-50" },
    { icon: FiClock, label: "Lần khám gần nhất", value: "N/A", color: "text-purple-600", bg: "bg-purple-50" },
  ]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Array<{
    id: string;
    title: string;
    doctor: string;
    date: string;
    time: string;
    status: string;
  }>>([]);
  const [treatments, setTreatments] = useState<Array<{
    id: string;
    title: string;
    doctor: string;
    date: string;
  }>>([]);

  // Helper function to format date from ISO to DD/MM/YYYY
  const formatDate = (isoDate: string): string => {
    if (!isoDate) return "N/A";
    try {
      const date = new Date(isoDate);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return isoDate;
    }
  };

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Step 1: Fetch all data in parallel (không cần patientId, lấy từ JWT token)
        const [profileRes, appointmentsRes, medicalRecordsRes] = await Promise.all([
          getPatientProfile(),
          getPatientAppointments(),
          getMedicalRecords(),
        ]);

        // Step 2: Update patient name
        if (profileRes?.isSuccess && profileRes.data) {
          setPatientName(profileRes.data.fullName);
        }

        // Step 3: Calculate stats from appointments
        const now = new Date();
        let upcomingCount = 0;
        let upcomingAppointmentsList: AppointmentDto[] = [];

        if (appointmentsRes?.isSuccess && appointmentsRes.data) {
          // Helper to parse date from DD/MM/YYYY format
          const parseFormattedDate = (dateStr: string, timeStr: string): Date => {
            // dateStr is "DD/MM/YYYY", timeStr is "HH:mm"
            const [day, month, year] = dateStr.split('/');
            const [hours, minutes] = timeStr.split(':');
            return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
          };

          // Filter upcoming appointments: status is "Confirmed" or "Pending" and date > now
          upcomingAppointmentsList = appointmentsRes.data.filter((apt: AppointmentDto) => {
            const aptDate = parseFormattedDate(apt.date, apt.time);
            const status = apt.status.toLowerCase();
            // Include confirmed, pending, booked, checkedin, inprogress statuses that are in the future
            const validStatuses = ["confirmed", "pending", "booked", "checkedin", "inprogress"];
            return validStatuses.includes(status) && aptDate > now;
          });

          upcomingCount = upcomingAppointmentsList.length;

          // Sort by date (earliest first) and take first 2
          upcomingAppointmentsList.sort((a, b) => {
            const dateA = parseFormattedDate(a.date, a.time);
            const dateB = parseFormattedDate(b.date, b.time);
            return dateA.getTime() - dateB.getTime();
          });

          // Map to UI format (limit 2 items) - data already formatted
          const formattedAppointments = upcomingAppointmentsList.slice(0, 2).map((apt: AppointmentDto) => ({
            id: apt.id,
            title: apt.title,
            doctor: apt.doctor,
            date: apt.date, // Already formatted as DD/MM/YYYY
            time: apt.time, // Already formatted as HH:mm
            status: apt.status.toLowerCase(),
          }));
          setUpcomingAppointments(formattedAppointments);
        }

        // Step 4: Calculate stats from medical records
        let completedCount = 0;
        let lastVisit: string | null = null;
        const allVisitDates: string[] = [];

        if (medicalRecordsRes?.isSuccess && medicalRecordsRes.data) {
          completedCount = medicalRecordsRes.data.length;

          // Extract dates from medical records (data is already transformed to use 'date' field)
          medicalRecordsRes.data.forEach((record) => {
            if (record.date) {
              allVisitDates.push(record.date);
            }
          });

          // Map medical records to treatments (limit 3 items, sorted by date desc)
          const sortedRecords = [...medicalRecordsRes.data].sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });

          const formattedTreatments = sortedRecords.slice(0, 3).map((record) => ({
            id: record.id,
            title: record.title,
            doctor: record.doctor,
            date: formatDate(record.date),
          }));
          setTreatments(formattedTreatments);
        }

        // Also check completed appointments for last visit
        if (appointmentsRes?.isSuccess && appointmentsRes.data) {
          appointmentsRes.data.forEach((apt) => {
            const status = apt.status?.toLowerCase();
            if (status === 'completed') {
              // Get date from appointment (date is already formatted as DD/MM/YYYY)
              // Parse it back to ISO format for comparison
              if (apt.date) {
                const [day, month, year] = apt.date.split('/');
                const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                allVisitDates.push(isoDate);
              }
            }
          });
        }

        // Find the latest visit date from all sources
        if (allVisitDates.length > 0) {
          const sortedDates = allVisitDates
            .filter(date => date) // Remove null/undefined
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()); // Sort desc
          lastVisit = sortedDates[0]; // Get the most recent date
        }

        // Step 5: Update stats cards
        setStats([
          { icon: FiCalendar, label: "Lịch hẹn sắp tới", value: String(upcomingCount), color: "text-[#2563EB]", bg: "bg-blue-50" },
          { icon: FiClipboard, label: "Điều trị hoàn thành", value: String(completedCount), color: "text-emerald-600", bg: "bg-emerald-50" },
          { icon: FiClock, label: "Lần khám gần nhất", value: lastVisit ? formatDate(lastVisit) : "N/A", color: "text-purple-600", bg: "bg-purple-50" },
        ]);

      } catch (err: unknown) {
        console.error("Error fetching dashboard data:", err);
        const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra khi tải dữ liệu";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statusColors: Record<string, string> = {
    confirmed: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    completed: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const statusLabels: Record<string, string> = {
    confirmed: "Đã xác nhận",
    pending: "Chờ xác nhận",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  };

  if (loading) {
    return (
      <div className="px-6 py-8 lg:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563EB]"></div>
              <p className="mt-4 text-sm text-slate-500">Đang tải dữ liệu...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-8 lg:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 font-medium">Lỗi: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 lg:px-10">
      <div className="max-w-[1400px] mx-auto space-y-8">
        {/* Header */}
        <div>
          <span className="inline-flex items-center rounded-full bg-[#E0ECFF] text-[#2563EB] text-[11px] font-semibold px-4 py-1.5 tracking-wide uppercase mb-3">
            PATIENT DASHBOARD
          </span>
          <h1 className="text-xl font-semibold text-slate-900">
            Xin chào, {patientName || "Bệnh nhân"}!
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Tổng quan về tình trạng sức khỏe răng miệng của bạn
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                  <p className="text-lg font-semibold text-slate-900 mt-0.5">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Upcoming Appointments - Full Width */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-slate-900">Lịch hẹn sắp tới</h2>
            <button
              onClick={() => navigate("/patient/appointments")}
              className="flex items-center gap-1 text-sm text-[#2563EB] hover:underline"
            >
              <span>Xem tất cả</span>
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#E0ECFF] rounded-xl flex items-center justify-center text-[#2563EB]">
                      <FiCalendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{apt.title}</p>
                      <p className="text-xs text-slate-500">{apt.doctor}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-600 font-medium">{apt.date} • {apt.time}</p>
                    <span className={`inline-block mt-1 px-2.5 py-0.5 ${statusColors[apt.status] || "bg-gray-100 text-gray-700"} text-[10px] font-medium rounded-full`}>
                      {statusLabels[apt.status] || apt.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-8 text-slate-500 text-sm">
                Chưa có lịch hẹn sắp tới
              </div>
            )}
          </div>

          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="mt-5 w-full py-3 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1D4ED8] transition"
          >
            Đặt lịch hẹn mới
          </button>
        </div>

        {/* Quick Actions + Treatment History - 2 columns */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-5">Thao tác nhanh</h2>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => navigate("/patient/appointments")}
                className="p-4 bg-blue-50 rounded-xl text-left hover:bg-blue-100 transition"
              >
                <FiCalendar className="w-6 h-6 text-[#2563EB] mb-2" />
                <p className="text-sm font-medium text-slate-900">Lịch hẹn</p>
                <p className="text-xs text-slate-500">Xem lịch hẹn của bạn</p>
              </button>

              <button
                onClick={() => navigate("/patient/medical-history")}
                className="p-4 bg-emerald-50 rounded-xl text-left hover:bg-emerald-100 transition"
              >
                <FiFileText className="w-6 h-6 text-emerald-600 mb-2" />
                <p className="text-sm font-medium text-slate-900">Hồ sơ bệnh án</p>
                <p className="text-xs text-slate-500">Xem lịch sử khám</p>
              </button>

              <button
                onClick={() => navigate("/patient/profile")}
                className="p-4 bg-purple-50 rounded-xl text-left hover:bg-purple-100 transition"
              >
                <FiUser className="w-6 h-6 text-purple-600 mb-2" />
                <p className="text-sm font-medium text-slate-900">Hồ sơ cá nhân</p>
                <p className="text-xs text-slate-500">Cập nhật thông tin</p>
              </button>

              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="p-4 bg-amber-50 rounded-xl text-left hover:bg-amber-100 transition"
              >
                <FiClock className="w-6 h-6 text-amber-600 mb-2" />
                <p className="text-sm font-medium text-slate-900">Đặt lịch</p>
                <p className="text-xs text-slate-500">Đặt lịch hẹn mới</p>
              </button>
            </div>
          </div>

          {/* Treatment History */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-900">Lịch sử điều trị</h2>
              <button
                onClick={() => navigate("/patient/medical-history")}
                className="flex items-center gap-1 text-sm text-[#2563EB] hover:underline"
              >
                <span>Xem tất cả</span>
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {treatments.length > 0 ? (
                treatments.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <FiClipboard className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.doctor}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">{item.date}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500 text-sm">
                  Chưa có lịch sử điều trị
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Support banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white px-7 py-6 lg:px-10 lg:py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-base font-semibold">Cần hỗ trợ?</p>
            <p className="text-sm text-blue-100 mt-1">
              Liên hệ với chúng tôi để được tư vấn và hỗ trợ
            </p>
          </div>

          <button className="inline-flex items-center gap-2 rounded-full bg-white text-[#2563EB] px-5 py-2.5 text-sm font-semibold shadow-sm hover:bg-slate-50 transition">
            <FiPhone className="w-4 h-4" />
            <span>Gọi ngay: 028 1234 5678</span>
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSubmit={(data) => {
          console.log("Booking data:", data);
        }}
      />
    </div>
  );
};

export default PatientDashboard;
