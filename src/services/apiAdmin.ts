import axios from "@/services/api.customize";

// ================== DASHBOARD TYPES & APIS ==================

/**
 * Admin Dashboard Statistics Response
 * Theo spec trong api.md
 */
export interface AdminDashboardStats {
  totalPatients: number; // Card: Tổng bệnh nhân
  todayAppointments: number; // Card: Lịch hẹn hôm nay
  monthlyRevenue: number; // Card: Doanh thu tháng (VND)
  satisfactionRate: number; // Card: Tỷ lệ hài lòng (%)

  // Optional fields
  patientsWaiting?: number;
  pendingPayment?: number;
  appointmentStatusCounts?: {
    pending: number;
    confirmed: number;
    checkedin: number;
    inprogress: number;
  };
}

/**
 * Today Appointment Item
 * Theo API spec mới: GET /api/receptionist/appointments/today
 */
export interface TodayAppointmentItem {
  id: string;
  patientName: string;
  phone: string;
  service: string;
  doctor: string;
  date: string; // "2026-01-07"
  time: string; // "08:00"
  duration: number; // minutes
  status: "confirmed" | "pending" | "checked-in" | "cancelled";
  notes?: string | null;
}

/**
 * Get Admin Dashboard Statistics
 * GET /api/receptionist/dashboard/stats
 */
export const getAdminDashboardStats = async (): Promise<AdminDashboardStats> => {
  const url = "/api/receptionist/dashboard/stats";
  const response = await axios.get<IBackendRes<AdminDashboardStats>>(url);

  if (response.isSuccess && response.data) {
    return response.data;
  }

  throw new Error(response.message || "Failed to fetch dashboard stats");
};

/**
 * Get Today's Appointments
 * GET /api/receptionist/appointments/today?limit=5&clinicId=?
 * Response trả về array trực tiếp (không có IBackendRes wrapper)
 */
export const getTodayAppointments = async (
  limit: number = 20,
  clinicId?: string
): Promise<TodayAppointmentItem[]> => {
  let url = `/api/receptionist/appointments/today?limit=${limit}`;
  if (clinicId) {
    url += `&clinicId=${clinicId}`;
  }
  const response = await axios.get<TodayAppointmentItem[]>(url);
  
  // Đảm bảo response là array
  if (Array.isArray(response)) {
    return response;
  }
  
  // Nếu response có data và data là array
  if (response && typeof response === 'object' && 'data' in response) {
    const responseWithData = response as { data: unknown };
    if (Array.isArray(responseWithData.data)) {
      return responseWithData.data as TodayAppointmentItem[];
    }
  }
  
  // Fallback: trả về array rỗng
  console.warn("getTodayAppointments: Response is not an array", response);
  return [];
};

// ================== STAFF USER MANAGEMENT ==================

export type StaffRoleValue = "ADMIN" | "RECEPTIONIST" | "DOCTOR" | "PATIENT";

export interface StaffRoleOption {
  value: StaffRoleValue;
  name: string;
}

export interface AdminClinicOption {
  clinicId: string;
  code: string;
  name: string;
  timeZone: string;
  phone: string;
  email: string;
}

export interface StaffUserRow {
  userId: string;
  clinicId: string;
  username: string;
  fullName: string;
  role: StaffRoleValue;
  isActive: boolean;
  clinic?: AdminClinicOption;
}

export interface CreateStaffUserRequest {
  clinicId: string;
  username: string;
  fullName: string;
  role: number; // theo spec: 1 Receptionist, 2 Doctor, 3 Admin
  isActive: boolean;
}

export interface UpdateStaffUserRequest {
  clinicId: string;
  username: string;
  fullName: string;
  role: StaffRoleValue;
  isActive: boolean;
}

/**
 * GET /api/admin/staff-user
 */
export const getStaffUsers = async (): Promise<StaffUserRow[]> => {
  const url = "/api/admin/staff-user";
  const response = await axios.get<IBackendRes<StaffUserRow[]>>(url);

  if (response.isSuccess && response.data) {
    return response.data;
  }

  throw new Error(response.message || "Không thể tải danh sách người dùng");
};

/**
 * GET /api/enums/staff-roles
 */
export const getStaffRoles = async (): Promise<StaffRoleOption[]> => {
  const url = "/api/enums/staff-roles";
  const response = await axios.get<StaffRoleOption[]>(url);
  return response;
};

/**
 * GET /api/admin/clinic
 */
export const getAdminClinics = async (): Promise<AdminClinicOption[]> => {
  const url = "/api/admin/clinic";
  const response = await axios.get<IBackendRes<AdminClinicOption[]>>(url);

  if (response.isSuccess && response.data) {
    return response.data;
  }

  throw new Error(response.message || "Không thể tải danh sách phòng khám");
};

/**
 * POST /api/admin/staff-user
 */
export const createStaffUser = async (
  payload: CreateStaffUserRequest
): Promise<IBackendRes<unknown>> => {
  const url = "/api/admin/staff-user";
  return axios.post<IBackendRes<unknown>>(url, payload);
};

/**
 * PUT /api/admin/staff-user/{userId}
 */
export const updateStaffUser = async (
  userId: string,
  payload: UpdateStaffUserRequest
): Promise<IBackendRes<unknown>> => {
  const url = `/api/admin/staff-user/${userId}`;
  return axios.put<IBackendRes<unknown>>(url, payload);
};

/**
 * DELETE /api/admin/staff-user/{userId}
 */
export const deleteStaffUser = async (
  userId: string
): Promise<IBackendRes<unknown>> => {
  const url = `/api/admin/staff-user/${userId}`;
  return axios.delete<IBackendRes<unknown>>(url);
};

// ================== PATIENT MANAGEMENT ==================

export interface PatientItem {
  patientId: string;
  clinicId: string;
  patientCode: string;
  fullName: string;
  gender: number; // 1 = Male, 2 = Female
  dob: string; // ISO date string
  primaryPhone: string | null;
  email: string | null;
  note: string | null;
  addressLine1: string | null;
  clinic?: AdminClinicOption;
  createdAt?: string; // ISO date string - when patient was created
}

/**
 * GET /api/patient
 * Lấy danh sách tất cả bệnh nhân
 */
export const getPatients = async (): Promise<PatientItem[]> => {
  const url = "/api/patient";
  const response = await axios.get<IBackendRes<PatientItem[]>>(url);

  if (response.isSuccess && response.data) {
    return response.data;
  }

  throw new Error(response.message || "Không thể tải danh sách bệnh nhân");
};
