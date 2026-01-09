import axios from '@/services/api.customize';

export type ProfileData = {
    id: string;
    fullName: string;
    gender: string;
    dob: string;
    phone: string;
    email: string;
    address: string;
    allergy: string | null;
    chronicDisease: string | null;
    emergencyName: string | null;
    emergencyPhone: string | null;
    bloodGroup: string | null;
    insuranceType: string | null;
    insuranceNumber: string | null;
};

export type MedicalRecordDto = {
    id: string;
    title: string;
    doctor: string;
    date: string;
    diagnosis: string | null;
    treatment: string | null;
    prescription: string | null;
    notes: string | null;
    attachments: string[];
};

export type AttachmentDto = {
    id: string;
    fileName: string;
    contentType: string;
    fileSize: number;
};

export type MedicalRecordDetailDto = {
    id: string;
    title: string;
    doctor: string;
    recordDate: string;
    diagnosis: string | null;
    treatment: string | null;
    prescription: string | null;
    notes: string | null;
    attachments: AttachmentDto[];
};

export type EnumDto = {
    value: number;
    name: string;
};

export type AppointmentStatus =
    | 'booked'
    | 'confirmed'
    | 'pending'
    | 'completed'
    | 'cancelled'
    | 'noshow';

// Raw response from API
export type AppointmentApiDto = {
    id: string;
    title: string;
    doctor: string;
    startAt: string; // ISO DateTime from backend
    note: string | null;
    status: AppointmentStatus;
};

// Transformed for UI display
export type AppointmentDto = {
    id: string;
    title: string;
    doctor: string;
    date: string; // DD/MM/YYYY
    time: string; // HH:mm
    note: string | null;
    status: AppointmentStatus;
};

export type CancelAppointmentRequest = {
    reason: string;
};

// Helper function to transform API response to UI format
const transformAppointmentData = (
    apiData: AppointmentApiDto
): AppointmentDto => {
    // Parse UTC datetime from backend
    const startDate = new Date(apiData.startAt);

    // Format date as DD/MM/YYYY (local timezone)
    const day = String(startDate.getDate()).padStart(2, '0');
    const month = String(startDate.getMonth() + 1).padStart(2, '0');
    const year = startDate.getFullYear();
    const date = `${day}/${month}/${year}`;

    // Format time as HH:mm (local timezone)
    const hours = String(startDate.getHours()).padStart(2, '0');
    const minutes = String(startDate.getMinutes()).padStart(2, '0');
    const time = `${hours}:${minutes}`;

    return {
        id: apiData.id,
        title: apiData.title,
        doctor: apiData.doctor,
        date,
        time,
        note: apiData.note,
        status: apiData.status,
    };
};

export const getPatientProfile = () => {
    const urlBackend = '/api/patient/profile';
    return axios.get<IBackendRes<ProfileData>>(urlBackend);
};

export const getGenderEnum = () => {
    const urlBackend = '/api/enums/genders';
    return axios.get<IBackendRes<EnumDto[]>>(urlBackend);
};

export const getMedicalRecords = () => {
    const urlBackend = '/api/patient/medical-records';
    return axios.get<IBackendRes<MedicalRecordDto[]>>(urlBackend);
};

export const getMedicalRecordDetail = (id: string) => {
    const urlBackend = `/api/patient/medical-records/${id}`;
    return axios.get<IBackendRes<MedicalRecordDetailDto>>(urlBackend);
};

export const downloadMedicalRecordAttachment = (
    recordId: string,
    attachmentId: string
) => {
    const urlBackend = `/api/patient/medical-records/${recordId}/attachments/${attachmentId}`;
    return axios.get(urlBackend, {
        responseType: 'blob', // Important for file download
    });
};

// Helper function to convert DD/MM/YYYY to ISO DateTime string (YYYY-MM-DD)
const convertDDMMYYYYToISO = (ddmmyyyy: string): string | null => {
    if (!ddmmyyyy) return null;

    const parts = ddmmyyyy.split('/');
    if (parts.length !== 3) return null;

    const [day, month, year] = parts;
    // Create ISO format: YYYY-MM-DD
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

export const updatePatientProfile = (data: Omit<ProfileData, 'id'>) => {
    const urlBackend = '/api/patient/profile';

    // Convert DD/MM/YYYY to ISO format for backend
    const convertedDob = data.dob ? convertDDMMYYYYToISO(data.dob) : null;

    return axios.put<IBackendRes<ProfileData>>(urlBackend, {
        fullName: data.fullName,
        gender: data.gender,
        dob: convertedDob, // Send as ISO format
        phone: data.phone,
        email: data.email,
        address: data.address,
        emergencyName: data.emergencyName,
        emergencyPhone: data.emergencyPhone,
        bloodGroup: data.bloodGroup,
        allergy: data.allergy,
        chronicDisease: data.chronicDisease,
        insuranceType: data.insuranceType,
        insuranceNumber: data.insuranceNumber,
    });
};

export const getPatientAppointments = async () => {
    const urlBackend = `/api/patient/appointments`;
    const response = await axios.get<IBackendRes<AppointmentApiDto[]>>(
        urlBackend
    );

    // Transform data if successful
    if (response?.isSuccess && response.data) {
        return {
            ...response,
            data: response.data.map(transformAppointmentData),
        };
    }

    return response as unknown as IBackendRes<AppointmentDto[]>;
};

export const getAppointmentDetail = async (id: string) => {
    const urlBackend = `/api/patient/appointments/${id}`;
    const response = await axios.get<IBackendRes<AppointmentApiDto>>(
        urlBackend
    );

    // Transform data if successful
    if (response?.isSuccess && response.data) {
        return {
            ...response,
            data: transformAppointmentData(response.data),
        };
    }

    return response as unknown as IBackendRes<AppointmentDto>;
};

export const cancelAppointment = (id: string, reason: string) => {
    const urlBackend = `/api/patient/appointments/${id}/cancel`;
    return axios.put<IBackendRes<{ success: boolean }>>(urlBackend, { reason });
};

// --- Booking Flow Types ---

export type ClinicDto = {
    clinicId: string;
    code: string;
    name: string;
    timeZone: string;
    phone: string | null;
    email: string | null;
};

export type ServiceDto = {
    serviceId: string;
    code: string;
    name: string;
    defaultDurationMin: number | null;
    defaultPrice: number | null;
    isActive: boolean;
    clinicId: string;
};

export type DoctorDto = {
    doctorId: string;
    clinicId: string;
    code: string;
    fullName: string;
    specialty: string | null;
    phone: string | null;
    email: string | null;
    isActive: boolean;
};

export type SlotDto = {
    startAt: string;
    endAt: string;
};

export type CreateBookingRequest = {
    clinicId: string;
    doctorId: string;
    serviceId?: string;
    patientId?: string;
    startAt: string;
    endAt: string;
    fullName: string;
    phone: string;
    email?: string;
    notes?: string;
};

export type CreateBookingResponse = {
    appointmentId: string;
    patientId: string | null;
    status: number;
    cancelToken: string;
    rescheduleToken: string;
    username: string | null;
    password: string | null;
};

// --- Booking Flow APIs ---

export const getClinics = (nameOrCode?: string) => {
    let url = '/api/clinic';
    if (nameOrCode) url += `?nameOrCode=${encodeURIComponent(nameOrCode)}`;
    return axios.get<IBackendRes<ClinicDto[]>>(url) as unknown as Promise<
        IBackendRes<ClinicDto[]>
    >;
};

export const getServices = (clinicId: string) => {
    const url = `/api/services?clinicId=${clinicId}&isActive=true`;
    return axios.get<IBackendRes<ServiceDto[]>>(url) as unknown as Promise<
        IBackendRes<ServiceDto[]>
    >;
};

export const getDoctors = (clinicId: string, serviceId?: string) => {
    let url = `/api/doctors?clinicId=${clinicId}&isActive=true`;
    if (serviceId) url += `&serviceId=${serviceId}`;
    return axios.get<IBackendRes<DoctorDto[]>>(url) as unknown as Promise<
        IBackendRes<DoctorDto[]>
    >;
};

export const getSlots = (
    clinicId: string,
    doctorId: string,
    date: string,
    serviceId?: string
) => {
    // date format: yyyy-mm-dd
    let url = `/api/slots?clinicId=${clinicId}&doctorId=${doctorId}&date=${date}`;
    if (serviceId) url += `&serviceId=${serviceId}`;
    return axios.get<IBackendRes<SlotDto[]>>(url) as unknown as Promise<
        IBackendRes<SlotDto[]>
    >;
};

export const createBooking = (data: CreateBookingRequest) => {
    return axios.post<IBackendRes<CreateBookingResponse>>(
        '/api/appointments',
        data
    ) as unknown as Promise<IBackendRes<CreateBookingResponse>>;
};

// --- Guest Appointment Management (Token-based) ---

/**
 * Cancel appointment using cancel token (no authentication required)
 * @param token Cancel token received when creating appointment
 */
export const cancelAppointmentByToken = (token: string) => {
    const url = `/api/appointments/cancel?token=${token}`;
    return axios.post<
        IBackendRes<{
            appointmentId: string;
            status: string;
        }>
    >(url) as unknown as Promise<
        IBackendRes<{
            appointmentId: string;
            status: string;
        }>
    >;
};

/**
 * Reschedule appointment using reschedule token (no authentication required)
 * @param token Reschedule token received when creating appointment
 * @param startTime New start time (ISO 8601 format)
 * @param endTime New end time (ISO 8601 format)
 */
export const rescheduleAppointmentByToken = (
    token: string,
    startTime: string,
    endTime: string
) => {
    const url = `/api/appointments/reschedule?token=${token}&start=${encodeURIComponent(
        startTime
    )}&end=${encodeURIComponent(endTime)}`;
    return axios.post<
        IBackendRes<{
            appointmentId: string;
            newStartAt: string;
            newEndAt: string;
        }>
    >(url) as unknown as Promise<
        IBackendRes<{
            appointmentId: string;
            newStartAt: string;
            newEndAt: string;
        }>
    >;
};

/**
 * Get appointment details by ID (no authentication required for public view)
 * @param appointmentId Appointment ID
 */
export const getAppointmentByToken = (appointmentId: string) => {
    const url = `/api/appointments/${appointmentId}`;
    return axios.get<IBackendRes<any>>(url) as unknown as Promise<
        IBackendRes<any>
    >;
};
