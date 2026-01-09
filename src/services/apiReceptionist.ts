import axios from '@/services/api.customize';

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
    startAt: string; // ISO 8601 datetime
    endAt: string; // ISO 8601 datetime
    duration: number;
    status: 'confirmed' | 'pending' | 'checked-in' | 'cancelled';
    notes?: string;
    // Optional legacy fields for backward compatibility
    date?: string; // "YYYY-MM-DD"
    time?: string; // "HH:mm"
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

// Response type for confirm appointment (includes credentials for new guest accounts)
export interface ConfirmAppointmentResponse {
    success: boolean;
    appointmentId: string; // Backend returns "appointmentId", not "id"
    patientId?: string;
    status?: number; // AppointmentStatus enum
    cancelToken?: string | null;
    rescheduleToken?: string | null;
    username?: string; // Phone number for new accounts
    password?: string; // Phone number for new accounts
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
    let url = '/api/receptionist/dashboard/stats';
    if (clinicId) url += `?clinicId=${clinicId}`;
    return axios.get<IBackendRes<DashboardStats>>(url) as unknown as Promise<
        IBackendRes<DashboardStats>
    >;
};

/**
 * Get today's appointments
 * @param clinicId Optional clinic ID filter
 * @param limit Maximum number of appointments to return (default: 10)
 */
export const getTodayAppointments = (clinicId?: string, limit: number = 10) => {
    let url = `/api/receptionist/appointments/today?limit=${limit}`;
    if (clinicId) url += `&clinicId=${clinicId}`;
    return axios.get<IBackendRes<ReceptionistAppointment[]>>(
        url
    ) as unknown as Promise<IBackendRes<ReceptionistAppointment[]>>;
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
    return axios.get<IBackendRes<ReceptionistAppointment[]>>(
        url
    ) as unknown as Promise<IBackendRes<ReceptionistAppointment[]>>;
};

/**
 * Get appointments by date range (for reports)
 * @param filters Filter options with fromDate and toDate
 */
export const getAppointmentsByDateRange = (filters: {
    fromDate: string; // "YYYY-MM-DD"
    toDate: string; // "YYYY-MM-DD"
    status?: string;
    clinicId?: string;
}) => {
    let url = `/api/receptionist/appointments?fromDate=${filters.fromDate}&toDate=${filters.toDate}`;
    if (filters.status) url += `&status=${filters.status}`;
    if (filters.clinicId) url += `&clinicId=${filters.clinicId}`;
    return axios.get<IBackendRes<ReceptionistAppointment[]>>(
        url
    ) as unknown as Promise<IBackendRes<ReceptionistAppointment[]>>;
};

/**
 * Create a new appointment
 * @param data Appointment details
 */
export const createAppointment = (data: CreateAppointmentRequest) => {
    return axios.post<IBackendRes<ActionResult>>(
        '/api/receptionist/appointments',
        data
    ) as unknown as Promise<IBackendRes<ActionResult>>;
};

/**
 * Update an existing appointment
 * @param id Appointment ID (GUID)
 * @param data Updated appointment details
 */
export const updateAppointment = (
    id: string,
    data: UpdateAppointmentRequest
) => {
    return axios.put<IBackendRes<ActionResult>>(
        `/api/receptionist/appointments/${id}`,
        data
    ) as unknown as Promise<IBackendRes<ActionResult>>;
};

export const confirmGuestBooking = (id: string) => {
    return axios.post<IBackendRes<ConfirmAppointmentResponse>>(
        `/api/appointments/${id}/confirm`
    ) as unknown as Promise<IBackendRes<ConfirmAppointmentResponse>>;
};

export const confirmReceptionistBooking = (id: string) => {
    return axios.put<IBackendRes<ConfirmAppointmentResponse>>(
        `/api/receptionist/appointments/${id}/confirm`
    ) as unknown as Promise<IBackendRes<ConfirmAppointmentResponse>>;
};

export const confirmAppointment = confirmGuestBooking;

export const cancelAppointment = (id: string, reason?: string) => {
    const body = reason ? { reason } : {};
    return axios.put<IBackendRes<ActionResult>>(
        `/api/receptionist/appointments/${id}/cancel`,
        body
    ) as unknown as Promise<IBackendRes<ActionResult>>;
};

/**
 * Check-in a patient for their appointment
 * @param id Appointment ID (GUID)
 */
export const checkinAppointment = (id: string) => {
    return axios.put<IBackendRes<ActionResult>>(
        `/api/receptionist/appointments/${id}/checkin`
    ) as unknown as Promise<IBackendRes<ActionResult>>;
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

export const getQueue = (date?: string, search?: string, clinicId?: string) => {
    let url = '/api/receptionist/queue';
    const params = new URLSearchParams();

    if (date) params.append('date', date);
    if (search) params.append('search', search);
    if (clinicId) params.append('clinicId', clinicId);

    if (params.toString()) url += `?${params.toString()}`;

    return axios.get<IBackendRes<QueueItem[]>>(url) as unknown as Promise<
        IBackendRes<QueueItem[]>
    >;
};

export const callPatient = (id: string) => {
    return axios.put<IBackendRes<ActionResult>>(
        `/api/receptionist/queue/${id}/call`
    ) as unknown as Promise<IBackendRes<ActionResult>>;
};

export const completeAppointment = (id: string) => {
    return axios.put<IBackendRes<ActionResult>>(
        `/api/receptionist/queue/${id}/complete`
    ) as unknown as Promise<IBackendRes<ActionResult>>;
};

// ============ PATIENT MANAGEMENT APIs ============

export const getPatients = (search?: string, clinicId?: string) => {
    let url = '/api/receptionist/patients';
    const params = new URLSearchParams();

    if (search) params.append('search', search);
    if (clinicId) params.append('clinicId', clinicId);

    if (params.toString()) url += `?${params.toString()}`;

    return axios.get<IBackendRes<PatientListItem[]>>(url) as unknown as Promise<
        IBackendRes<PatientListItem[]>
    >;
};

export const getPatientDetail = (id: string) => {
    return axios.get<IBackendRes<PatientDetail>>(
        `/api/receptionist/patients/${id}`
    ) as unknown as Promise<IBackendRes<PatientDetail>>;
};

/**
 * Create a new patient
 * @param data Patient information
 */
export const createPatient = (data: CreatePatientRequest) => {
    return axios.post<IBackendRes<{ id: string }>>(
        '/api/receptionist/patients',
        data
    ) as unknown as Promise<IBackendRes<{ id: string }>>;
};

/**
 * Update an existing patient
 * @param patientId Patient ID (GUID)
 * @param data Updated patient information
 */
export const updatePatient = (
    patientId: string,
    data: CreatePatientRequest
) => {
    return axios.put<IBackendRes<{ success: boolean }>>(
        `/api/receptionist/patients/${patientId}`,
        data
    ) as unknown as Promise<IBackendRes<{ success: boolean }>>;
};

// ============ BILLING TYPES ============

export enum BillStatus {
    Pending = 0,
    Paid = 1,
    Cancelled = 2,
    Refunded = 3,
}

export enum BillItemType {
    Service = 1,
    Medicine = 2,
    Material = 3,
}

export interface BillListItem {
    id: string;
    patientName: string;
    phone: string;
    services: string[];
    totalAmount: number;
    createdAt: string;
    status: BillStatus;
    paidAt?: string | null; // Payment date (if available)
    paymentDate?: string | null; // Alternative field name
}

export interface PatientInfoDto {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    address: string | null;
}

export interface BillItem {
    id: string;
    type: string; // "service" | "medicine" | "material"
    name: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    amount: number;
    toothNumber: string | null;
    notes: string | null;
}

export interface BillDetail {
    id: string;
    invoiceNumber: string;
    createdAt: string;
    paymentDate: string | null;
    status: BillStatus;
    patient: PatientInfoDto;
    items: BillItem[];
    appointmentId: string | null;
    medicalRecordId: string | null;
    doctor: string | null;
    subtotal: number;
    discount: number;
    discountPercent: number | null;
    insuranceCovered: number | null;
    totalAmount: number;
    paymentMethod: string | null;
    paidAmount: number | null;
    changeAmount: number | null;
    notes: string | null;
    createdBy: string | null;
}

export interface CreateBillItemRequest {
    type: BillItemType;
    name: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    serviceId: string | null;
    toothNumber: string | null;
    notes: string | null;
}

export interface CreateBillRequest {
    clinicId: string;
    patientId: string;
    appointmentId: string | null;
    items: CreateBillItemRequest[];
    discount: number | null;
    discountPercent: number | null;
    notes: string | null;
}

export interface PayBillRequest {
    paymentMethod: 'Cash' | 'Card' | 'Transfer';
    amount: number;
    discount: number | null;
    notes: string | null;
}

export interface BillingStats {
    totalPending: number;
    totalPaid: number;
    totalCancelled: number;
    totalRefunded: number;
}

// Report-specific billing stats (matches api.md spec)
export interface ReportBillingStats {
    totalRevenue: number;
    paidBills: number;
    unpaidBills: number;
}

// ============ BILLING APIs ============

/**
 * Get bills with filters
 * @param filters Optional filters for date, status, search, clinicId
 */
export const getBills = (filters?: {
    date?: string;
    status?: string;
    search?: string;
    clinicId?: string;
    fromDate?: string;
    toDate?: string;
}) => {
    let url = '/api/receptionist/bills';
    const params = new URLSearchParams();

    if (filters?.date) params.append('date', filters.date);
    if (filters?.fromDate) params.append('fromDate', filters.fromDate);
    if (filters?.toDate) params.append('toDate', filters.toDate);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.clinicId) params.append('clinicId', filters.clinicId);

    if (params.toString()) url += `?${params.toString()}`;

    return axios.get<IBackendRes<BillListItem[]>>(url) as unknown as Promise<
        IBackendRes<BillListItem[]>
    >;
};

/**
 * Get bill detail by ID
 * @param billId Bill ID (GUID)
 */
export const getBillDetail = (billId: string) => {
    return axios.get<IBackendRes<BillDetail>>(
        `/api/receptionist/bills/${billId}`
    ) as unknown as Promise<IBackendRes<BillDetail>>;
};

/**
 * Create a new bill
 * @param data Bill creation data
 */
export const createBill = (data: CreateBillRequest) => {
    return axios.post<IBackendRes<{ billId: string; invoiceNumber: string }>>(
        '/api/receptionist/bills',
        data
    ) as unknown as Promise<
        IBackendRes<{ billId: string; invoiceNumber: string }>
    >;
};

/**
 * Pay bill with cash/card/transfer
 * @param billId Bill ID (GUID)
 * @param data Payment information
 */
export const payBill = (billId: string, data: PayBillRequest) => {
    return axios.put<IBackendRes<null>>(
        `/api/receptionist/bills/${billId}/pay`,
        data
    ) as unknown as Promise<IBackendRes<null>>;
};

/**
 * Cancel a bill
 * @param billId Bill ID (GUID)
 */
export const cancelBill = (billId: string) => {
    return axios.put<IBackendRes<null>>(
        `/api/receptionist/bills/${billId}/cancel`
    ) as unknown as Promise<IBackendRes<null>>;
};

/**
 * Get billing statistics
 * @param filters Optional filters for date and clinicId
 */
export const getBillingStats = (filters?: {
    date?: string;
    clinicId?: string;
}) => {
    let url = '/api/receptionist/billing/stats';
    const params = new URLSearchParams();

    if (filters?.date) params.append('date', filters.date);
    if (filters?.clinicId) params.append('clinicId', filters.clinicId);

    if (params.toString()) url += `?${params.toString()}`;

    return axios.get<IBackendRes<BillingStats>>(url) as unknown as Promise<
        IBackendRes<BillingStats>
    >;
};

/**
 * Get billing statistics for reports (matches api.md spec)
 * @param date Date in YYYY-MM format
 * @param clinicId Optional clinic ID
 */
export const getReportBillingStats = (date: string, clinicId?: string) => {
    let url = '/api/receptionist/billing/stats';
    const params = new URLSearchParams();

    params.append('date', date);
    if (clinicId) params.append('clinicId', clinicId);

    url += `?${params.toString()}`;

    return axios.get<IBackendRes<ReportBillingStats>>(url) as unknown as Promise<
        IBackendRes<ReportBillingStats>
    >;
};

// ============ VNPAY APIs ============

/**
 * Create VNPay payment URL
 * @param billId Bill ID (GUID)
 * @param returnUrl Optional custom return URL (defaults to configured URL)
 */
export const createVNPayUrl = (billId: string, returnUrl?: string) => {
    return axios.post<IBackendRes<string>>('/api/vnpay/create', {
        billId,
        returnUrl,
    }) as unknown as Promise<IBackendRes<string>>;
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
    type DoctorDto,
} from '@/services/apiPatient';
