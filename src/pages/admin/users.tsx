import React, { useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";
import {
  getStaffUsers,
  getStaffRoles,
  getAdminClinics,
  createStaffUser,
  updateStaffUser,
  deleteStaffUser,
  type StaffUserRow,
  type StaffRoleOption,
  type StaffRoleValue,
  type AdminClinicOption,
} from "@/services/apiAdmin";

type RoleFilter = StaffRoleValue | "ALL";

type AddUserFormState = {
  clinicId: string;
  username: string;
  fullName: string;
  role: StaffRoleValue | "";
  isActive: boolean;
};

const initialAddForm: AddUserFormState = {
  clinicId: "",
  username: "",
  fullName: "",
  role: "",
  isActive: true,
};

const UserManagementPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");

  const [users, setUsers] = useState<StaffUserRow[]>([]);
  const [roles, setRoles] = useState<StaffRoleOption[]>([]);
  const [clinics, setClinics] = useState<AdminClinicOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState<AddUserFormState>(initialAddForm);
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<AddUserFormState>(initialAddForm);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [userRes, rolesRes, clinicRes] = await Promise.all([
        getStaffUsers(),
        getStaffRoles(),
        getAdminClinics(),
      ]);

      setUsers(userRes);
      setRoles(rolesRes);
      setClinics(clinicRes);
    } catch (err) {
      console.error("Failed to load staff users:", err);
      setError(
        err instanceof Error ? err.message : "Không thể tải danh sách người dùng"
      );
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredUsers = useMemo(
    () =>
      users.filter((u) => {
        const matchText =
          u.fullName.toLowerCase().includes(query.toLowerCase()) ||
          u.username.toLowerCase().includes(query.toLowerCase()) ||
          u.clinic?.name.toLowerCase().includes(query.toLowerCase());

        const matchRole =
          roleFilter === "ALL" || u.role.toUpperCase() === roleFilter;

        return matchText && matchRole;
      }),
    [users, query, roleFilter]
  );

  const handleAdd = () => {
    setAddForm(initialAddForm);
    setAddError(null);
    setShowAddModal(true);
  };

  const handleEdit = (user: StaffUserRow) => {
    setEditingUserId(user.userId);
    setEditForm({
      clinicId: user.clinicId,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive,
    });
    setEditError(null);
    setShowEditModal(true);
  };

  const handleDelete = async (user: StaffUserRow) => {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa người dùng "${user.fullName || user.username}"?`
    );
    if (!confirmed) return;

    try {
      const res = await deleteStaffUser(user.userId);
      if (!res.isSuccess) {
        throw new Error(res.message || "Không thể xóa người dùng");
      }
      await loadData();
    } catch (err) {
      console.error("Failed to delete staff user:", err);
      alert(
        err instanceof Error ? err.message : "Không thể xóa người dùng"
      );
    }
  };

  const mapRoleToNumber = (role: StaffRoleValue): number => {
    // Theo spec: 1 Receptionist, 2 Doctor, 3 Admin
    switch (role) {
      case "RECEPTIONIST":
        return 1;
      case "DOCTOR":
        return 2;
      case "ADMIN":
        return 3;
      default:
        return 0;
    }
  };

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);

    if (!addForm.clinicId || !addForm.username || !addForm.fullName || !addForm.role) {
      setAddError("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }

    const roleNumber = mapRoleToNumber(addForm.role as StaffRoleValue);
    if (!roleNumber) {
      setAddError("Vai trò không hợp lệ.");
      return;
    }

    try {
      setAddSubmitting(true);
      const res = await createStaffUser({
        clinicId: addForm.clinicId,
        username: addForm.username,
        fullName: addForm.fullName,
        role: roleNumber,
        isActive: addForm.isActive,
      });

      if (!res.isSuccess) {
        throw new Error(res.message || "Không thể tạo người dùng");
      }

      setShowAddModal(false);
      await loadData();
    } catch (err) {
      console.error("Failed to create staff user:", err);
      setAddError(
        err instanceof Error ? err.message : "Không thể tạo người dùng"
      );
    } finally {
      setAddSubmitting(false);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);

    if (
      !editingUserId ||
      !editForm.clinicId ||
      !editForm.username ||
      !editForm.fullName ||
      !editForm.role
    ) {
      setEditError("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }

    try {
      setEditSubmitting(true);
      const res = await updateStaffUser(editingUserId, {
        clinicId: editForm.clinicId,
        username: editForm.username,
        fullName: editForm.fullName,
        role: editForm.role as StaffRoleValue,
        isActive: editForm.isActive,
      });

      if (!res.isSuccess) {
        throw new Error(res.message || "Không thể cập nhật người dùng");
      }

      setShowEditModal(false);
      setEditingUserId(null);
      await loadData();
    } catch (err) {
      console.error("Failed to update staff user:", err);
      setEditError(
        err instanceof Error ? err.message : "Không thể cập nhật người dùng"
      );
    } finally {
      setEditSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F5F7FB] px-6 py-8 sm:px-10 lg:px-16">
      <div className="max-w-6xl mx-auto space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
            Quản lý người dùng
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý tài khoản nhân viên và quyền truy cập
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
                placeholder="Tìm kiếm theo tên hoặc email..."
                className="w-full rounded-lg border border-slate-200 bg-[#F9FAFB] pl-9 pr-3 py-2.5 text-sm outline-none focus:border-[#2563EB]"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {/* Role filter từ API enums - bỏ PATIENT vì admin không quản lý patient */}
            <select
              className="w-full md:w-52 rounded-lg border border-slate-200 bg-[#F9FAFB] px-3 py-2.5 text-sm outline-none focus:border-[#2563EB]"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
            >
              <option value="ALL">Tất cả vai trò</option>
              {roles
                .filter((r) => r.value !== "PATIENT") // Bỏ PATIENT khỏi dropdown
                .map((r) => (
                  <option key={r.value} value={r.value}>
                    {(() => {
                      switch (r.value) {
                        case "ADMIN":
                          return "Quản trị viên";
                        case "RECEPTIONIST":
                          return "Lễ tân";
                        case "DOCTOR":
                          return "Bác sĩ";
                        default:
                          return r.name;
                      }
                    })()}
                  </option>
                ))}
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
                  className={`w-3.5 h-3.5 ${
                    isRefreshing ? "animate-spin" : ""
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
                Không tải được danh sách người dùng
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

        {/* Table */}
        <div className="bg-white rounded-b-2xl border border-t-0 border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F9FAFB] text-xs text-slate-500">
                <th className="text-left font-medium px-5 py-3">Tên</th>
                <th className="text-left font-medium px-5 py-3">Username</th>
                <th className="text-left font-medium px-5 py-3">Phòng khám</th>
                <th className="text-left font-medium px-5 py-3">Vai trò</th>
                <th className="text-left font-medium px-5 py-3">Trạng thái</th>
                <th className="text-center font-medium px-5 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} className="border-t border-slate-100">
                      <td className="px-5 py-3">
                        <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                      </td>
                      <td className="px-5 py-3">
                        <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
                      </td>
                      <td className="px-5 py-3">
                        <div className="h-4 w-44 bg-slate-200 rounded animate-pulse" />
                      </td>
                      <td className="px-5 py-3">
                        <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                      </td>
                      <td className="px-5 py-3">
                        <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
                      </td>
                      <td className="px-5 py-3">
                        <div className="h-4 w-16 bg-slate-200 rounded animate-pulse mx-auto" />
                      </td>
                    </tr>
                  ))
                : filteredUsers.map((user, idx) => (
                    <tr
                      key={user.userId}
                      className={`border-t border-slate-100 ${
                        idx % 2 === 1 ? "bg-[#FCFCFD]" : "bg-white"
                      }`}
                    >
                      <td className="px-5 py-3 text-slate-800">
                        {user.fullName || "—"}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {user.username}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {user.clinic?.name || "—"}
                      </td>
                      <td className="px-5 py-3">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${
                            user.isActive
                              ? "bg-[#DCFCE7] text-[#15803D]"
                              : "bg-[#F3F4F6] text-[#4B5563]"
                          }`}
                        >
                          {user.isActive ? "Hoạt động" : "Không hoạt động"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-center gap-3 text-[15px]">
                          <button
                            type="button"
                            onClick={() => handleEdit(user)}
                            className="text-[#2563EB] hover:text-[#1D4ED8]"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(user)}
                            className="text-[#EF4444] hover:text-[#DC2626]"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

              {!loading && filteredUsers.length === 0 && !error && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-6 text-center text-sm text-slate-400"
                  >
                    Không tìm thấy người dùng phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add User Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Thêm người dùng
              </h2>

              <form onSubmit={handleSubmitAdd} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Phòng khám *
                  </label>
                  <select
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] bg-white"
                    value={addForm.clinicId}
                    onChange={(e) =>
                      setAddForm((prev) => ({
                        ...prev,
                        clinicId: e.target.value,
                      }))
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
                    Username *
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] bg-white"
                    value={addForm.username}
                    onChange={(e) =>
                      setAddForm((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    placeholder="VD: letan1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] bg-white"
                    value={addForm.fullName}
                    onChange={(e) =>
                      setAddForm((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    placeholder="VD: Trần Văn A"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Vai trò *
                  </label>
                  <select
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] bg-white"
                    value={addForm.role}
                    onChange={(e) =>
                      setAddForm((prev) => ({
                        ...prev,
                        role: e.target.value as StaffRoleValue,
                      }))
                    }
                  >
                    <option value="">Chọn vai trò</option>
                    {roles
                      .filter((r) =>
                        ["ADMIN", "RECEPTIONIST", "DOCTOR"].includes(r.value)
                      )
                      .map((r) => (
                        <option key={r.value} value={r.value}>
                          {(() => {
                            switch (r.value) {
                              case "ADMIN":
                                return "Quản trị viên";
                              case "RECEPTIONIST":
                                return "Lễ tân";
                              case "DOCTOR":
                                return "Bác sĩ";
                              default:
                                return r.name;
                            }
                          })()}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600">
                    Trạng thái
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setAddForm((prev) => ({
                        ...prev,
                        isActive: !prev.isActive,
                      }))
                    }
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${
                      addForm.isActive
                        ? "bg-[#DCFCE7] text-[#15803D]"
                        : "bg-[#F3F4F6] text-[#4B5563]"
                    }`}
                  >
                    {addForm.isActive ? "Hoạt động" : "Không hoạt động"}
                  </button>
                </div>

                {addError && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {addError}
                  </p>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!addSubmitting) {
                        setShowAddModal(false);
                      }
                    }}
                    className="px-4 py-2.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={addSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1D4ED8] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {addSubmitting && (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    <span>Lưu</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Sửa người dùng
              </h2>

              <form onSubmit={handleSubmitEdit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Phòng khám *
                  </label>
                  <select
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] bg-white"
                    value={editForm.clinicId}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        clinicId: e.target.value,
                      }))
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
                    Username *
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] bg-white"
                    value={editForm.username}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    placeholder="VD: letan1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] bg-white"
                    value={editForm.fullName}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    placeholder="VD: Trần Văn A"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Vai trò *
                  </label>
                  <select
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] bg-white"
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        role: e.target.value as StaffRoleValue,
                      }))
                    }
                  >
                    <option value="">Chọn vai trò</option>
                    {roles
                      .filter((r) =>
                        ["ADMIN", "RECEPTIONIST", "DOCTOR"].includes(r.value)
                      )
                      .map((r) => (
                        <option key={r.value} value={r.value}>
                          {(() => {
                            switch (r.value) {
                              case "ADMIN":
                                return "Quản trị viên";
                              case "RECEPTIONIST":
                                return "Lễ tân";
                              case "DOCTOR":
                                return "Bác sĩ";
                              default:
                                return r.name;
                            }
                          })()}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600">
                    Trạng thái
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setEditForm((prev) => ({
                        ...prev,
                        isActive: !prev.isActive,
                      }))
                    }
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${
                      editForm.isActive
                        ? "bg-[#DCFCE7] text-[#15803D]"
                        : "bg-[#F3F4F6] text-[#4B5563]"
                    }`}
                  >
                    {editForm.isActive ? "Hoạt động" : "Không hoạt động"}
                  </button>
                </div>

                {editError && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {editError}
                  </p>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!editSubmitting) {
                        setShowEditModal(false);
                        setEditingUserId(null);
                      }
                    }}
                    className="px-4 py-2.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={editSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1D4ED8] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {editSubmitting && (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    <span>Lưu thay đổi</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;

/* ====== Badge vai trò ====== */

const RoleBadge: React.FC<{ role: StaffRoleValue }> = ({ role }) => {
  if (role === "DOCTOR") {
    return (
      <span className="inline-flex rounded-full bg-[#E0ECFF] text-[#2563EB] px-3 py-1 text-[11px] font-semibold">
        Bác sĩ
      </span>
    );
  }
  if (role === "RECEPTIONIST") {
    return (
      <span className="inline-flex rounded-full bg-[#EDE9FE] text-[#4C1D95] px-3 py-1 text-[11px] font-semibold">
        Lễ tân
      </span>
    );
  }
  if (role === "ADMIN") {
    return (
      <span className="inline-flex rounded-full bg-[#FEE2E2] text-[#B91C1C] px-3 py-1 text-[11px] font-semibold">
        Quản trị viên
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full bg-[#F3F4F6] text-[#4B5563] px-3 py-1 text-[11px] font-semibold">
      Patient
    </span>
  );
};
