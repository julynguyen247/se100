import React, { useState } from "react";
import { FiCalendar, FiClock, FiSearch, FiPlus } from "react-icons/fi";
import BookingModal from "../../patient/BookingModal";
import AppointmentDetailModal from "../../patient/AppointmentDetailModal";
import CancelAppointmentModal from "../../patient/CancelAppointmentModal";

type AppointmentStatus = "confirmed" | "pending" | "completed" | "cancelled";

type Appointment = {
  id: number;
  title: string;
  doctor: string;
  date: string;
  time: string;
  note: string;
  status: AppointmentStatus;
};

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 1,
    title: "Khám định kỳ",
    doctor: "BS. Nguyễn Văn A",
    date: "28/12/2024",
    time: "10:00",
    note: "Kiểm tra tình trạng răng miệng định kỳ",
    status: "confirmed",
  },
  {
    id: 2,
    title: "Tẩy trắng răng",
    doctor: "BS. Trần Thị B",
    date: "5/1/2025",
    time: "14:00",
    note: "",
    status: "pending",
  },
  {
    id: 3,
    title: "Trám răng",
    doctor: "BS. Lê Văn C",
    date: "10/12/2024",
    time: "09:30",
    note: "Đã trám răng hàm số 6",
    status: "completed",
  },
  {
    id: 4,
    title: "Khám tổng quát",
    doctor: "BS. Nguyễn Văn A",
    date: "22/11/2024",
    time: "15:00",
    note: "",
    status: "completed",
  },
  {
    id: 5,
    title: "Tư vấn niềng răng",
    doctor: "BS. Trần Thị B",
    date: "5/11/2024",
    time: "11:00",
    note: "Bệnh nhân huỷ lịch",
    status: "cancelled",
  },
];

const statusMap: Record<
  AppointmentStatus,
  { label: string; className: string }
> = {
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
};

const MyAppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [query, setQuery] = useState("");

  const filtered = appointments.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleViewDetail = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailModalOpen(true);
  };

  const handleOpenCancelModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsCancelModalOpen(true);
  };

  const handleCancelFromDetail = (id: number) => {
    const apt = appointments.find((a) => a.id === id);
    if (apt) {
      setIsDetailModalOpen(false);
      setTimeout(() => {
        setSelectedAppointment(apt);
        setIsCancelModalOpen(true);
      }, 200);
    }
  };

  const handleConfirmCancel = (reason: string) => {
    if (selectedAppointment) {
      console.log("Cancelled appointment:", selectedAppointment.id, "Reason:", reason);
      // Update appointment status to cancelled
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
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              Không tìm thấy lịch hẹn nào
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
  appointment: Appointment;
  onViewDetail: () => void;
  onCancel: () => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onViewDetail,
  onCancel,
}) => {
  const status = statusMap[appointment.status];
  const canCancel = appointment.status === "confirmed" || appointment.status === "pending";

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
