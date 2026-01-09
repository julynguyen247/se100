import axios from '@/services/api.customize';

// ============ TYPES ============

// Dashboard
export interface DoctorDashboardStats {
    waitingCount: number;
    examinedToday: number;
    averageExamTime: string;
    appointmentsToday: number;
    waitingQueue: DoctorQueueItem[];
}

export interface DoctorQueueItem {
    id: string;
    queueNumber: number;
    patientName: string;
    service: string;
    time: string; // HH:mm format
    status: 'pending' | 'confirmed' | 'checkedin' | 'inprogress' | 'completed';
}

// Queue Detail
export interface DoctorQueueDetail {
    id: string;
    queueNumber: number;
    appointmentId: string;
    patientId: string | null;
    patientName: string;
    patientPhone: string;
    service: string;
    serviceId: string | null;
    scheduledTime: string; // ISO datetime
    startTime: string | null;
    endTime: string | null;
    status: string;
}

// Patient List
export interface DoctorPatientListItem {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    lastVisit: string | null; // ISO datetime
    totalVisits: number;
}

// Patient Detail
export interface DoctorPatientDetail {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    dob: string | null;
    gender: string | null;
    address: string | null;
    allergy: string | null;
    chronicDisease: string | null;
    lastVisit: string | null;
    totalVisits: number;
    medicalHistory: DoctorMedicalHistoryItem[];
    upcomingAppointments: DoctorUpcomingAppointment[];
}

export interface DoctorMedicalHistoryItem {
    id: string;
    recordDate: string;
    doctor: string;
    service: string;
    diagnosis: string | null;
    notes: string | null;
}

export interface DoctorUpcomingAppointment {
    id: string;
    startAt: string;
    service: string;
    status: string;
}

// Medical Record
export interface DoctorMedicalRecordDetail {
    id: string;
    title: string;
    doctor: string;
    recordDate: string;
    diagnosis: string | null;
    treatment: string | null;
    prescription: string | null;
    notes: string | null;
    attachments: object[];
}

export interface CreateMedicalRecordRequest {
    appointmentId: string;
    patientId: string;
    title: string;
    diagnosis?: string;
    treatment?: string;
    prescription?: string;
    notes?: string;
}

export interface UpdateMedicalRecordRequest {
    appointmentId: string;
    patientId: string;
    title: string;
    diagnosis?: string;
    treatment?: string;
    prescription?: string;
    notes?: string;
}

// Medicine Catalog (from /api/medicines)
export interface MedicineCatalogItem {
    medicineId: string;
    code: string;
    name: string;
    unit: string;
    price: number;
    isActive: boolean;
}

// Prescription Template
export interface MedicineDto {
    medicineId: string; // GUID from medicine catalog
    name: string;
    dosage: string;
    quantity: string;
    instructions: string;
}

export interface PrescriptionTemplate {
    id: string;
    name: string;
    category: string | null;
    medicines: MedicineDto[];
    notes: string | null;
}

export interface CreatePrescriptionTemplateRequest {
    name: string;
    category?: string;
    medicines: MedicineDto[];
    notes?: string;
}

// Examination
export interface PrescriptionInput {
    medicines: MedicineDto[];
    notes?: string;
}

export interface CreateExaminationRequest {
    appointmentId: string;
    patientId: string;
    title: string;
    diagnosis?: string;
    treatment?: string;
    toothStatus?: Record<string, string>; // e.g., {"T16": "filled", "T17": "healthy"}
    prescription?: PrescriptionInput;
    notes?: string;
    createBill: boolean;
    serviceIds?: string[]; // Required if createBill=true
}

export interface CreateExaminationResponse {
    examinationId: string;
    medicalRecordId: string;
    billId: string | null;
    createdAt: string;
}

// ============ DASHBOARD APIs ============

/**
 * Get doctor dashboard statistics
 */
export const getDashboardStats = () => {
    return axios.get<IBackendRes<DoctorDashboardStats>>(
        '/api/doctor/dashboard/stats'
    ) as unknown as Promise<IBackendRes<DoctorDashboardStats>>;
};

// ============ QUEUE APIs ============

/**
 * Get patient queue for today (or specific date)
 * @param date Optional date in YYYY-MM-DD format
 */
export const getQueue = (date?: string) => {
    let url = '/api/doctor/queue';
    if (date) url += `?date=${date}`;
    return axios.get<IBackendRes<DoctorQueueDetail[]>>(
        url
    ) as unknown as Promise<IBackendRes<DoctorQueueDetail[]>>;
};

/**
 * Start examination for an appointment
 * @param appointmentId Appointment GUID
 */
export const startExam = (appointmentId: string) => {
    return axios.put<
        IBackendRes<{
            appointmentId: string;
            status: string;
            startTime: string;
        }>
    >(`/api/doctor/queue/${appointmentId}/start`) as unknown as Promise<
        IBackendRes<{
            appointmentId: string;
            status: string;
            startTime: string;
        }>
    >;
};

/**
 * Complete examination for an appointment
 * @param appointmentId Appointment GUID
 */
export const completeExam = (appointmentId: string) => {
    return axios.put<
        IBackendRes<{
            appointmentId: string;
            status: string;
            endTime: string;
            duration: string;
        }>
    >(`/api/doctor/queue/${appointmentId}/complete`) as unknown as Promise<
        IBackendRes<{
            appointmentId: string;
            status: string;
            endTime: string;
            duration: string;
        }>
    >;
};

// ============ PATIENTS APIs ============

/**
 * Get list of patients the doctor has examined
 */
export const getPatients = () => {
    return axios.get<IBackendRes<DoctorPatientListItem[]>>(
        '/api/doctor/patients'
    ) as unknown as Promise<IBackendRes<DoctorPatientListItem[]>>;
};

/**
 * Get patient detail with medical history
 * @param patientId Patient GUID
 */
export const getPatientDetail = (patientId: string) => {
    return axios.get<IBackendRes<DoctorPatientDetail>>(
        `/api/doctor/patients/${patientId}`
    ) as unknown as Promise<IBackendRes<DoctorPatientDetail>>;
};

// ============ MEDICAL RECORDS APIs ============

/**
 * Get medical record detail
 * @param recordId Medical record GUID
 */
export const getMedicalRecordDetail = (recordId: string) => {
    return axios.get<IBackendRes<DoctorMedicalRecordDetail>>(
        `/api/doctor/medical-records/${recordId}`
    ) as unknown as Promise<IBackendRes<DoctorMedicalRecordDetail>>;
};

/**
 * Create a new medical record
 */
export const createMedicalRecord = (data: CreateMedicalRecordRequest) => {
    return axios.post<IBackendRes<{ recordId: string; createdAt: string }>>(
        '/api/doctor/medical-records',
        data
    ) as unknown as Promise<
        IBackendRes<{ recordId: string; createdAt: string }>
    >;
};

/**
 * Update an existing medical record
 * @param recordId Medical record GUID
 */
export const updateMedicalRecord = (
    recordId: string,
    data: UpdateMedicalRecordRequest
) => {
    return axios.put<IBackendRes<{ recordId: string; updatedAt: string }>>(
        `/api/doctor/medical-records/${recordId}`,
        data
    ) as unknown as Promise<
        IBackendRes<{ recordId: string; updatedAt: string }>
    >;
};

// ============ PRESCRIPTION TEMPLATE APIs ============

/**
 * Get prescription templates for the doctor
 */
export const getPrescriptionTemplates = () => {
    return axios.get<IBackendRes<PrescriptionTemplate[]>>(
        '/api/doctor/prescription-templates'
    ) as unknown as Promise<IBackendRes<PrescriptionTemplate[]>>;
};

/**
 * Create a new prescription template
 */
export const createPrescriptionTemplate = (
    data: CreatePrescriptionTemplateRequest
) => {
    return axios.post<IBackendRes<{ templateId: string; createdAt: string }>>(
        '/api/doctor/prescription-templates',
        data
    ) as unknown as Promise<
        IBackendRes<{ templateId: string; createdAt: string }>
    >;
};

// ============ EXAMINATION APIs ============

/**
 * Create a complete examination (medical record + optionally invoice)
 * This is the main API for saving examination results
 */
export const createExamination = (data: CreateExaminationRequest) => {
    return axios.post<IBackendRes<CreateExaminationResponse>>(
        '/api/doctor/examinations',
        data
    ) as unknown as Promise<IBackendRes<CreateExaminationResponse>>;
};

// ============ MEDICINE APIs ============

/**
 * Get list of medicines in the clinic
 */
export const getMedicines = () => {
    return axios.get<IBackendRes<MedicineCatalogItem[]>>(
        '/api/medicines'
    ) as unknown as Promise<IBackendRes<MedicineCatalogItem[]>>;
};
