export { };
declare global {
  interface IBackendRes<T> {
    isSuccess: boolean;
    error?: string | string[];
    message: string;
    statusCode?: number | string;
    data?: T;
  }
  interface IModelPaginate<T> {
    meta: {
      current: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    result: T[];
  }
  interface ILogin {
    access_token: string;
    user: {
      email: string;
      fullName: string;
      _id: string;
    };
  }
  interface IUserTable {
    _id: string;
    email: string;
    fullName: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
    role: string;
  }
  interface IUser {
    email: string;
    fullName: string;
    _id: string;
    role: string;
  }
  interface IRegister {
    email: string;
    fullName: string;
    phone: string;
    _id: string;
  }
  interface IShoesTable {
    _id: string;
    mainText: string;
    brand: string;
    price: number;
    quantity: number;
    category: string;
    thumbnail: string;
    slider: string[];
    createdAt: string;
    updatedAt: string;
  }
  interface IFetchAccount {
    user: IUser;
  }

  // ============ RECEPTIONIST TYPES ============
  interface DashboardStats {
    patientsWaiting: number;
    todayAppointments: number;
    pendingConfirmation: number;
    pendingPayment: number;
  }

  interface ReceptionistAppointment {
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

  interface CreateAppointmentRequest {
    patientName: string;
    phone: string;
    serviceId: string;
    doctorId: string;
    clinicId: string;
    date: string;
    time: string;
    duration: number;
    notes?: string;
  }

  interface UpdateAppointmentRequest {
    patientName: string;
    phone: string;
    serviceId: string;
    doctorId: string;
    date: string;
    time: string;
    duration: number;
    notes?: string;
  }
}
