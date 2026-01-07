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

// ============ PATIENT MANAGEMENT TYPES ============

export interface PatientListItem {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    lastVisit: string | null; // "DD/MM/YYYY"
    totalVisits: number;
}

export interface MedicalHistoryItem {
    id: string;
    date: string; // "DD/MM/YYYY"
    doctor: string;
    service: string;
    diagnosis: string | null;
    notes: string | null;
}

export interface RecentAppointmentItem {
    id: string;
    date: string; // "DD/MM/YYYY"
    time: string; // "HH:mm"
    doctor: string;
    service: string;
    status: string;
}

export interface PatientDetail {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    lastVisit: string | null;
    totalVisits: number;
    dob: string | null; // "DD/MM/YYYY"
    address: string | null;
    medicalHistory: MedicalHistoryItem[];
    appointments: RecentAppointmentItem[];
}

export interface CreatePatientRequest {
    clinicId: string; // GUID
    patientCode: string;
    fullName: string;
    gender: 'Male' | 'Female' | 'Other';
    primaryPhone: string | null;
    email: string | null;
    addressLine1: string | null;
    dob: string | null; // ISO date string
    note: string | null;
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

// ============ QUEUE MANAGEMENT APIs ============

export interface QueueItem {
    id: string;
    number: number;
    name: string;
    service: string;
    time: string; // "HH:mm"
    status: 'waiting' | 'checked-in' | 'in-progress' | 'completed';
}

/**
 * Get today's queue
 * @param date Optional date in "DD-MM-YYYY" format (defaults to today)
 * @param search Optional search term (patient name or phone)
 * @param clinicId Optional clinic ID filter
 */
export const getQueue = (date?: string, search?: string, clinicId?: string) => {
    let url = "/api/receptionist/queue";
    const params = new URLSearchParams();

    if (date) params.append('date', date);
    if (search) params.append('search', search);
    if (clinicId) params.append('clinicId', clinicId);

    if (params.toString()) url += `?${params.toString()}`;

    return axios.get<IBackendRes<QueueItem[]>>(url) as unknown as Promise<IBackendRes<QueueItem[]>>;
};

/**
 * Call a patient (move from checked-in to in-progress)
 * @param id Appointment ID (GUID)
 */
export const callPatient = (id: string) => {
    return axios.put<IBackendRes<ActionResult>>(`/api/receptionist/queue/${id}/call`) as unknown as Promise<IBackendRes<ActionResult>>;
};

/**
 * Complete an appointment (move from in-progress to completed)
 * @param id Appointment ID (GUID)
 */
export const completeAppointment = (id: string) => {
    return axios.put<IBackendRes<ActionResult>>(`/api/receptionist/queue/${id}/complete`) as unknown as Promise<IBackendRes<ActionResult>>;
};

// ============ PATIENT MANAGEMENT APIs ============

/**
 * Get patients list for receptionist
 * @param search Optional search term (name, phone, email, patient code)
 * @param clinicId Optional clinic ID filter
 */
export const getPatients = (search?: string, clinicId?: string) => {
    let url = "/api/receptionist/patients";
    const params = new URLSearchParams();

    if (search) params.append('search', search);
    if (clinicId) params.append('clinicId', clinicId);

    if (params.toString()) url += `?${params.toString()}`;

    return axios.get<IBackendRes<PatientListItem[]>>(url) as unknown as Promise<IBackendRes<PatientListItem[]>>;
};

/**
 * Get patient detail for receptionist
 * @param id Patient ID (GUID)
 */
export const getPatientDetail = (id: string) => {
    return axios.get<IBackendRes<PatientDetail>>(`/api/receptionist/patients/${id}`) as unknown as Promise<IBackendRes<PatientDetail>>;
};

/**
 * Create a new patient
 * @param data Patient information
 */
export const createPatient = (data: CreatePatientRequest) => {
    return axios.post<IBackendRes<{ id: string }>>("/api/receptionist/patients", data) as unknown as Promise<IBackendRes<{ id: string }>>;
};

/**
 * Update an existing patient
 * @param patientId Patient ID (GUID)
 * @param data Updated patient information
 */
export const updatePatient = (patientId: string, data: CreatePatientRequest) => {
    return axios.put<IBackendRes<{ success: boolean }>>(`/api/receptionist/patients/${patientId}`, data) as unknown as Promise<IBackendRes<{ success: boolean }>>;
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
