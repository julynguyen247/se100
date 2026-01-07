import React, { useState, useEffect } from "react";
import { FiCalendar, FiClock, FiSearch, FiPlus } from "react-icons/fi";
import BookingModal from "../../components/patient/BookingModal";
import AppointmentDetailModal from "../../components/patient/AppointmentDetailModal";
import CancelAppointmentModal from "../../components/patient/CancelAppointmentModal";
import { getPatientAppointments, cancelAppointment, type AppointmentDto, type AppointmentStatus } from "@/services/apiPatient";

const statusMap: Record<
  AppointmentStatus,
  { label: string; className: string }
> = {
  booked: {
    label: "Đã đặt lịch",
    className: "bg-[#FEF3C7] text-[#92400E]",
  },
  confirmed: {
    label: "Đã xác nhận",
    className: "bg-[#E0ECFF] text-[#2563EB]",
  },
  pending: {
    label: "Chờ xác nhận",
    className: "bg-[#FEF3C7] text-[#92400E]",
  },
  completed: {
    label: "Hoàn thành",
    className: "bg-[#DCFCE7] text-[#15803D]",
  },
  cancelled: {
    label: "Đã huỷ",
    className: "bg-[#FEE2E2] text-[#B91C1C]",
  },
  noshow: {
    label: "Không đến",
    className: "bg-[#FEE2E2] text-[#DC2626]",
  },
};

const MyAppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDto | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch appointments from backend
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getPatientAppointments();
        if (response && response.isSuccess) {
          setAppointments(response.data || []);
        } else {
          setError(response?.message || "Không thể tải danh sách lịch hẹn");
        }
      } catch (err: any) {
        console.error("Error fetching appointments:", err);
        setError(err.response?.data?.message || "Đã xảy ra lỗi khi tải lịch hẹn");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filtered = appointments.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleViewDetail = (appointment: AppointmentDto) => {
    setSelectedAppointment(appointment);
    setIsDetailModalOpen(true);
  };

  const handleOpenCancelModal = (appointment: AppointmentDto) => {
    setSelectedAppointment(appointment);
    setIsCancelModalOpen(true);
  };

  const handleCancelFromDetail = (id: string) => {
    const apt = appointments.find((a) => a.id === id);
    if (apt) {
      setIsDetailModalOpen(false);
      setTimeout(() => {
        setSelectedAppointment(apt);
        setIsCancelModalOpen(true);
      }, 200);
    }
  };

  const handleConfirmCancel = async (reason: string) => {
    if (!selectedAppointment) return;

    try {
      const response = await cancelAppointment(selectedAppointment.id, reason);
      if (response && response.isSuccess) {
        // Update appointment status locally
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === selectedAppointment.id
              ? { ...a, status: "cancelled" as AppointmentStatus, note: reason || a.note }
              : a
          )
        );
        setIsCancelModalOpen(false);
        setSelectedAppointment(null);
        alert("Đã huỷ lịch hẹn thành công!");
      } else {
        alert(response?.message || "Không thể huỷ lịch hẹn");
      }
    } catch (err: any) {
      console.error("Error cancelling appointment:", err);
      const errorMsg = err.response?.data?.message || "Đã xảy ra lỗi khi huỷ lịch hẹn";
      alert(errorMsg);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F5F7FB] px-6 py-8 sm:px-10 lg:px-20">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <span className="inline-flex items-center justify-center rounded-full bg-[#E0ECFF] text-[#2563EB] text-[11px] font-semibold px-5 py-1.5 tracking-[0.16em] uppercase mb-3">
            MY APPOINTMENTS
          </span>
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
            Lịch hẹn của tôi
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý và theo dõi các lịch hẹn của bạn
          </p>
        </div>

        {/* Search + button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm lịch hẹn..."
              className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/60"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1D4ED8]"
          >
            <FiPlus className="w-4 h-4" />
            <span>Đặt lịch mới</span>
          </button>
        </div>

        {/* List appointments */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-10 text-slate-500">
              Đang tải danh sách lịch hẹn...
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-600 mb-2">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-[#2563EB] hover:underline text-sm"
              >
                Thử lại
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              {query ? "Không tìm thấy lịch hẹn nào" : "Bạn chưa có lịch hẹn nào"}
            </div>
          ) : (
            filtered.map((a) => (
              <AppointmentCard
                key={a.id}
                appointment={a}
                onViewDetail={() => handleViewDetail(a)}
                onCancel={() => handleOpenCancelModal(a)}
              />
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSubmit={(data) => {
          console.log("Booking data:", data);
        }}
      />

      <AppointmentDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        appointment={selectedAppointment}
        onCancel={handleCancelFromDetail}
      />

      <CancelAppointmentModal
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setSelectedAppointment(null);
        }}
        onConfirm={handleConfirmCancel}
        appointmentTitle={selectedAppointment?.title}
      />
    </div>
  );
};

export default MyAppointmentsPage;

/* ----- Card từng lịch hẹn ----- */

interface AppointmentCardProps {
  appointment: AppointmentDto;
  onViewDetail: () => void;
  onCancel: () => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onViewDetail,
  onCancel,
}) => {
  const status = statusMap[appointment.status as AppointmentStatus] || {
    label: appointment.status,
    className: "bg-gray-100 text-gray-600",
  };
  const canCancel = appointment.status === "confirmed" || appointment.status === "pending" || appointment.status === "booked";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-5 py-4 flex gap-4 items-stretch hover:shadow-md transition-shadow">
      {/* Icon lịch bên trái */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-[#E0ECFF] text-[#2563EB] flex items-center justify-center">
          <FiCalendar className="w-5 h-5" />
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {appointment.title}
            </p>
            <p className="text-xs text-slate-500">{appointment.doctor}</p>
          </div>

          <div className="flex items-center gap-4">
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-semibold ${status.className}`}
            >
              {status.label}
            </span>
            <div className="flex gap-4 text-xs">
              <button
                className="text-[#2563EB] hover:underline font-medium"
                onClick={onViewDetail}
              >
                {canCancel ? "Chi tiết" : "Xem chi tiết"}
              </button>

              {canCancel && (
                <button
                  className="text-[#DC2626] hover:underline font-medium"
                  onClick={onCancel}
                >
                  Huỷ lịch
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Thông tin thời gian + ghi chú */}
        <div className="mt-2 flex flex-col gap-1 text-[11px] text-slate-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <FiCalendar className="w-3.5 h-3.5" />
              <span>{appointment.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FiClock className="w-3.5 h-3.5" />
              <span>{appointment.time}</span>
            </div>
          </div>

          {appointment.note && (
            <p className="text-[11px] text-slate-500 line-clamp-1">{appointment.note}</p>
          )}
        </div>
      </div>
    </div>
  );
};
