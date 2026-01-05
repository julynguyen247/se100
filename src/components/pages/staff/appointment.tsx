// src/pages/staff/StaffAppointmentPage.tsx
import React, { useMemo, useState } from "react";
import {
  FiCalendar,
  FiSearch,
  FiPhone,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import NewAppointmentModal from "@/components/staff/NewAppointmentModal";

type AppointmentStatus = "confirmed" | "pending";

type Appointment = {
  id: number;
  name: string;
  status: AppointmentStatus;
  reason: string;
  doctor: string;
  time: string;
  phone: string;
  note?: string;
};

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    status: "confirmed",
    reason: "Khám và tư vấn",
    doctor: "BS. Nguyễn Minh Tuấn",
    time: "08:00",
    phone: "0901234567",
  },
  {
    id: 2,
    name: "Trần Thị Bích",
    status: "pending",
    reason: "Trám răng sâu",
    doctor: "BS. Lê Thị Hương",
    time: "08:30",
    phone: "0912345678",
    note: "Bệnh nhân yêu cầu gọi xác nhận trước 1 ngày",
  },
  {
    id: 3,
    name: "Phạm Minh Chiến",
    status: "confirmed",
    reason: "Nhổ răng khôn",
    doctor: "BS. Nguyễn Minh Tuấn",
    time: "09:00",
    phone: "0923456789",
    note: "Cần chụp X-quang lần trước",
  },
  {
    id: 4,
    name: "Lê Thị Dung",
    status: "confirmed",
    reason: "Tẩy trắng răng",
    doctor: "BS. Trần Văn Đức",
    time: "09:30",
    phone: "0943567890",
  },
  {
    id: 5,
    name: "Hoàng Văn Em",
    status: "pending",
    reason: "Khám răng - tư vấn",
    doctor: "BS. Lê Thị Hương",
    time: "10:00",
    phone: "0945678901",
    note: "Lần đầu đến khám",
  },
];

const StaffAppointmentPage: React.FC = () => {
  const [date, setDate] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | AppointmentStatus>("");
  const [search, setSearch] = useState("");

  const [appointments, setAppointments] =
    useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [openNewModal, setOpenNewModal] = useState(false);

  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      if (statusFilter && a.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !`${a.name} ${a.reason} ${a.doctor} ${a.phone}`
            .toLowerCase()
            .includes(q)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [appointments, statusFilter, search]);

  const renderStatusBadge = (status: AppointmentStatus) => {
    if (status === "confirmed") {
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-600 text-[11px] px-3 py-1 font-medium">
          Đã xác nhận
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-amber-50 text-amber-600 text-[11px] px-3 py-1 font-medium">
        Chờ xác nhận
      </span>
    );
  };

  const handleCreateAppointment = (payload: {
    fullName: string;
    phone: string;
    service: string;
    doctor: string;
    date: string;
    time: string;
    note: string;
  }) => {
    setAppointments((prev) => {
      const lastId = prev.length ? prev[prev.length - 1].id : 0;
      return [
        ...prev,
        {
          id: lastId + 1,
          name: payload.fullName,
          phone: payload.phone,
          reason: payload.service,
          doctor: payload.doctor,
          time: payload.time || "00:00",
          note: payload.note,
          status: "pending",
        },
      ];
    });
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        <div>
          <h1 className="text-sm font-semibold text-slate-900">
            Quản lý lịch hẹn
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Quản lý và xác nhận các lịch hẹn
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex-1 flex flex-col md:flex-row md:items-center gap-3 text-xs">
            <div className="flex-1 min-w-[140px]">
              <label className="block mb-1 text-[11px] text-slate-500">
                Ngày
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex-1 min-w-[140px]">
              <label className="block mb-1 text-[11px] text-slate-500">
                Trạng thái
              </label>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as "" | AppointmentStatus)
                }
                className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="pending">Chờ xác nhận</option>
              </select>
            </div>

            <div className="flex-[2] min-w-[180px]">
              <label className="block mb-1 text-[11px] text-slate-500">
                Tìm kiếm
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tên, SĐT..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="md:ml-3">
            <button
              type="button"
              onClick={() => setOpenNewModal(true)}
              className="inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-xs px-4 py-2 hover:bg-blue-700"
            >
              + Thêm lịch hẹn
            </button>
          </div>
        </div>

        <div className="space-y-3 pb-6">
          {filtered.map((a) => (
            <div
              key={a.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3 gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <FiCalendar className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">
                      {a.name}
                    </p>
                    {renderStatusBadge(a.status)}
                  </div>
                  <p className="text-xs text-slate-600">
                    {a.reason} • <span className="font-medium">{a.doctor}</span>
                  </p>
                  <p className="text-xs text-slate-500 flex flex-wrap gap-3">
                    <span>🕒 {a.time}</span>
                    <span className="inline-flex items-center gap-1">
                      <FiPhone className="w-3 h-3" />
                      {a.phone}
                    </span>
                  </p>
                  {a.note && (
                    <p className="text-[11px] text-slate-400">
                      Ghi chú: {a.note}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {a.status === "confirmed" ? (
                  <>
                    <button
                      type="button"
                      className="rounded-full bg-blue-600 text-white text-xs px-4 py-1.5 hover:bg-blue-700"
                    >
                      Check-in
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-slate-200 text-xs text-slate-600 px-4 py-1.5 bg-white hover:bg-slate-50"
                    >
                      Sửa
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-500 text-white text-xs px-4 py-1.5 hover:bg-emerald-600"
                    >
                      <FiCheck className="w-3 h-3" />
                      Xác nhận
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 text-xs text-slate-600 px-4 py-1.5 bg-white hover:bg-slate-50"
                    >
                      <FiPhone className="w-3 h-3" />
                      Gọi điện
                    </button>
                  </>
                )}

                <button
                  type="button"
                  className="text-xs text-red-500 hover:text-red-600 px-2 py-1"
                >
                  Hủy
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="text-xs text-slate-400 text-center pt-4">
              Không có lịch hẹn nào phù hợp.
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            Hiển thị 1–{filtered.length} trên {appointments.length} lịch hẹn
          </span>
          <div className="flex items-center gap-2">
            <button className="p-1 rounded-full hover:bg-slate-100">
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <span>Page 1 of 1</span>
            <button className="p-1 rounded-full hover:bg-slate-100">
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <NewAppointmentModal
        open={openNewModal}
        onClose={() => setOpenNewModal(false)}
        onCreate={handleCreateAppointment}
      />
    </>
  );
};

export default StaffAppointmentPage;
