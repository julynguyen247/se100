import React, { useEffect, useMemo, useState } from "react";
import {
    FiSearch,
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiRefreshCw,
    FiAlertCircle,
    FiClock,
    FiX,
} from "react-icons/fi";
import {
    getDoctors,
    getAdminClinics,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    getDoctorTimeOffs,
    createDoctorTimeOff,
    updateDoctorTimeOff,
    deleteDoctorTimeOff,
    type DoctorItem,
    type AdminClinicOption,
    type CreateDoctorRequest,
    type UpdateDoctorRequest,
    type DoctorTimeOffItem,
    type CreateDoctorTimeOffRequest,
    type UpdateDoctorTimeOffRequest,
} from "@/services/apiAdmin";

type ActiveFilter = "ALL" | "true" | "false";

type DoctorFormState = {
    clinicId: string;
    code: string;
    fullName: string;
    specialty: string;
    phone: string;
    email: string;
};

type TimeOffFormState = {
    clinicId: string;
    doctorId: string;
    startAt: string;
    endAt: string;
    reason: string;
};

const initialDoctorForm: DoctorFormState = {
    clinicId: "",
    code: "",
    fullName: "",
    specialty: "",
    phone: "",
    email: "",
};

const initialTimeOffForm: TimeOffFormState = {
    clinicId: "",
    doctorId: "",
    startAt: "",
    endAt: "",
    reason: "",
};

const DoctorManagementPage: React.FC = () => {
    const [query, setQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<ActiveFilter>("ALL");
    const [clinicFilter, setClinicFilter] = useState<string>("ALL");

    const [doctors, setDoctors] = useState<DoctorItem[]>([]);
    const [clinics, setClinics] = useState<AdminClinicOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Doctor modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [addForm, setAddForm] = useState<DoctorFormState>(initialDoctorForm);
    const [addSubmitting, setAddSubmitting] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState<DoctorFormState>(initialDoctorForm);
    const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);
    const [editSubmitting, setEditSubmitting] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);

    // Time-off modals
    const [showTimeOffModal, setShowTimeOffModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<DoctorItem | null>(null);
    const [timeOffs, setTimeOffs] = useState<DoctorTimeOffItem[]>([]);
    const [loadingTimeOffs, setLoadingTimeOffs] = useState(false);

    const [showTimeOffFormModal, setShowTimeOffFormModal] = useState(false);
    const [timeOffForm, setTimeOffForm] = useState<TimeOffFormState>(initialTimeOffForm);
    const [timeOffSubmitting, setTimeOffSubmitting] = useState(false);
    const [timeOffError, setTimeOffError] = useState<string | null>(null);
    const [editingTimeOffId, setEditingTimeOffId] = useState<string | null>(null);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [doctorsRes, clinicsRes] = await Promise.all([
                getDoctors(),
                getAdminClinics(),
            ]);

            setDoctors(doctorsRes);
            setClinics(clinicsRes);
        } catch (err) {
            console.error("Failed to load doctors:", err);
            setError(
                err instanceof Error ? err.message : "Không thể tải danh sách bác sĩ"
            );
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredDoctors = useMemo(
        () =>
            doctors.filter((d) => {
                const matchText =
                    d.fullName.toLowerCase().includes(query.toLowerCase()) ||
                    d.code.toLowerCase().includes(query.toLowerCase()) ||
                    d.specialty?.toLowerCase().includes(query.toLowerCase()) ||
                    d.email?.toLowerCase().includes(query.toLowerCase());

                const matchActive =
                    activeFilter === "ALL" || d.isActive.toString() === activeFilter;

                const matchClinic =
                    clinicFilter === "ALL" || d.clinicId === clinicFilter;

                return matchText && matchActive && matchClinic;
            }),
        [doctors, query, activeFilter, clinicFilter]
    );

    const handleAdd = () => {
        setAddForm(initialDoctorForm);
        setAddError(null);
        setShowAddModal(true);
    };

    const handleEdit = (doctor: DoctorItem) => {
        setEditingDoctorId(doctor.doctorId);
        setEditForm({
            clinicId: doctor.clinicId,
            code: doctor.code,
            fullName: doctor.fullName,
            specialty: doctor.specialty || "",
            phone: doctor.phone || "",
            email: doctor.email || "",
        });
        setEditError(null);
        setShowEditModal(true);
    };

    const handleDelete = async (doctor: DoctorItem) => {
        const confirmed = window.confirm(
            `Bạn có chắc chắn muốn xóa bác sĩ "${doctor.fullName}"?`
        );
        if (!confirmed) return;

        try {
            const res = await deleteDoctor(doctor.doctorId);
            if (!res.isSuccess) {
                throw new Error(res.message || "Không thể xóa bác sĩ");
            }
            await loadData();
        } catch (err) {
            console.error("Failed to delete doctor:", err);
            alert(err instanceof Error ? err.message : "Không thể xóa bác sĩ");
        }
    };

    const handleSubmitAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddError(null);

        if (!addForm.clinicId || !addForm.code || !addForm.fullName) {
            setAddError("Vui lòng điền đầy đủ thông tin bắt buộc.");
            return;
        }

        try {
            setAddSubmitting(true);
            const payload: CreateDoctorRequest = {
                clinicId: addForm.clinicId,
                code: addForm.code,
                fullName: addForm.fullName,
                specialty: addForm.specialty || undefined,
                phone: addForm.phone || undefined,
                email: addForm.email || undefined,
            };

            const res = await createDoctor(payload);
            if (!res.isSuccess) {
                throw new Error(res.message || "Không thể tạo bác sĩ");
            }

            setShowAddModal(false);
            await loadData();
        } catch (err) {
            console.error("Failed to create doctor:", err);
            setAddError(err instanceof Error ? err.message : "Không thể tạo bác sĩ");
        } finally {
            setAddSubmitting(false);
        }
    };

    const handleSubmitEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEditError(null);

        if (
            !editingDoctorId ||
            !editForm.clinicId ||
            !editForm.code ||
            !editForm.fullName
        ) {
            setEditError("Vui lòng điền đầy đủ thông tin bắt buộc.");
            return;
        }

        try {
            setEditSubmitting(true);
            const payload: UpdateDoctorRequest = {
                cLinicId: editForm.clinicId, // Note: Backend has typo
                code: editForm.code,
                fullName: editForm.fullName,
                specialty: editForm.specialty || undefined,
                phone: editForm.phone || undefined,
                email: editForm.email || undefined,
            };

            const res = await updateDoctor(editingDoctorId, payload);
            if (!res.isSuccess) {
                throw new Error(res.message || "Không thể cập nhật bác sĩ");
            }

            setShowEditModal(false);
            setEditingDoctorId(null);
            await loadData();
        } catch (err) {
            console.error("Failed to update doctor:", err);
            setEditError(
                err instanceof Error ? err.message : "Không thể cập nhật bác sĩ"
            );
        } finally {
            setEditSubmitting(false);
        }
    };

    // Time-off management
    const handleManageTimeOff = async (doctor: DoctorItem) => {
        setSelectedDoctor(doctor);
        setShowTimeOffModal(true);
        setLoadingTimeOffs(true);

        try {
            const timeOffsRes = await getDoctorTimeOffs(doctor.doctorId);
            setTimeOffs(timeOffsRes);
        } catch (err) {
            console.error("Failed to load time-offs:", err);
            setTimeOffs([]);
        } finally {
            setLoadingTimeOffs(false);
        }
    };

    const handleAddTimeOff = () => {
        if (!selectedDoctor) return;
        setEditingTimeOffId(null);
        setTimeOffForm({
            clinicId: selectedDoctor.clinicId,
            doctorId: selectedDoctor.doctorId,
            startAt: "",
            endAt: "",
            reason: "",
        });
        setTimeOffError(null);
        setShowTimeOffFormModal(true);
    };

    const handleEditTimeOff = (timeOff: DoctorTimeOffItem) => {
        setEditingTimeOffId(timeOff.timeOffId);
        setTimeOffForm({
            clinicId: timeOff.clinicId,
            doctorId: timeOff.doctorId,
            startAt: timeOff.startAt.slice(0, 16), // YYYY-MM-DDTHH:MM
            endAt: timeOff.endAt.slice(0, 16),
            reason: timeOff.reason || "",
        });
        setTimeOffError(null);
        setShowTimeOffFormModal(true);
    };

    const handleDeleteTimeOff = async (timeOffId: string) => {
        const confirmed = window.confirm(
            "Bạn có chắc chắn muốn xóa lịch nghỉ này?"
        );
        if (!confirmed) return;

        try {
            const res = await deleteDoctorTimeOff(timeOffId);
            if (!res.isSuccess) {
                throw new Error(res.message || "Không thể xóa lịch nghỉ");
            }
            if (selectedDoctor) {
                const timeOffsRes = await getDoctorTimeOffs(selectedDoctor.doctorId);
                setTimeOffs(timeOffsRes);
            }
        } catch (err) {
            console.error("Failed to delete time-off:", err);
            alert(err instanceof Error ? err.message : "Không thể xóa lịch nghỉ");
        }
    };

    const handleSubmitTimeOff = async (e: React.FormEvent) => {
        e.preventDefault();
        setTimeOffError(null);

        if (!timeOffForm.startAt || !timeOffForm.endAt) {
            setTimeOffError("Vui lòng chọn thời gian bắt đầu và kết thúc.");
            return;
        }

        try {
            setTimeOffSubmitting(true);
            const payload: CreateDoctorTimeOffRequest | UpdateDoctorTimeOffRequest = {
                clinicId: timeOffForm.clinicId,
                doctorId: timeOffForm.doctorId,
                startAt: new Date(timeOffForm.startAt).toISOString(),
                endAt: new Date(timeOffForm.endAt).toISOString(),
                reason: timeOffForm.reason || undefined,
            };

            let res;
            if (editingTimeOffId) {
                res = await updateDoctorTimeOff(editingTimeOffId, payload);
            } else {
                res = await createDoctorTimeOff(payload);
            }

            if (!res.isSuccess) {
                throw new Error(res.message || "Không thể lưu lịch nghỉ");
            }

            setShowTimeOffFormModal(false);
            if (selectedDoctor) {
                const timeOffsRes = await getDoctorTimeOffs(selectedDoctor.doctorId);
                setTimeOffs(timeOffsRes);
            }
        } catch (err) {
            console.error("Failed to save time-off:", err);
            setTimeOffError(
                err instanceof Error ? err.message : "Không thể lưu lịch nghỉ"
            );
        } finally {
            setTimeOffSubmitting(false);
        }
    };

    const formatDateTime = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleString("vi-VN");
        } catch {
            return "—";
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#F5F7FB] px-6 py-8 sm:px-10 lg:px-16">
            <div className="max-w-6xl mx-auto space-y-5">
                {/* Header */}
                <div>
                    <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
                        Quản lý bác sĩ
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Quản lý thông tin bác sĩ, chuyên khoa và lịch nghỉ phép
                    </p>
                </div>

                {/* Search + filter + add */}
                <div className="bg-white rounded-t-2xl px-5 pt-4 pb-3 border border-b-0 border-slate-100">
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên, mã, chuyên khoa..."
                                className="w-full rounded-lg border border-slate-200 bg-[#F9FAFB] pl-9 pr-3 py-2.5 text-sm outline-none focus:border-[#2563EB]"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>

                        {/* Clinic filter */}
                        <select
                            className="w-full md:w-44 rounded-lg border border-slate-200 bg-[#F9FAFB] px-3 py-2.5 text-sm outline-none focus:border-[#2563EB]"
                            value={clinicFilter}
                            onChange={(e) => setClinicFilter(e.target.value)}
                        >
                            <option value="ALL">Tất cả phòng khám</option>
                            {clinics.map((c) => (
                                <option key={c.clinicId} value={c.clinicId}>
                                    {c.name}
                                </option>
                            ))}
                        </select>

                        {/* Active filter */}
                        <select
                            className="w-full md:w-40 rounded-lg border border-slate-200 bg-[#F9FAFB] px-3 py-2.5 text-sm outline-none focus:border-[#2563EB]"
                            value={activeFilter}
                            onChange={(e) => setActiveFilter(e.target.value as ActiveFilter)}
                        >
                            <option value="ALL">Tất cả trạng thái</option>
                            <option value="true">Hoạt động</option>
                            <option value="false">Không hoạt động</option>
                        </select>

                        {/* Add + refresh buttons */}
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleAdd}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#EF4444] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#DC2626]"
                            >
                                <FiPlus className="w-4 h-4" />
                                <span>Thêm</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsRefreshing(true);
                                    loadData();
                                }}
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                            >
                                <FiRefreshCw
                                    className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""
                                        }`}
                                />
                                <span>Làm mới</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error block */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-3">
                        <FiAlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-red-900">
                                Không tải được danh sách bác sĩ
                            </p>
                            <p className="text-xs text-red-700 mt-1">{error}</p>
                        </div>
                        <button
                            type="button"
                            onClick={loadData}
                            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                        >
                            <FiRefreshCw className="w-3.5 h-3.5" />
                            Thử lại
                        </button>
                    </div>
                )}

                {/* Count display */}
                {!loading && !error && (
                    <div className="bg-white border-x border-slate-100 px-5 py-2">
                        <p className="text-xs text-slate-600">
                            Hiển thị <span className="font-semibold text-slate-900">{filteredDoctors.length}</span> / {doctors.length} bác sĩ
                        </p>
                    </div>
                )}

                {/* Table */}
                <div className="bg-white rounded-b-2xl border border-t-0 border-slate-100 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-[#F9FAFB] text-xs text-slate-500">
                                <th className="text-center font-medium px-3 py-3 w-16">STT</th>
                                <th className="text-left font-medium px-5 py-3">Mã BS</th>
                                <th className="text-left font-medium px-5 py-3">Họ tên</th>
                                <th className="text-left font-medium px-5 py-3">Chuyên khoa</th>
                                <th className="text-left font-medium px-5 py-3">Điện thoại</th>
                                <th className="text-left font-medium px-5 py-3">Email</th>
                                <th className="text-left font-medium px-5 py-3">Trạng thái</th>
                                <th className="text-center font-medium px-5 py-3">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading
                                ? Array.from({ length: 5 }).map((_, idx) => (
                                    <tr key={idx} className="border-t border-slate-100">
                                        <td className="px-3 py-3 text-center text-slate-400">
                                            <div className="h-4 w-8 bg-slate-200 rounded animate-pulse mx-auto" />
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="h-4 w-36 bg-slate-200 rounded animate-pulse" />
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="h-4 w-24 bg-slate-200 rounded animate-pulse mx-auto" />
                                        </td>
                                    </tr>
                                ))
                                : filteredDoctors.map((doctor, idx) => (
                                    <tr
                                        key={doctor.doctorId}
                                        className={`border-t border-slate-100 ${idx % 2 === 1 ? "bg-[#FCFCFD]" : "bg-white"
                                            }`}
                                    >
                                        <td className="px-3 py-3 text-center text-slate-500 font-medium">
                                            {idx + 1}
                                        </td>
                                        <td className="px-5 py-3 text-slate-800 font-medium">
                                            {doctor.code}
                                        </td>
                                        <td className="px-5 py-3 text-slate-800">
                                            {doctor.fullName}
                                        </td>
                                        <td className="px-5 py-3 text-slate-600">
                                            {doctor.specialty || "—"}
                                        </td>
                                        <td className="px-5 py-3 text-slate-600">
                                            {doctor.phone || "—"}
                                        </td>
                                        <td className="px-5 py-3 text-slate-600">
                                            {doctor.email || "—"}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span
                                                className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${doctor.isActive
                                                    ? "bg-[#DCFCE7] text-[#15803D]"
                                                    : "bg-[#F3F4F6] text-[#4B5563]"
                                                    }`}
                                            >
                                                {doctor.isActive ? "Hoạt động" : "Không hoạt động"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center justify-center gap-3 text-[15px]">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEdit(doctor)}
                                                    className="text-[#2563EB] hover:text-[#1D4ED8]"
                                                    title="Chỉnh sửa"
                                                >
                                                    <FiEdit2 />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleManageTimeOff(doctor)}
                                                    className="text-[#059669] hover:text-[#047857]"
                                                    title="Quản lý lịch nghỉ"
                                                >
                                                    <FiClock />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(doctor)}
                                                    className="text-[#EF4444] hover:text-[#DC2626]"
                                                    title="Xóa"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                            {!loading && filteredDoctors.length === 0 && !error && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-5 py-6 text-center text-sm text-slate-400"
                                    >
                                        Không tìm thấy bác sĩ phù hợp.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Add Doctor Modal */}
                {showAddModal && (
                    <DoctorFormModal
                        title="Thêm bác sĩ"
                        clinics={clinics}
                        form={addForm}
                        setForm={setAddForm}
                        error={addError}
                        submitting={addSubmitting}
                        onSubmit={handleSubmitAdd}
                        onClose={() => setShowAddModal(false)}
                    />
                )}

                {/* Edit Doctor Modal */}
                {showEditModal && (
                    <DoctorFormModal
                        title="Sửa bác sĩ"
                        clinics={clinics}
                        form={editForm}
                        setForm={setEditForm}
                        error={editError}
                        submitting={editSubmitting}
                        onSubmit={handleSubmitEdit}
                        onClose={() => {
                            setShowEditModal(false);
                            setEditingDoctorId(null);
                        }}
                    />
                )}

                {/* Time-Off Management Modal */}
                {showTimeOffModal && selectedDoctor && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Quản lý lịch nghỉ - {selectedDoctor.fullName}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowTimeOffModal(false);
                                        setSelectedDoctor(null);
                                    }}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mb-4">
                                <button
                                    type="button"
                                    onClick={handleAddTimeOff}
                                    className="inline-flex items-center gap-2 rounded-lg bg-[#059669] px-4 py-2 text-sm font-semibold text-white hover:bg-[#047857]"
                                >
                                    <FiPlus className="w-4 h-4" />
                                    Thêm lịch nghỉ
                                </button>
                            </div>

                            {loadingTimeOffs ? (
                                <div className="text-center py-8 text-slate-500">
                                    Đang tải...
                                </div>
                            ) : timeOffs.length === 0 ? (
                                <div className="text-center py-8 text-slate-400">
                                    Chưa có lịch nghỉ nào.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {timeOffs.map((timeOff) => (
                                        <div
                                            key={timeOff.timeOffId}
                                            className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-4 text-sm">
                                                        <div>
                                                            <span className="text-slate-500">Từ:</span>{" "}
                                                            <span className="font-medium text-slate-800">
                                                                {formatDateTime(timeOff.startAt)}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-500">Đến:</span>{" "}
                                                            <span className="font-medium text-slate-800">
                                                                {formatDateTime(timeOff.endAt)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {timeOff.reason && (
                                                        <p className="text-sm text-slate-600 mt-2">
                                                            <span className="font-medium">Lý do:</span>{" "}
                                                            {timeOff.reason}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex gap-2 ml-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEditTimeOff(timeOff)}
                                                        className="text-[#2563EB] hover:text-[#1D4ED8]"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <FiEdit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteTimeOff(timeOff.timeOffId)}
                                                        className="text-[#EF4444] hover:text-[#DC2626]"
                                                        title="Xóa"
                                                    >
                                                        <FiTrash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Time-Off Form Modal */}
                {showTimeOffFormModal && (
                    <TimeOffFormModal
                        title={editingTimeOffId ? "Sửa lịch nghỉ" : "Thêm lịch nghỉ"}
                        form={timeOffForm}
                        setForm={setTimeOffForm}
                        error={timeOffError}
                        submitting={timeOffSubmitting}
                        onSubmit={handleSubmitTimeOff}
                        onClose={() => {
                            setShowTimeOffFormModal(false);
                            setEditingTimeOffId(null);
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default DoctorManagementPage;

/* ====== Doctor Form Modal Component ====== */

type DoctorFormModalProps = {
    title: string;
    clinics: AdminClinicOption[];
    form: DoctorFormState;
    setForm: React.Dispatch<React.SetStateAction<DoctorFormState>>;
    error: string | null;
    submitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
};

const DoctorFormModal: React.FC<DoctorFormModalProps> = ({
    title,
    clinics,
    form,
    setForm,
    error,
    submitting,
    onSubmit,
    onClose,
}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">{title}</h2>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                Phòng khám *
                            </label>
                            <select
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] bg-white"
                                value={form.clinicId}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, clinicId: e.target.value }))
                                }
                            >
                                <option value="">Chọn phòng khám</option>
                                {clinics.map((c) => (
                                    <option key={c.clinicId} value={c.clinicId}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                Mã bác sĩ *
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] bg-white"
                                value={form.code}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, code: e.target.value }))
                                }
                                placeholder="VD: BS001"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                Họ và tên *
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] bg-white"
                                value={form.fullName}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, fullName: e.target.value }))
                                }
                                placeholder="VD: BS. Nguyễn Văn A"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                Chuyên khoa
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] bg-white"
                                value={form.specialty}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, specialty: e.target.value }))
                                }
                                placeholder="VD: Nha khoa, Tim mạch, Nội khoa..."
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                Số điện thoại
                            </label>
                            <input
                                type="tel"
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] bg-white"
                                value={form.phone}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, phone: e.target.value }))
                                }
                                placeholder="VD: 0912345678"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] bg-white"
                                value={form.email}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, email: e.target.value }))
                                }
                                placeholder="VD: doctor@clinic.com"
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                if (!submitting) onClose();
                            }}
                            className="px-4 py-2.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1D4ED8] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {submitting && (
                                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            )}
                            <span>Lưu</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ====== Time-Off Form Modal Component ====== */

type TimeOffFormModalProps = {
    title: string;
    form: TimeOffFormState;
    setForm: React.Dispatch<React.SetStateAction<TimeOffFormState>>;
    error: string | null;
    submitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
};

const TimeOffFormModal: React.FC<TimeOffFormModalProps> = ({
    title,
    form,
    setForm,
    error,
    submitting,
    onSubmit,
    onClose,
}) => {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">{title}</h2>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                            Thời gian bắt đầu *
                        </label>
                        <input
                            type="datetime-local"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] bg-white"
                            value={form.startAt}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, startAt: e.target.value }))
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                            Thời gian kết thúc *
                        </label>
                        <input
                            type="datetime-local"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] bg-white"
                            value={form.endAt}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, endAt: e.target.value }))
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                            Lý do nghỉ
                        </label>
                        <textarea
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] bg-white"
                            value={form.reason}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, reason: e.target.value }))
                            }
                            placeholder="Lý do nghỉ phép..."
                            rows={3}
                        />
                    </div>

                    {error && (
                        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                if (!submitting) onClose();
                            }}
                            className="px-4 py-2.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1D4ED8] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {submitting && (
                                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            )}
                            <span>Lưu</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
