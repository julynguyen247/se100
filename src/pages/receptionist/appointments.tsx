import React, { useState } from "react";
import {
    FiSearch,
    FiPlus,
    FiCalendar,
    FiClock,
    FiX,
    FiList,
    FiGrid,
    FiPhone,
    FiChevronDown,
} from "react-icons/fi";

type AppointmentStatus = "confirmed" | "pending" | "checked-in" | "cancelled";
type ViewMode = "list" | "calendar";

type Appointment = {
    id: number;
    patientName: string;
    phone: string;
    service: string;
    doctor: string;
    date: string;
    time: string;
    duration: number;
    status: AppointmentStatus;
    notes: string;
};

const DOCTORS = ["BS. Nguyễn Minh Tuấn", "BS. Lê Thị Hương", "BS. Trần Văn Đức"];

const SERVICES = [
    { name: "Khám và tư vấn", duration: 30 },
    { name: "Trám răng", duration: 45 },
    { name: "Nhổ răng", duration: 60 },
    { name: "Tẩy trắng răng", duration: 90 },
    { name: "Niềng răng - Tư vấn", duration: 45 },
    { name: "Bọc răng sứ", duration: 60 },
];

const TIME_SLOTS = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
];

const INITIAL_APPOINTMENTS: Appointment[] = [
    { id: 1, patientName: "Nguyễn Văn An", phone: "0901234567", service: "Khám và tư vấn", doctor: "BS. Nguyễn Minh Tuấn", date: "2025-01-06", time: "08:00", duration: 30, status: "confirmed", notes: "" },
    { id: 2, patientName: "Trần Thị Bích", phone: "0912345678", service: "Trám răng", doctor: "BS. Lê Thị Hương", date: "2025-01-06", time: "08:30", duration: 45, status: "pending", notes: "Gọi xác nhận trước 1 ngày" },
    { id: 3, patientName: "Phạm Minh Chiến", phone: "0923456789", service: "Nhổ răng khôn", doctor: "BS. Nguyễn Minh Tuấn", date: "2025-01-06", time: "09:00", duration: 60, status: "checked-in", notes: "" },
    { id: 4, patientName: "Lê Thị Dung", phone: "0934567890", service: "Tẩy trắng răng", doctor: "BS. Trần Văn Đức", date: "2025-01-06", time: "09:30", duration: 90, status: "confirmed", notes: "" },
    { id: 5, patientName: "Hoàng Văn Em", phone: "0945678901", service: "Niềng răng - Tư vấn", doctor: "BS. Lê Thị Hương", date: "2025-01-06", time: "10:00", duration: 45, status: "pending", notes: "Lần đầu đến khám" },
    { id: 6, patientName: "Vũ Thị Phượng", phone: "0956789012", service: "Bọc răng sứ", doctor: "BS. Nguyễn Minh Tuấn", date: "2025-01-06", time: "14:00", duration: 60, status: "confirmed", notes: "" },
    { id: 7, patientName: "Đỗ Minh Giang", phone: "0967890123", service: "Khám và tư vấn", doctor: "BS. Trần Văn Đức", date: "2025-01-06", time: "15:00", duration: 30, status: "cancelled", notes: "Bệnh nhân báo hủy" },
];

const statusConfig: Record<AppointmentStatus, { label: string; bg: string; text: string }> = {
    confirmed: { label: "Đã xác nhận", bg: "bg-emerald-100", text: "text-emerald-700" },
    pending: { label: "Chờ xác nhận", bg: "bg-amber-100", text: "text-amber-700" },
    "checked-in": { label: "Đã check-in", bg: "bg-blue-100", text: "text-blue-700" },
    cancelled: { label: "Đã hủy", bg: "bg-red-100", text: "text-red-700" },
};

const ReceptionistAppointments: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
    const [viewMode, setViewMode] = useState<ViewMode>("list");
    const [search, setSearch] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [doctorFilter, setDoctorFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showModal, setShowModal] = useState(false);

    // New appointment form
    const [newAppointment, setNewAppointment] = useState({
        patientName: "",
        phone: "",
        service: SERVICES[0].name,
        doctor: DOCTORS[0],
        date: selectedDate,
        time: TIME_SLOTS[0],
        notes: "",
    });

    const filtered = appointments.filter((apt) => {
        const matchSearch =
            apt.patientName.toLowerCase().includes(search.toLowerCase()) ||
            apt.phone.includes(search);
        const matchDate = apt.date === selectedDate;
        const matchDoctor = doctorFilter === "all" || apt.doctor === doctorFilter;
        const matchStatus = statusFilter === "all" || apt.status === statusFilter;
        return matchSearch && matchDate && matchDoctor && matchStatus;
    });

    const handleCreateAppointment = () => {
        if (!newAppointment.patientName || !newAppointment.phone) {
            alert("Vui lòng nhập đầy đủ thông tin bệnh nhân!");
            return;
        }

        const service = SERVICES.find((s) => s.name === newAppointment.service);
        const apt: Appointment = {
            id: Date.now(),
            patientName: newAppointment.patientName,
            phone: newAppointment.phone,
            service: newAppointment.service,
            doctor: newAppointment.doctor,
            date: newAppointment.date,
            time: newAppointment.time,
            duration: service?.duration || 30,
            status: "confirmed",
            notes: newAppointment.notes,
        };

        setAppointments([...appointments, apt]);
        setShowModal(false);
        setNewAppointment({
            patientName: "",
            phone: "",
            service: SERVICES[0].name,
            doctor: DOCTORS[0],
            date: selectedDate,
            time: TIME_SLOTS[0],
            notes: "",
        });
        alert("Tạo lịch hẹn thành công!");
    };

    const getAppointmentForSlot = (doctor: string, time: string) => {
        return appointments.find(
            (apt) =>
                apt.doctor === doctor &&
                apt.date === selectedDate &&
                apt.time === time &&
                apt.status !== "cancelled"
        );
    };

    return (
        <div className="px-6 py-8 lg:px-10">
            <div className="max-w-[1400px] mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <span className="inline-flex items-center rounded-full bg-[#E0ECFF] text-[#2563EB] text-[11px] font-semibold px-4 py-1.5 tracking-wide uppercase mb-3">
                            APPOINTMENT MANAGEMENT
                        </span>
                        <h1 className="text-xl font-semibold text-slate-900">Quản lý lịch hẹn</h1>
                        <p className="text-sm text-slate-500 mt-1">Theo dõi và quản lý các lịch hẹn khám</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-5 py-3 bg-[#2563EB] text-white text-sm font-semibold rounded-xl hover:bg-[#1D4ED8] shadow-lg shadow-blue-500/25 transition hover:scale-105"
                    >
                        <FiPlus className="w-4 h-4" />
                        Tạo lịch hẹn
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                    <div className="grid md:grid-cols-5 gap-4">
                        {/* Date */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-600">Ngày</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#2563EB] outline-none"
                            />
                        </div>

                        {/* Doctor */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-600">Bác sĩ</label>
                            <div className="relative">
                                <select
                                    value={doctorFilter}
                                    onChange={(e) => setDoctorFilter(e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#2563EB] outline-none appearance-none bg-white"
                                >
                                    <option value="all">Tất cả bác sĩ</option>
                                    {DOCTORS.map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Status */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-600">Trạng thái</label>
                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#2563EB] outline-none appearance-none bg-white"
                                >
                                    <option value="all">Tất cả</option>
                                    <option value="confirmed">Đã xác nhận</option>
                                    <option value="pending">Chờ xác nhận</option>
                                    <option value="checked-in">Đã check-in</option>
                                    <option value="cancelled">Đã hủy</option>
                                </select>
                                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Search */}
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-medium text-slate-600">Tìm kiếm</label>
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Tên bệnh nhân, số điện thoại..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#2563EB] outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* View Toggle */}
                    <div className="flex justify-end">
                        <div className="inline-flex p-1 bg-slate-100 rounded-xl gap-1">
                            <button
                                onClick={() => setViewMode("list")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${viewMode === "list"
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                <FiList className="w-4 h-4" />
                                Danh sách
                            </button>
                            <button
                                onClick={() => setViewMode("calendar")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${viewMode === "calendar"
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                <FiGrid className="w-4 h-4" />
                                Lịch tuần
                            </button>
                        </div>
                    </div>
                </div>

                {/* List View */}
                {viewMode === "list" && (
                    <div className="space-y-3">
                        {filtered.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                                <FiCalendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-sm font-semibold text-slate-900 mb-1">Không có lịch hẹn</h3>
                                <p className="text-xs text-slate-500">Không tìm thấy lịch hẹn nào phù hợp</p>
                            </div>
                        ) : (
                            filtered.map((apt) => {
                                const status = statusConfig[apt.status];
                                return (
                                    <div
                                        key={apt.id}
                                        className="bg-white rounded-2xl shadow-sm p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:shadow-md transition"
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Time Badge */}
                                            <div className="w-14 h-14 bg-blue-50 rounded-xl flex flex-col items-center justify-center">
                                                <span className="text-[10px] font-semibold text-blue-600 uppercase">
                                                    {apt.time.split(":")[0]}h
                                                </span>
                                                <span className="text-lg font-bold text-blue-900">
                                                    {apt.time.split(":")[1]}
                                                </span>
                                            </div>

                                            {/* Info */}
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="text-sm font-semibold text-slate-900">{apt.patientName}</h3>
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${status.bg} ${status.text}`}>
                                                        {status.label}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-600 mt-1">{apt.service} • {apt.doctor}</p>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg">
                                                        <FiClock className="w-3 h-3" />
                                                        {apt.duration} phút
                                                    </div>
                                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg">
                                                        <FiPhone className="w-3 h-3" />
                                                        {apt.phone}
                                                    </div>
                                                </div>
                                                {apt.notes && (
                                                    <p className="text-xs text-slate-500 mt-2 italic bg-slate-50 px-3 py-2 rounded-lg">
                                                        {apt.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 flex-wrap">
                                            {apt.status === "pending" && (
                                                <>
                                                    <button className="px-4 py-2 bg-emerald-500 text-white text-xs font-medium rounded-lg hover:bg-emerald-600">
                                                        Xác nhận
                                                    </button>
                                                    <button className="px-4 py-2 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600">
                                                        Gọi điện
                                                    </button>
                                                </>
                                            )}
                                            {apt.status === "confirmed" && (
                                                <button className="px-4 py-2 bg-[#2563EB] text-white text-xs font-medium rounded-lg hover:bg-[#1D4ED8]">
                                                    Check-in
                                                </button>
                                            )}
                                            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50">
                                                Sửa
                                            </button>
                                            {apt.status !== "cancelled" && (
                                                <button className="px-4 py-2 text-red-600 text-xs font-medium rounded-lg hover:bg-red-50">
                                                    Hủy
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {/* Calendar View */}
                {viewMode === "calendar" && (
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-max">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="text-left text-xs font-semibold text-slate-600 py-4 px-4 w-20 sticky left-0 bg-slate-50">
                                            Giờ
                                        </th>
                                        {DOCTORS.map((doctor) => (
                                            <th
                                                key={doctor}
                                                className="text-center text-xs font-semibold text-slate-600 py-4 px-4 min-w-[180px]"
                                            >
                                                {doctor}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {TIME_SLOTS.map((time) => (
                                        <tr key={time} className="border-b border-slate-50 hover:bg-slate-50/50">
                                            <td className="py-2 px-4 text-xs font-semibold text-slate-600 sticky left-0 bg-white">
                                                {time}
                                            </td>
                                            {DOCTORS.map((doctor) => {
                                                const apt = getAppointmentForSlot(doctor, time);
                                                return (
                                                    <td key={`${doctor}-${time}`} className="p-2">
                                                        {apt ? (
                                                            <div
                                                                className={`p-3 rounded-xl cursor-pointer transition hover:scale-105 ${statusConfig[apt.status].bg
                                                                    }`}
                                                            >
                                                                <p className="text-xs font-semibold text-slate-900 truncate">
                                                                    {apt.patientName}
                                                                </p>
                                                                <p className="text-[10px] text-slate-600 truncate">{apt.service}</p>
                                                                <div className="flex items-center gap-1 mt-1">
                                                                    <FiClock className="w-3 h-3 text-slate-500" />
                                                                    <span className="text-[10px] text-slate-500">{apt.duration}p</span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="p-3 rounded-xl border-2 border-dashed border-slate-200 text-center text-slate-400 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition">
                                                                <span className="text-[10px]">Trống</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Appointment Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]">
                            <h2 className="text-lg font-semibold text-white">Tạo lịch hẹn mới</h2>
                            <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-white/20 rounded-lg">
                                <FiX className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-5">
                            {/* Patient Name */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-700">
                                    Họ tên bệnh nhân <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nhập họ tên..."
                                    value={newAppointment.patientName}
                                    onChange={(e) => setNewAppointment({ ...newAppointment, patientName: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-[#2563EB] focus:bg-white outline-none"
                                />
                            </div>

                            {/* Phone */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-700">
                                    Số điện thoại <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    placeholder="VD: 0901234567"
                                    value={newAppointment.phone}
                                    onChange={(e) => setNewAppointment({ ...newAppointment, phone: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-[#2563EB] focus:bg-white outline-none"
                                />
                            </div>

                            {/* Service */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-700">Dịch vụ</label>
                                <select
                                    value={newAppointment.service}
                                    onChange={(e) => setNewAppointment({ ...newAppointment, service: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-[#2563EB] focus:bg-white outline-none appearance-none"
                                >
                                    {SERVICES.map((s) => (
                                        <option key={s.name} value={s.name}>
                                            {s.name} ({s.duration} phút)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Doctor */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-700">Bác sĩ</label>
                                <select
                                    value={newAppointment.doctor}
                                    onChange={(e) => setNewAppointment({ ...newAppointment, doctor: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-[#2563EB] focus:bg-white outline-none appearance-none"
                                >
                                    {DOCTORS.map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Date & Time */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-700">Ngày</label>
                                    <input
                                        type="date"
                                        value={newAppointment.date}
                                        onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-[#2563EB] focus:bg-white outline-none"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-700">Giờ</label>
                                    <select
                                        value={newAppointment.time}
                                        onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-[#2563EB] focus:bg-white outline-none appearance-none"
                                    >
                                        {TIME_SLOTS.map((t) => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-700">Ghi chú</label>
                                <textarea
                                    rows={2}
                                    placeholder="Ghi chú thêm..."
                                    value={newAppointment.notes}
                                    onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-[#2563EB] focus:bg-white outline-none resize-none"
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t bg-slate-50 flex gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-100"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleCreateAppointment}
                                className="flex-1 py-3 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1D4ED8]"
                            >
                                Tạo lịch hẹn
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReceptionistAppointments;
