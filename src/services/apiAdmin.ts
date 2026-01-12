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

  if (!response || !response.data) {
    throw new Error("No data in response");
  }

  return response.data;
};

/**
 * Billing Statistics Response
 * GET /api/billing/billing/stats
 */
export interface BillingStats {
  totalPending: number;   // Số hóa đơn chờ thanh toán (số tiền)
  totalPaid: number;      // Số hóa đơn đã thanh toán (số tiền)
  totalCancelled: number; // Số hóa đơn đã hủy (số tiền)
  totalRefunded: number;  // Số hóa đơn đã hoàn tiền (số tiền)
}

/**
 * Get Billing Statistics
 * GET /api/billing/billing/stats
 */
export const getBillingStats = async (): Promise<BillingStats> => {
  const url = "/api/billing/billing/stats";
  const response = await axios.get<IBackendRes<BillingStats>>(url);

  if (!response || !response.data) {
    throw new Error("No billing data in response");
  }

  return response.data;
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

export interface CreateClinicRequest {
  code: string;
  name: string;
  phone?: string;
  email?: string;
}

export interface UpdateClinicRequest {
  code: string;
  name: string;
  phone?: string;
  email?: string;
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

/**
 * POST /api/admin/clinic
 */
export const createClinic = async (
  payload: CreateClinicRequest
): Promise<IBackendRes<unknown>> => {
  const url = `/api/admin/clinic`;
  return axios.post<IBackendRes<unknown>>(url, payload);
};

/**
 * PUT /api/admin/clinic/{clinicId}
 */
export const updateClinic = async (
  clinicId: string,
  payload: UpdateClinicRequest
): Promise<IBackendRes<unknown>> => {
  const url = `/api/admin/clinic/${clinicId}`;
  return axios.put<IBackendRes<unknown>>(url, payload);
};

/**
 * DELETE /api/admin/clinic/{clinicId}
 */
export const deleteClinic = async (
  clinicId: string
): Promise<IBackendRes<unknown>> => {
  const url = `/api/admin/clinic/${clinicId}`;
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

export interface CreatePatientRequest {
  clinicId: string;
  patientCode: string;
  gender: number; // 1 = Male, 2 = Female
  fullName: string;
  primaryPhone?: string;
  email?: string;
  addressLine1?: string;
  dob?: string; // ISO date string
  note?: string;
}

export interface UpdatePatientRequest {
  clinicId: string;
  patientCode: string;
  gender: number;
  fullName: string;
  primaryPhone?: string;
  email?: string;
  addressLine1?: string;
  dob?: string;
  note?: string;
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

/**
 * POST /api/receptionist/patients
 */
export const createPatient = async (
  payload: CreatePatientRequest
): Promise<IBackendRes<unknown>> => {
  const url = "/api/receptionist/patients";
  return axios.post<IBackendRes<unknown>>(url, payload);
};

/**
 * PUT /api/receptionist/patients/{patientId}
 */
export const updatePatient = async (
  patientId: string,
  payload: UpdatePatientRequest
): Promise<IBackendRes<unknown>> => {
  const url = `/api/receptionist/patients/${patientId}`;
  return axios.put<IBackendRes<unknown>>(url, payload);
};

/**
 * DELETE /api/admin/patient/{patientId}
 */
export const deletePatient = async (
  patientId: string
): Promise<IBackendRes<unknown>> => {
  const url = `/api/admin/patient/${patientId}`;
  return axios.delete<IBackendRes<unknown>>(url);
};

// ================== DOCTOR MANAGEMENT ==================

export interface DoctorItem {
  doctorId: string;
  clinicId: string;
  code: string;
  fullName: string;
  specialty: string | null;
  phone: string | null;
  email: string | null;
  isActive: boolean;
}

export interface CreateDoctorRequest {
  clinicId: string;
  code: string;
  fullName: string;
  specialty?: string;
  phone?: string;
  email?: string;
}

export interface UpdateDoctorRequest {
  cLinicId: string; // Note: Backend has typo "CLinicId"
  code: string;
  fullName: string;
  specialty?: string;
  phone?: string;
  email?: string;
}

export interface DoctorTimeOffItem {
  timeOffId: string;
  clinicId: string;
  doctorId: string;
  startAt: string; // ISO datetime string
  endAt: string; // ISO datetime string
  reason: string | null;
}

export interface CreateDoctorTimeOffRequest {
  clinicId: string;
  doctorId: string;
  startAt: string; // ISO datetime string
  endAt: string; // ISO datetime string
  reason?: string;
}

export interface UpdateDoctorTimeOffRequest {
  clinicId: string;
  doctorId: string;
  startAt: string;
  endAt: string;
  reason?: string;
}

/**
 * GET /api/admin/doctor
 */
export const getDoctors = async (): Promise<DoctorItem[]> => {
  const url = "/api/admin/doctor";
  const response = await axios.get<IBackendRes<DoctorItem[]>>(url);

  if (response.isSuccess && response.data) {
    return response.data;
  }

  throw new Error(response.message || "Không thể tải danh sách bác sĩ");
};

/**
 * POST /api/admin/doctor
 */
export const createDoctor = async (
  payload: CreateDoctorRequest
): Promise<IBackendRes<unknown>> => {
  const url = "/api/admin/doctor";
  return axios.post<IBackendRes<unknown>>(url, payload);
};

/**
 * PUT /api/admin/doctor/{doctorId}
 */
export const updateDoctor = async (
  doctorId: string,
  payload: UpdateDoctorRequest
): Promise<IBackendRes<unknown>> => {
  const url = `/api/admin/doctor/${doctorId}`;
  return axios.put<IBackendRes<unknown>>(url, payload);
};

/**
 * DELETE /api/admin/doctor/{doctorId}
 */
export const deleteDoctor = async (
  doctorId: string
): Promise<IBackendRes<unknown>> => {
  const url = `/api/admin/doctor/${doctorId}`;
  return axios.delete<IBackendRes<unknown>>(url);
};

/**
 * GET /api/admin/doctor/time-offs/{doctorId}
 */
export const getDoctorTimeOffs = async (
  doctorId: string
): Promise<DoctorTimeOffItem[]> => {
  const url = `/api/admin/doctor/time-offs/${doctorId}`;
  const response = await axios.get<IBackendRes<DoctorTimeOffItem[]>>(url);

  if (response.isSuccess && response.data) {
    return response.data;
  }

  throw new Error(response.message || "Không thể tải danh sách thời gian nghỉ");
};

/**
 * POST /api/admin/doctor/time-off
 */
export const createDoctorTimeOff = async (
  payload: CreateDoctorTimeOffRequest
): Promise<IBackendRes<unknown>> => {
  const url = "/api/admin/doctor/time-off";
  return axios.post<IBackendRes<unknown>>(url, payload);
};

/**
 * PUT /api/admin/doctor/{timeOffId}/time-offs
 */
export const updateDoctorTimeOff = async (
  timeOffId: string,
  payload: UpdateDoctorTimeOffRequest
): Promise<IBackendRes<unknown>> => {
  const url = `/api/admin/doctor/${timeOffId}/time-offs`;
  return axios.put<IBackendRes<unknown>>(url, payload);
};

/**
 * DELETE /api/admin/doctor/time-off/{timeOffId}
 */
export const deleteDoctorTimeOff = async (
  timeOffId: string
): Promise<IBackendRes<unknown>> => {
  const url = `/api/admin/doctor/time-off/${timeOffId}`;
  return axios.delete<IBackendRes<unknown>>(url);
};

// ================== SERVICE MANAGEMENT ==================

export interface ServiceItem {
  serviceId: string;
  clinicId: string;
  code: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: number;
  isActive: boolean;
}

export interface CreateServiceRequest {
  clinicId: string;
  code: string;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
}

export interface UpdateServiceRequest {
  clinicId: string;
  code: string;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
}

/**
 * GET /api/admin/service
 * Lấy danh sách tất cả dịch vụ
 */
export const getServices = async (): Promise<ServiceItem[]> => {
  const url = "/api/admin/service";
  const response = await axios.get<IBackendRes<ServiceItem[]>>(url);

  if (response.isSuccess && response.data) {
    return response.data;
  }

  throw new Error(response.message || "Không thể tải danh sách dịch vụ");
};

/**
 * POST /api/admin/service
 * Tạo dịch vụ mới
 */
export const createService = async (
  payload: CreateServiceRequest
): Promise<IBackendRes<unknown>> => {
  const url = "/api/admin/service";
  return axios.post<IBackendRes<unknown>>(url, payload);
};

/**
 * PUT /api/admin/service/{serviceId}
 * Cập nhật dịch vụ
 */
export const updateService = async (
  serviceId: string,
  payload: UpdateServiceRequest
): Promise<IBackendRes<unknown>> => {
  const url = `/api/admin/service/${serviceId}`;
  return axios.put<IBackendRes<unknown>>(url, payload);
};

/**
 * DELETE /api/admin/service/{serviceId}
 * Xóa dịch vụ
 */
export const deleteService = async (
  serviceId: string
): Promise<IBackendRes<unknown>> => {
  const url = `/api/admin/service/${serviceId}`;
  return axios.delete<IBackendRes<unknown>>(url);
};

// ================== MEDICINE MANAGEMENT ==================

export interface MedicineItem {
  medicineId: string;
  code: string;
  name: string;
  description: string | null;
  unit: string;
  unitPrice: number;
  stockQuantity: number;
  minStockLevel: number;
  isActive: boolean;
}

export interface CreateMedicineRequest {
  code: string;
  name: string;
  description?: string;
  unit: string;
  unitPrice: number;
  stockQuantity: number;
  minStockLevel: number;
}

export interface UpdateMedicineRequest {
  code: string;
  name: string;
  description?: string;
  unit: string;
  unitPrice: number;
  stockQuantity: number;
  minStockLevel: number;
}

/**
 * GET /api/medicines
 * Lấy danh sách tất cả thuốc
 */
export const getMedicines = async (): Promise<MedicineItem[]> => {
  const url = "/api/medicines";
  const response = await axios.get<IBackendRes<MedicineItem[]>>(url);

  if (response.isSuccess && response.data) {
    return response.data;
  }

  throw new Error(response.message || "Không thể tải danh sách thuốc");
};

/**
 * POST /api/medicines
 * Tạo thuốc mới
 */
export const createMedicine = async (
  payload: CreateMedicineRequest
): Promise<IBackendRes<unknown>> => {
  const url = "/api/medicines";
  return axios.post<IBackendRes<unknown>>(url, payload);
};

/**
 * PUT /api/medicines/{medicineId}
 * Cập nhật thuốc
 */
export const updateMedicine = async (
  medicineId: string,
  payload: UpdateMedicineRequest
): Promise<IBackendRes<unknown>> => {
  const url = `/api/medicines/${medicineId}`;
  return axios.put<IBackendRes<unknown>>(url, payload);
};

/**
 * DELETE /api/medicines/{medicineId}
 * Xóa thuốc
 */
export const deleteMedicine = async (
  medicineId: string
): Promise<IBackendRes<unknown>> => {
  const url = `/api/medicines/${medicineId}`;
  return axios.delete<IBackendRes<unknown>>(url);
};


// ================== ADMIN REPORTS & DASHBOARD ==================

/**
 * Admin Dashboard Statistics
 * Tương ứng với AdminDashboardStatsDto từ backend
 */
export interface AdminDashboardStatsDto {
  totalPatients: number;
  totalAppointments: number;
  totalRevenue: number;
  satisfactionRate: number;
  totalDoctors: number;
  totalStaff: number;
  activeClinics: number;
}

/**
 * Patient Report Item
 * Tương ứng với PatientReportItemDto từ backend
 */
export interface PatientReportItemDto {
  id: string;
  patientCode: string;
  fullName: string;
  phone: string | null;
  email: string | null;
  gender: string | null;
  dob: string | null; // ISO date
  totalVisits: number;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

/**
 * Historical Statistics
 * Tương ứng với HistoricalStatsDto từ backend
 */
export interface HistoricalStatsDto {
  period: string; // "2026-01"
  periodStart: string; // ISO datetime
  periodEnd: string; // ISO datetime
  revenue: number;
  totalVisits: number;
  newPatients: number;
  completedAppointments: number;
  cancelledAppointments: number;
}

/**
 * Appointment Report
 * Tương ứng với AppointmentReportDto từ backend
 */
export interface AppointmentReportDto {
  month: string; // "2026-01"
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowAppointments: number;
  pendingAppointments: number;
}

/**
 * Rating Distribution
 * Tương ứng với RatingDistributionDto từ backend
 */
export interface RatingDistributionDto {
  fiveStar: number;
  fourStar: number;
  threeStar: number;
  twoStar: number;
  oneStar: number;
}

/**
 * Review Statistics
 * Tương ứng với ReviewStatsDto từ backend
 */
export interface ReviewStatsDto {
  averageRating: number;
  totalReviews: number;
  satisfactionRate: number;
  ratingDistribution: RatingDistributionDto;
}

/**
 * Create Review Request
 */
export interface CreateReviewRequest {
  appointmentId: string;
  rating: number; // 1-5
  comment?: string;
}

/**
 * Review Response
 */
export interface ReviewDto {
  reviewId: string;
  appointmentId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

/**
 * GET /api/admin/dashboard/stats
 * Lấy thống kê tổng quan dashboard cho admin
 */
export const getAdminDashboardStatsNew = async (): Promise<AdminDashboardStatsDto> => {
  const url = "/api/admin/dashboard/stats";
  const response = await axios.get<IBackendRes<AdminDashboardStatsDto>>(url);

  if (response.isSuccess && response.data) {
    return response.data;
  }

  throw new Error(response.message || "Không thể tải thống kê dashboard");
};

/**
 * GET /api/admin/report/patients?month={month}&year={year}
 * Lấy báo cáo bệnh nhân (có filter theo tháng/năm)
 */
export const getPatientReport = async (
  month?: number,
  year?: number
): Promise<PatientReportItemDto[]> => {
  let url = "/api/admin/report/patients";
  const params: string[] = [];

  if (month !== undefined) params.push(`month=${month}`);
  if (year !== undefined) params.push(`year=${year}`);

  if (params.length > 0) {
    url += `?${params.join("&")}`;
  }

  const response = await axios.get<IBackendRes<PatientReportItemDto[]>>(url);

  if (response.isSuccess && response.data) {
    return response.data;
  }

  throw new Error(response.message || "Không thể tải báo cáo bệnh nhân");
};

/**
 * GET /api/admin/report/historical-stats?startDate={startDate}&endDate={endDate}
 * Lấy thống kê lịch sử (mặc định 12 tháng gần nhất)
 */
export const getHistoricalStats = async (
  startDate?: string, // ISO datetime
  endDate?: string    // ISO datetime
): Promise<HistoricalStatsDto[]> => {
  let url = "/api/admin/report/historical-stats";
  const params: string[] = [];

  if (startDate) params.push(`startDate=${encodeURIComponent(startDate)}`);
  if (endDate) params.push(`endDate=${encodeURIComponent(endDate)}`);

  if (params.length > 0) {
    url += `?${params.join("&")}`;
  }

  const response = await axios.get<IBackendRes<HistoricalStatsDto[]>>(url);

  if (response.isSuccess && response.data) {
    return response.data;
  }

  throw new Error(response.message || "Không thể tải thống kê lịch sử");
};

/**
 * GET /api/admin/report/appointment?month={month}&year={year}
 * Lấy báo cáo lịch hẹn theo tháng/năm
 */
export const getAppointmentReport = async (
  month: number,
  year: number
): Promise<AppointmentReportDto> => {
  const url = `/api/admin/report/appointment?month=${month}&year=${year}`;
  const response = await axios.get<IBackendRes<AppointmentReportDto>>(url);

  if (response.isSuccess && response.data) {
    return response.data;
  }

  throw new Error(response.message || "Không thể tải báo cáo lịch hẹn");
};

/**
 * POST /api/patient/reviews
 * Tạo đánh giá cho lịch hẹn đã hoàn thành
 */
export const createReview = async (
  request: CreateReviewRequest
): Promise<IBackendRes<ReviewDto>> => {
  const url = "/api/patient/reviews";
  return axios.post<IBackendRes<ReviewDto>>(url, request);
};

/**
 * GET /api/admin/reviews/stats
 * Lấy thống kê đánh giá
 */
export const getReviewStats = async (): Promise<ReviewStatsDto> => {
  const url = "/api/admin/reviews/stats";
  const response = await axios.get<IBackendRes<ReviewStatsDto>>(url);

  if (response.isSuccess && response.data) {
    return response.data;
  }

  throw new Error(response.message || "Không thể tải thống kê đánh giá");
};
