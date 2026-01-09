import axios from '@/services/api.customize';

export interface IBackendRes<T> {
    isSuccess: boolean;
    message: string;
    data: T;
}

export interface CancelAppointmentRequest {
    token: string;
}

export interface RescheduleAppointmentRequest {
    token: string;
    startTime: string; // ISO DateTime string
    endTime: string; // ISO DateTime string
}

export interface AppointmentResponse {
    appointmentId: string;
    status: string;
    newStartAt?: string;
    newEndAt?: string;
}

// Cancel appointment using token from email
export const cancelAppointment = (token: string) => {
    return axios.post<IBackendRes<AppointmentResponse>>(
        '/api/appointments/cancel',
        { token }
    );
};

// Reschedule appointment using token from email
export const rescheduleAppointment = (
    token: string,
    startTime: string,
    endTime: string
) => {
    return axios.post<IBackendRes<AppointmentResponse>>(
        '/api/appointments/reschedule',
        {
            token,
            startTime,
            endTime,
        }
    );
};

// Get available time slots for rescheduling
export const getTimeSlots = (
    clinicId: string,
    doctorId: string,
    date: string
) => {
    return axios.get<IBackendRes<string[]>>('/api/time-slots', {
        params: { clinicId, doctorId, date },
    });
};
