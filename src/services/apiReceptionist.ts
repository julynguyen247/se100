import axios from "@/services/api.customize";

// ============ TYPES ============

export interface DashboardStats {
    patientsWaiting: number;
    todayAppointments: number;
    pendingConfirmation: number;
    pendingPayment: number;
}

export interface ReceptionistAppointment {
    id: string;
    patientName: string;
    phone: string;
    service: string;
    doctor: string;
    date: string; // "YYYY-MM-DD"
    time: string; // "HH:mm"
    duration: number;
    status: 'confirmed' | 'pending' | 'checked-in' | 'cancelled';
    notes?: string;
}

export interface CreateAppointmentRequest {
    patientName: string;
    phone: string;
    serviceId: string; // GUID
    doctorId: string; // GUID
    clinicId: string; // GUID
    date: string; // "YYYY-MM-DD"
    time: string; // "HH:mm"
    duration: number;
    notes?: string;
}

export interface UpdateAppointmentRequest {
    patientName: string;
    phone: string;
    serviceId: string;
    doctorId: string;
    date: string;
    time: string;
    duration: number;
    notes?: string;
}

export interface ActionResult {
    success: boolean;
    id: string;
}

// ============ DASHBOARD APIs ============

/**
 * Get dashboard statistics
 * @param clinicId Optional clinic ID filter
 */
export const getDashboardStats = (clinicId?: string) => {
    let url = "/api/receptionist/dashboard/stats";
    if (clinicId) url += `?clinicId=${clinicId}`;
    return axios.get<IBackendRes<DashboardStats>>(url) as unknown as Promise<IBackendRes<DashboardStats>>;
};

/**
 * Get today's appointments
 * @param clinicId Optional clinic ID filter
 * @param limit Maximum number of appointments to return (default: 10)
 */
export const getTodayAppointments = (clinicId?: string, limit: number = 10) => {
    let url = `/api/receptionist/appointments/today?limit=${limit}`;
    if (clinicId) url += `&clinicId=${clinicId}`;
    return axios.get<IBackendRes<ReceptionistAppointment[]>>(url) as unknown as Promise<IBackendRes<ReceptionistAppointment[]>>;
};

// ============ APPOINTMENTS CRUD ============

/**
 * Get appointments with filters
 * @param filters Filter options (date is required)
 */
export const getAppointments = (filters: {
    date: string; // Required: "YYYY-MM-DD"
    doctor?: string;
    status?: string;
    search?: string;
    clinicId?: string;
}) => {
    let url = `/api/receptionist/appointments?date=${filters.date}`;
    if (filters.doctor) url += `&doctor=${encodeURIComponent(filters.doctor)}`;
    if (filters.status) url += `&status=${filters.status}`;
    if (filters.search) url += `&search=${encodeURIComponent(filters.search)}`;
    if (filters.clinicId) url += `&clinicId=${filters.clinicId}`;
    return axios.get<IBackendRes<ReceptionistAppointment[]>>(url) as unknown as Promise<IBackendRes<ReceptionistAppointment[]>>;
};

/**
 * Create a new appointment
 * @param data Appointment details
 */
export const createAppointment = (data: CreateAppointmentRequest) => {
    return axios.post<IBackendRes<ActionResult>>("/api/receptionist/appointments", data) as unknown as Promise<IBackendRes<ActionResult>>;
};

/**
 * Update an existing appointment
 * @param id Appointment ID (GUID)
 * @param data Updated appointment details
 */
export const updateAppointment = (id: string, data: UpdateAppointmentRequest) => {
    return axios.put<IBackendRes<ActionResult>>(`/api/receptionist/appointments/${id}`, data) as unknown as Promise<IBackendRes<ActionResult>>;
};

// ============ APPOINTMENT ACTIONS ============

/**
 * Confirm an appointment
 * @param id Appointment ID (GUID)
 */
export const confirmAppointment = (id: string) => {
    return axios.put<IBackendRes<ActionResult>>(`/api/receptionist/appointments/${id}/confirm`) as unknown as Promise<IBackendRes<ActionResult>>;
};

/**
 * Cancel an appointment
 * @param id Appointment ID (GUID)
 * @param reason Optional cancellation reason
 */
export const cancelAppointment = (id: string, reason?: string) => {
    const body = reason ? { reason } : {};
    return axios.put<IBackendRes<ActionResult>>(`/api/receptionist/appointments/${id}/cancel`, body) as unknown as Promise<IBackendRes<ActionResult>>;
};

/**
 * Check-in a patient for their appointment
 * @param id Appointment ID (GUID)
 */
export const checkinAppointment = (id: string) => {
    return axios.put<IBackendRes<ActionResult>>(`/api/receptionist/appointments/${id}/checkin`) as unknown as Promise<IBackendRes<ActionResult>>;
};

// ============ RE-EXPORT BOOKING APIs FOR RECEPTIONIST USE ============

/**
 * Re-export booking APIs from patient service for receptionist components
 * These are used for dropdowns in appointment forms (clinics, services, doctors)
 */
export {
    getClinics,
    getServices,
    getDoctors,
    type ClinicDto,
    type ServiceDto,
    type DoctorDto
} from '@/services/apiPatient';
