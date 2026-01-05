import React, { useMemo, useState } from "react";
import { FiSearch, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";

type Role = "doctor" | "receptionist" | "admin";

type UserRow = {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: "active" | "inactive";
};

const USERS: UserRow[] = [
  {
    id: 1,
    name: "BS. Nguyễn Văn A",
    email: "doctor.a@example.com",
    role: "doctor",
    status: "active",
  },
  {
    id: 2,
    name: "BS. Trần Thị B",
    email: "doctor.b@example.com",
    role: "doctor",
    status: "active",
  },
  {
    id: 3,
    name: "Lễ tân C",
    email: "receptionist.c@example.com",
    role: "receptionist",
    status: "active",
  },
  {
    id: 4,
    name: "Admin D",
    email: "admin.d@example.com",
    role: "admin",
    status: "active",
  },
];

const UserManagementPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");

  const filteredUsers = useMemo(
    () =>
      USERS.filter((u) => {
        const matchText =
          u.name.toLowerCase().includes(query.toLowerCase()) ||
          u.email.toLowerCase().includes(query.toLowerCase());
        const matchRole = roleFilter === "all" || u.role === roleFilter;
        return matchText && matchRole;
      }),
    [query, roleFilter]
  );

  const handleAdd = () => {
    console.log("add user");
  };

  const handleEdit = (user: UserRow) => {
    console.log("edit user", user);
  };

  const handleDelete = (user: UserRow) => {
    console.log("delete user", user);
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

            {/* Role filter đơn giản */}
            <select
              className="w-full md:w-52 rounded-lg border border-slate-200 bg-[#F9FAFB] px-3 py-2.5 text-sm outline-none focus:border-[#2563EB]"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as Role | "all")}
            >
              <option value="all">Tất cả vai trò</option>
              <option value="doctor">Bác sĩ</option>
              <option value="receptionist">Lễ tân</option>
              <option value="admin">Quản trị viên</option>
            </select>

            {/* Add button */}
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#EF4444] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#DC2626]"
            >
              <FiPlus className="w-4 h-4" />
              <span>Thêm</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-b-2xl border border-t-0 border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F9FAFB] text-xs text-slate-500">
                <th className="text-left font-medium px-5 py-3">Tên</th>
                <th className="text-left font-medium px-5 py-3">Email</th>
                <th className="text-left font-medium px-5 py-3">Vai trò</th>
                <th className="text-left font-medium px-5 py-3">Trạng thái</th>
                <th className="text-center font-medium px-5 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, idx) => (
                <tr
                  key={user.id}
                  className={`border-t border-slate-100 ${
                    idx % 2 === 1 ? "bg-[#FCFCFD]" : "bg-white"
                  }`}
                >
                  <td className="px-5 py-3 text-slate-800">{user.name}</td>
                  <td className="px-5 py-3 text-slate-600">{user.email}</td>
                  <td className="px-5 py-3">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center rounded-full bg-[#DCFCE7] text-[#15803D] px-3 py-1 text-[11px] font-semibold">
                      Hoạt động
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

              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-6 text-center text-sm text-slate-400"
                  >
                    Không tìm thấy người dùng phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;

/* ====== Badge vai trò ====== */

const RoleBadge: React.FC<{ role: Role }> = ({ role }) => {
  if (role === "doctor") {
    return (
      <span className="inline-flex rounded-full bg-[#E0ECFF] text-[#2563EB] px-3 py-1 text-[11px] font-semibold">
        Bác sĩ
      </span>
    );
  }
  if (role === "receptionist") {
    return (
      <span className="inline-flex rounded-full bg-[#EDE9FE] text-[#4C1D95] px-3 py-1 text-[11px] font-semibold">
        Lễ tân
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full bg-[#FEE2E2] text-[#B91C1C] px-3 py-1 text-[11px] font-semibold">
      Quản trị viên
    </span>
  );
};
