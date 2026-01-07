import axios from "@/services/api.customize";

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

export type EnumDto = {
    value: number;
    name: string;
};

export type AppointmentStatus = "booked" | "confirmed" | "pending" | "completed" | "cancelled" | "noshow";

export type AppointmentDto = {
    id: string;
    title: string;
    doctor: string;
    date: string;
    time: string;
    note: string | null;
    status: AppointmentStatus;
};

export type CancelAppointmentRequest = {
    reason: string;
};

export const getPatientProfile = () => {
    const urlBackend = "/api/patient/profile";
    return axios.get<IBackendRes<ProfileData>>(urlBackend);
};

export const getGenderEnum = () => {
    const urlBackend = "/api/enums/genders";
    return axios.get<IBackendRes<EnumDto[]>>(urlBackend);
};

export const getMedicalRecords = () => {
    const urlBackend = "/api/patient/medical-records";
    return axios.get<IBackendRes<MedicalRecordDto[]>>(urlBackend);
};

export const updatePatientProfile = (data: Omit<ProfileData, 'id'>) => {
    const urlBackend = "/api/patient/profile";
    return axios.put<IBackendRes<ProfileData>>(urlBackend, {
        fullName: data.fullName,
        gender: data.gender,
        dob: data.dob,
        phone: data.phone,
        email: data.email,
        address: data.address,
        emergencyName: data.emergencyName,
        emergencyPhone: data.emergencyPhone,
        bloodGroup: data.bloodGroup,
        allergy: data.allergy,
        chronicDisease: data.chronicDisease,
        insuranceType: data.insuranceType,
        insuranceNumber: data.insuranceNumber
    });
};

export const getPatientAppointments = () => {
    const urlBackend = `/api/patient/appointments`;
    return axios.get<IBackendRes<AppointmentDto[]>>(urlBackend);
};

export const getAppointmentDetail = (id: string) => {
    const urlBackend = `/api/patient/appointments/${id}`;
    return axios.get<IBackendRes<AppointmentDto>>(urlBackend);
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

// --- Booking Flow APIs ---

export const getClinics = (nameOrCode?: string) => {
    let url = "/api/clinic";
    if (nameOrCode) url += `?nameOrCode=${encodeURIComponent(nameOrCode)}`;
    return axios.get<IBackendRes<ClinicDto[]>>(url) as unknown as Promise<IBackendRes<ClinicDto[]>>;
};

export const getServices = (clinicId: string) => {
    const url = `/api/services?clinicId=${clinicId}&isActive=true`;
    return axios.get<IBackendRes<ServiceDto[]>>(url) as unknown as Promise<IBackendRes<ServiceDto[]>>;
};

export const getDoctors = (clinicId: string, serviceId?: string) => {
    let url = `/api/doctors?clinicId=${clinicId}&isActive=true`;
    if (serviceId) url += `&serviceId=${serviceId}`;
    return axios.get<IBackendRes<DoctorDto[]>>(url) as unknown as Promise<IBackendRes<DoctorDto[]>>;
};

export const getSlots = (clinicId: string, doctorId: string, date: string, serviceId?: string) => {
    // date format: yyyy-mm-dd
    let url = `/api/slots?clinicId=${clinicId}&doctorId=${doctorId}&date=${date}`;
    if (serviceId) url += `&serviceId=${serviceId}`;
    return axios.get<IBackendRes<SlotDto[]>>(url) as unknown as Promise<IBackendRes<SlotDto[]>>;
};

export const createBooking = (data: CreateBookingRequest) => {
    return axios.post<IBackendRes<any>>("/api/appointments", data) as unknown as Promise<IBackendRes<any>>;
};