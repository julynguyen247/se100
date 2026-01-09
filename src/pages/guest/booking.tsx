import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getClinics,
    getServices,
    getDoctors,
    getSlots,
    createBooking,
    getPatientProfile,
    type ClinicDto,
    type ServiceDto,
    type DoctorDto,
    type SlotDto,
    type CreateBookingRequest,
    type CreateBookingResponse,
} from '@/services/apiPatient';
import { message } from 'antd';
import BookingSuccessModal from '@/components/booking/BookingSuccessModal';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

type Step = 1 | 2 | 3 | 4;

type BookingFormData = {
    // Personal Info
    fullName: string;
    phone: string;
    email: string;

    // Selection
    clinicId: string;
    serviceId: string;
    doctorId: string;
    selectedDate: string;
    selectedSlot: SlotDto | null;

    // Note
    notes: string;
};

const BookAppointmentPage: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>(1);
    const [loading, setLoading] = useState(false);

    // User authentication state
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Data lists
    const [clinics, setClinics] = useState<ClinicDto[]>([]);
    const [services, setServices] = useState<ServiceDto[]>([]);
    const [doctors, setDoctors] = useState<DoctorDto[]>([]);
    const [slots, setSlots] = useState<SlotDto[]>([]);

    // Success modal state
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [bookingResult, setBookingResult] =
        useState<CreateBookingResponse | null>(null);

    // Form data
    const [formData, setFormData] = useState<BookingFormData>({
        fullName: '',
        phone: '',
        email: '',
        clinicId: '',
        serviceId: '',
        doctorId: '',
        selectedDate: '',
        selectedSlot: null,
        notes: '',
    });

    // Check authentication and load profile on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const response = await getPatientProfile();
                    if (response.isSuccess && response.data) {
                        setIsAuthenticated(true);

                        // Auto-fill personal info from profile
                        setFormData((prev) => ({
                            ...prev,
                            fullName: response.data?.fullName || '',
                            phone: response.data?.phone || '',
                            email: response.data?.email || '',
                        }));
                    }
                } catch (error) {
                    console.error('Failed to load profile:', error);
                    setIsAuthenticated(false);
                }
            }
        };

        checkAuth();
    }, []);

    // Load clinics on mount
    useEffect(() => {
        const loadClinics = async () => {
            try {
                const response = await getClinics();
                if (response.isSuccess && response.data) {
                    setClinics(response.data);
                }
            } catch (error) {
                console.error('Failed to load clinics:', error);
                message.error('Không thể tải danh sách phòng khám');
            }
        };

        loadClinics();
    }, []);

    // Load services when clinic is selected
    useEffect(() => {
        if (formData.clinicId) {
            const loadServices = async () => {
                try {
                    const response = await getServices(formData.clinicId);
                    if (response.isSuccess && response.data) {
                        setServices(response.data);
                    }
                } catch (error) {
                    console.error('Failed to load services:', error);
                    message.error('Không thể tải danh sách dịch vụ');
                }
            };

            loadServices();
        } else {
            setServices([]);
        }
    }, [formData.clinicId]);

    // Load doctors when clinic and service are selected
    useEffect(() => {
        if (formData.clinicId) {
            const loadDoctors = async () => {
                try {
                    const response = await getDoctors(
                        formData.clinicId,
                        formData.serviceId || undefined
                    );
                    if (response.isSuccess && response.data) {
                        setDoctors(response.data);
                    }
                } catch (error) {
                    console.error('Failed to load doctors:', error);
                    message.error('Không thể tải danh sách bác sĩ');
                }
            };

            loadDoctors();
        } else {
            setDoctors([]);
        }
    }, [formData.clinicId, formData.serviceId]);

    // Load slots when date and doctor are selected
    useEffect(() => {
        if (formData.clinicId && formData.doctorId && formData.selectedDate) {
            const loadSlots = async () => {
                setLoading(true);
                try {
                    const response = await getSlots(
                        formData.clinicId,
                        formData.doctorId,
                        formData.selectedDate,
                        formData.serviceId || undefined
                    );
                    if (response.isSuccess && response.data) {
                        setSlots(response.data);
                    }
                } catch (error) {
                    console.error('Failed to load slots:', error);
                    message.error('Không thể tải danh sách khung giờ');
                } finally {
                    setLoading(false);
                }
            };

            loadSlots();
        } else {
            setSlots([]);
        }
    }, [
        formData.clinicId,
        formData.doctorId,
        formData.selectedDate,
        formData.serviceId,
    ]);

    const updateField = <K extends keyof BookingFormData>(
        key: K,
        value: BookingFormData[K]
    ) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmitBooking = async (e: FormEvent) => {
        e.preventDefault();

        if (!formData.selectedSlot) {
            message.error('Vui lòng chọn khung giờ');
            return;
        }

        setLoading(true);
        try {
            const bookingRequest: CreateBookingRequest = {
                clinicId: formData.clinicId,
                doctorId: formData.doctorId,
                serviceId: formData.serviceId || undefined,
                startAt: formData.selectedSlot.startAt,
                endAt: formData.selectedSlot.endAt,
                fullName: formData.fullName,
                phone: formData.phone,
                email: formData.email || undefined,
                notes: formData.notes || undefined,
            };

            const response = await createBooking(bookingRequest);

            if (response.isSuccess && response.data) {
                // Store booking result and show success modal
                setBookingResult(response.data);
                setShowSuccessModal(true);
            } else {
                message.error(response.message || 'Đặt lịch thất bại');
            }
        } catch (error: any) {
            console.error('Booking error:', error);
            message.error(
                error.response?.data?.message || 'Có lỗi xảy ra khi đặt lịch'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F7FB] flex justify-center px-4 py-10">
            <div className="w-full max-w-4xl">
                <HeaderStepper step={step} isAuthenticated={isAuthenticated} />

                <div className="bg-white rounded-2xl shadow-sm px-6 py-6 sm:px-8 sm:py-7 mt-4">
                    {step === 1 && (
                        <StepPersonalInfo
                            data={formData}
                            onChange={updateField}
                            onNext={() => setStep(2)}
                            isAuthenticated={isAuthenticated}
                        />
                    )}

                    {step === 2 && (
                        <StepSelection
                            data={formData}
                            onChange={updateField}
                            clinics={clinics}
                            services={services}
                            doctors={doctors}
                            onPrev={() => setStep(1)}
                            onNext={() => setStep(3)}
                        />
                    )}

                    {step === 3 && (
                        <StepDateTime
                            data={formData}
                            onChange={updateField}
                            slots={slots}
                            loading={loading}
                            onPrev={() => setStep(2)}
                            onNext={() => setStep(4)}
                        />
                    )}

                    {step === 4 && (
                        <StepConfirmation
                            data={formData}
                            clinics={clinics}
                            services={services}
                            doctors={doctors}
                            onPrev={() => setStep(3)}
                            onSubmit={handleSubmitBooking}
                            loading={loading}
                            isAuthenticated={isAuthenticated}
                        />
                    )}
                </div>
            </div>

            {/* Success Modal */}
            {bookingResult && (
                <BookingSuccessModal
                    isOpen={showSuccessModal}
                    onClose={() => {
                        setShowSuccessModal(false);
                        // Navigate after closing modal
                        if (isAuthenticated) {
                            navigate('/patient/appointments');
                        } else {
                            navigate('/');
                        }
                    }}
                    appointmentData={{
                        appointmentId: bookingResult.appointmentId,
                        cancelToken: bookingResult.cancelToken,
                        rescheduleToken: bookingResult.rescheduleToken,
                        doctorName: doctors.find(
                            (d) => d.doctorId === formData.doctorId
                        )?.fullName,
                        serviceName: services.find(
                            (s) => s.serviceId === formData.serviceId
                        )?.name,
                        date: formData.selectedSlot
                            ? dayjs
                                  .utc(formData.selectedSlot.startAt)
                                  .format('DD/MM/YYYY')
                            : undefined,
                        time: formData.selectedSlot
                            ? `${dayjs
                                  .utc(formData.selectedSlot.startAt)
                                  .format('HH:mm')} - ${dayjs
                                  .utc(formData.selectedSlot.endAt)
                                  .format('HH:mm')}`
                            : undefined,
                        username: bookingResult.username,
                        password: bookingResult.password,
                        // For reschedule slot fetching
                        clinicId: formData.clinicId,
                        doctorId: formData.doctorId,
                        serviceId: formData.serviceId || undefined,
                    }}
                />
            )}
        </div>
    );
};

export default BookAppointmentPage;

/* ---------- HEADER + STEPPER ---------- */

const HeaderStepper: React.FC<{ step: Step; isAuthenticated: boolean }> = ({
    step,
    isAuthenticated,
}) => {
    return (
        <div className="flex flex-col items-center text-center mb-2">
            <span className="inline-flex items-center justify-center rounded-full bg-[#E0ECFF] text-[#2563EB] text-[10px] font-semibold px-4 py-1 tracking-[0.18em] uppercase">
                BOOK APPOINTMENT
            </span>

            <h1 className="mt-4 text-xl sm:text-2xl font-semibold text-slate-900">
                Đặt lịch hẹn
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
                {isAuthenticated
                    ? 'Thông tin của bạn đã được tự động điền'
                    : 'Vui lòng điền đầy đủ thông tin để đặt lịch'}
            </p>

            <div className="mt-6 w-full max-w-lg flex items-center">
                <StepCircle index={1} current={step} label="Thông tin" />
                <div className="flex-1 h-px bg-slate-200 mx-3" />
                <StepCircle index={2} current={step} label="Chọn dịch vụ" />
                <div className="flex-1 h-px bg-slate-200 mx-3" />
                <StepCircle index={3} current={step} label="Thời gian" />
                <div className="flex-1 h-px bg-slate-200 mx-3" />
                <StepCircle index={4} current={step} label="Xác nhận" />
            </div>
        </div>
    );
};

const StepCircle: React.FC<{
    index: number;
    current: number;
    label: string;
}> = ({ index, current, label }) => {
    const isActive = current === index;
    const isDone = current > index;

    const circleClass = isActive
        ? 'bg-[#2563EB] text-white'
        : isDone
        ? 'bg-emerald-500 text-white'
        : 'bg-slate-100 text-slate-400 border border-slate-200';

    const textClass = isActive
        ? 'text-[#2563EB]'
        : isDone
        ? 'text-emerald-600'
        : 'text-slate-400';

    return (
        <div className="flex flex-col items-center">
            <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shadow-sm ${circleClass}`}
            >
                {index}
            </div>
            <span className={`mt-2 text-xs font-medium ${textClass}`}>
                {label}
            </span>
        </div>
    );
};

/* ---------- STEP 1: THÔNG TIN CÁ NHÂN ---------- */

type StepProps = {
    data: BookingFormData;
    onChange: <K extends keyof BookingFormData>(
        key: K,
        value: BookingFormData[K]
    ) => void;
};

const StepPersonalInfo: React.FC<
    StepProps & {
        onNext: () => void;
        isAuthenticated: boolean;
    }
> = ({ data, onChange, onNext, isAuthenticated }) => {
    const handleNext = (e: FormEvent) => {
        e.preventDefault();
        onNext();
    };

    return (
        <>
            <h2 className="text-sm font-semibold text-slate-900 mb-5">
                Thông tin cá nhân
            </h2>

            {isAuthenticated && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-700">
                        ✓ Thông tin của bạn đã được tự động điền từ hồ sơ
                    </p>
                </div>
            )}

            <form className="space-y-4" onSubmit={handleNext}>
                <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-700">
                        Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Nhập họ và tên"
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white"
                        value={data.fullName}
                        onChange={(e) => onChange('fullName', e.target.value)}
                        required
                        readOnly={isAuthenticated}
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-700">
                        Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        placeholder="Nhập số điện thoại (10-12 số)"
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white"
                        value={data.phone}
                        required
                        minLength={10}
                        maxLength={12}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value) && value.length <= 12) {
                                onChange('phone', value);
                            }
                        }}
                        readOnly={isAuthenticated}
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-700">
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="Nhập email "
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white"
                        value={data.email}
                        required
                        onChange={(e) => onChange('email', e.target.value)}
                        readOnly={isAuthenticated}
                    />
                </div>

                <button
                    type="submit"
                    className="mt-4 w-full rounded-lg bg-[#2563EB] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1D4ED8]"
                >
                    Tiếp tục
                </button>
            </form>
        </>
    );
};

/* ---------- STEP 2: CHỌN PHÒNG KHÁM, DỊCH VỤ, BÁC SĨ ---------- */

const StepSelection: React.FC<
    StepProps & {
        clinics: ClinicDto[];
        services: ServiceDto[];
        doctors: DoctorDto[];
        onPrev: () => void;
        onNext: () => void;
    }
> = ({ data, onChange, clinics, services, doctors, onPrev, onNext }) => {
    const handleNext = (e: FormEvent) => {
        e.preventDefault();
        onNext();
    };

    return (
        <>
            <h2 className="text-sm font-semibold text-slate-900 mb-5">
                Chọn phòng khám và dịch vụ
            </h2>

            <form className="space-y-4" onSubmit={handleNext}>
                {/* Phòng khám */}
                <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-700">
                        Phòng khám <span className="text-red-500">*</span>
                    </label>
                    <select
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white"
                        value={data.clinicId}
                        onChange={(e) => {
                            onChange('clinicId', e.target.value);
                            onChange('serviceId', '');
                            onChange('doctorId', '');
                        }}
                        required
                    >
                        <option value="">Chọn phòng khám</option>
                        {clinics.map((clinic) => (
                            <option
                                key={clinic.clinicId}
                                value={clinic.clinicId}
                            >
                                {clinic.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Dịch vụ */}
                <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-700">
                        Dịch vụ
                    </label>
                    <select
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white"
                        value={data.serviceId}
                        onChange={(e) => {
                            onChange('serviceId', e.target.value);
                            onChange('doctorId', '');
                        }}
                        disabled={!data.clinicId}
                    >
                        <option value="">Chọn dịch vụ (không bắt buộc)</option>
                        {services.map((service) => (
                            <option
                                key={service.serviceId}
                                value={service.serviceId}
                            >
                                {service.name} -{' '}
                                {service.defaultPrice?.toLocaleString()}đ
                            </option>
                        ))}
                    </select>
                </div>

                {/* Bác sĩ */}
                <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-700">
                        Bác sĩ <span className="text-red-500">*</span>
                    </label>
                    <select
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white"
                        value={data.doctorId}
                        onChange={(e) => onChange('doctorId', e.target.value)}
                        disabled={!data.clinicId}
                        required
                    >
                        <option value="">Chọn bác sĩ</option>
                        {doctors.map((doctor) => (
                            <option
                                key={doctor.doctorId}
                                value={doctor.doctorId}
                            >
                                {doctor.fullName}{' '}
                                {doctor.specialty
                                    ? `- ${doctor.specialty}`
                                    : ''}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-between gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onPrev}
                        className="w-1/2 rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                        Quay lại
                    </button>
                    <button
                        type="submit"
                        className="w-1/2 rounded-lg bg-[#2563EB] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1D4ED8]"
                    >
                        Tiếp tục
                    </button>
                </div>
            </form>
        </>
    );
};

/* ---------- STEP 3: CHỌN NGÀY VÀ GIỜ ---------- */

const StepDateTime: React.FC<
    StepProps & {
        slots: SlotDto[];
        loading: boolean;
        onPrev: () => void;
        onNext: () => void;
    }
> = ({ data, onChange, slots, loading, onPrev, onNext }) => {
    const handleNext = (e: FormEvent) => {
        e.preventDefault();
        if (!data.selectedSlot) {
            message.error('Vui lòng chọn khung giờ');
            return;
        }
        onNext();
    };

    const formatTime = (dateString: string) => {
        // Show as-is (UTC), matching backend's intention for local clinic time
        return dayjs.utc(dateString).format('HH:mm');
    };

    return (
        <>
            <h2 className="text-sm font-semibold text-slate-900 mb-5">
                Chọn ngày và giờ
            </h2>

            <form className="space-y-4" onSubmit={handleNext}>
                {/* Ngày hẹn */}
                <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-700">
                        Ngày hẹn <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white"
                        value={data.selectedDate}
                        onChange={(e) => {
                            onChange('selectedDate', e.target.value);
                            onChange('selectedSlot', null);
                        }}
                        min={new Date().toISOString().split('T')[0]}
                        required
                    />
                </div>

                {/* Khung giờ */}
                <div className="space-y-2">
                    <label className="block text-xs font-medium text-slate-700">
                        Khung giờ <span className="text-red-500">*</span>
                    </label>

                    {loading ? (
                        <div className="text-center py-8 text-sm text-slate-500">
                            Đang tải khung giờ...
                        </div>
                    ) : slots.length === 0 ? (
                        <div className="text-center py-8 text-sm text-slate-500">
                            {data.selectedDate
                                ? 'Không có khung giờ trống trong ngày này'
                                : 'Vui lòng chọn ngày để xem khung giờ'}
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {slots.map((slot, index) => {
                                const isSelected =
                                    data.selectedSlot?.startAt === slot.startAt;
                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() =>
                                            onChange('selectedSlot', slot)
                                        }
                                        className={`rounded-md border text-xs py-2 text-center transition
                    ${
                        isSelected
                            ? 'bg-[#2563EB] border-[#2563EB] text-white'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                                    >
                                        {formatTime(slot.startAt)}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="flex justify-between gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onPrev}
                        className="w-1/2 rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                        Quay lại
                    </button>
                    <button
                        type="submit"
                        className="w-1/2 rounded-lg bg-[#2563EB] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1D4ED8]"
                        disabled={!data.selectedSlot}
                    >
                        Tiếp tục
                    </button>
                </div>
            </form>
        </>
    );
};

/* ---------- STEP 4: XÁC NHẬN ---------- */

type StepConfirmationProps = {
    data: BookingFormData;
    clinics: ClinicDto[];
    services: ServiceDto[];
    doctors: DoctorDto[];
    onPrev: () => void;
    onSubmit: (e: FormEvent) => void;
    loading: boolean;
    isAuthenticated: boolean;
};

const StepConfirmation: React.FC<StepConfirmationProps> = ({
    data,
    clinics,
    services,
    doctors,
    onPrev,
    onSubmit,
    loading,
    isAuthenticated,
}) => {
    const [notes, setNotes] = useState(data.notes);

    const selectedClinic = clinics.find((c) => c.clinicId === data.clinicId);
    const selectedService = services.find(
        (s) => s.serviceId === data.serviceId
    );
    const selectedDoctor = doctors.find((d) => d.doctorId === data.doctorId);

    const formatTime = (dateString: string) => {
        return dayjs.utc(dateString).format('HH:mm');
    };

    const formatDate = (dateString: string) => {
        return dayjs.utc(dateString).format('DD/MM/YYYY');
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // Update notes in the parent data before submitting
        data.notes = notes;
        onSubmit(e);
    };

    return (
        <>
            <h2 className="text-sm font-semibold text-slate-900 mb-5">
                Xác nhận thông tin đặt lịch
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Ghi chú */}
                <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-700">
                        Ghi chú
                    </label>
                    <textarea
                        rows={3}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white resize-none"
                        placeholder="Triệu chứng, yêu cầu đặc biệt... (không bắt buộc)"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>

                {/* Tóm tắt thông tin */}
                <div className="bg-slate-50 rounded-lg p-4 mt-4">
                    <h3 className="text-xs font-semibold text-slate-700 mb-3">
                        Tóm tắt thông tin:
                    </h3>
                    <div className="space-y-2 text-xs text-slate-600">
                        <div className="flex justify-between">
                            <span className="font-medium">Họ tên:</span>
                            <span>{data.fullName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">SĐT:</span>
                            <span>{data.phone}</span>
                        </div>
                        {data.email && (
                            <div className="flex justify-between">
                                <span className="font-medium">Email:</span>
                                <span>{data.email}</span>
                            </div>
                        )}
                        <div className="border-t border-slate-200 my-2"></div>
                        <div className="flex justify-between">
                            <span className="font-medium">Phòng khám:</span>
                            <span className="text-right">
                                {selectedClinic?.name}
                            </span>
                        </div>
                        {selectedService && (
                            <div className="flex justify-between">
                                <span className="font-medium">Dịch vụ:</span>
                                <span>{selectedService.name}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="font-medium">Bác sĩ:</span>
                            <span>{selectedDoctor?.fullName}</span>
                        </div>
                        <div className="border-t border-slate-200 my-2"></div>
                        <div className="flex justify-between">
                            <span className="font-medium">Ngày:</span>
                            <span>
                                {data.selectedSlot
                                    ? formatDate(data.selectedSlot.startAt)
                                    : '-'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Giờ:</span>
                            <span>
                                {data.selectedSlot
                                    ? `${formatTime(
                                          data.selectedSlot.startAt
                                      )} - ${formatTime(
                                          data.selectedSlot.endAt
                                      )}`
                                    : '-'}
                            </span>
                        </div>
                        {isAuthenticated && (
                            <>
                                <div className="border-t border-slate-200 my-2"></div>
                                <div className="flex items-center gap-2 text-blue-600">
                                    <svg
                                        className="w-4 h-4"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="text-xs">
                                        Lịch hẹn sẽ được lưu vào hồ sơ của bạn
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex justify-between gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onPrev}
                        className="w-1/2 rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        disabled={loading}
                    >
                        Quay lại
                    </button>
                    <button
                        type="submit"
                        className="w-1/2 rounded-lg bg-[#2563EB] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? 'Đang xử lý...' : 'Xác nhận đặt lịch'}
                    </button>
                </div>
            </form>
        </>
    );
};
