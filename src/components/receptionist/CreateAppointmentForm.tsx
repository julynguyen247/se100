import { useState, useEffect } from 'react';
import {
    createAppointment,
    getClinics,
    getServices,
    getDoctors,
    type CreateAppointmentRequest,
    type ClinicDto,
    type ServiceDto,
    type DoctorDto,
} from '@/services/apiReceptionist';
import { getSlots, type SlotDto } from '@/services/apiPatient';

interface CreateAppointmentFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function CreateAppointmentForm({
    onSuccess,
    onCancel,
}: CreateAppointmentFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Dropdown options
    const [clinics, setClinics] = useState<ClinicDto[]>([]);
    const [services, setServices] = useState<ServiceDto[]>([]);
    const [doctors, setDoctors] = useState<DoctorDto[]>([]);
    const [slots, setSlots] = useState<SlotDto[]>([]);

    // Loading states
    const [loadingClinics, setLoadingClinics] = useState(false);
    const [loadingServices, setLoadingServices] = useState(false);
    const [loadingDoctors, setLoadingDoctors] = useState(false);
    const [loadingSlots, setLoadingSlots] = useState(false);

    const [formData, setFormData] = useState<CreateAppointmentRequest>({
        patientName: '',
        phone: '',
        serviceId: '',
        doctorId: '',
        clinicId: '',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        duration: 30,
        notes: '',
    });

    // Fetch clinics on mount
    useEffect(() => {
        fetchClinics();
    }, []);

    // Fetch services when clinic changes
    useEffect(() => {
        if (formData.clinicId) {
            fetchServices(formData.clinicId);
        } else {
            setServices([]);
            setDoctors([]);
            setFormData(prev => ({ ...prev, serviceId: '', doctorId: '' }));
        }
    }, [formData.clinicId]);

    // Fetch doctors when clinic OR service changes
    useEffect(() => {
        if (formData.clinicId && formData.serviceId) {
            // Fetch doctors that offer the selected service
            fetchDoctors(formData.clinicId, formData.serviceId);
        } else if (formData.clinicId) {
            // Fetch all doctors for the clinic
            fetchDoctors(formData.clinicId);
        } else {
            setDoctors([]);
        }
        // Clear doctor selection when service changes
        setFormData(prev => ({ ...prev, doctorId: '' }));
    }, [formData.clinicId, formData.serviceId]);

    // Fetch slots when doctor, date, or service changes
    useEffect(() => {
        if (formData.clinicId && formData.doctorId && formData.date) {
            fetchSlots(formData.clinicId, formData.doctorId, formData.date, formData.serviceId);
        } else {
            setSlots([]);
        }
    }, [formData.clinicId, formData.doctorId, formData.date, formData.serviceId]);

    // Auto-fill duration when service changes
    useEffect(() => {
        if (formData.serviceId) {
            const selectedService = services.find(s => s.serviceId === formData.serviceId);
            if (selectedService?.defaultDurationMin) {
                setFormData(prev => ({ ...prev, duration: selectedService.defaultDurationMin || 30 }));
            }
        }
    }, [formData.serviceId, services]);

    const fetchClinics = async () => {
        try {
            setLoadingClinics(true);
            const result = await getClinics();
            if (result.isSuccess && result.data) {
                setClinics(result.data);
            }
        } catch (err) {
            console.error('Error fetching clinics:', err);
        } finally {
            setLoadingClinics(false);
        }
    };

    const fetchServices = async (clinicId: string) => {
        try {
            setLoadingServices(true);
            const result = await getServices(clinicId);
            if (result.isSuccess && result.data) {
                setServices(result.data);
            }
        } catch (err) {
            console.error('Error fetching services:', err);
        } finally {
            setLoadingServices(false);
        }
    };

    const fetchDoctors = async (clinicId: string, serviceId?: string) => {
        try {
            setLoadingDoctors(true);
            const result = await getDoctors(clinicId, serviceId);
            if (result.isSuccess && result.data) {
                setDoctors(result.data);
            }
        } catch (err) {
            console.error('Error fetching doctors:', err);
        } finally {
            setLoadingDoctors(false);
        }
    };

    const fetchSlots = async (clinicId: string, doctorId: string, date: string, serviceId?: string) => {
        try {
            setLoadingSlots(true);
            const result = await getSlots(clinicId, doctorId, date, serviceId);
            if (result.isSuccess && result.data) {
                setSlots(result.data);
            }
        } catch (err) {
            console.error('Error fetching slots:', err);
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'duration' ? parseInt(value) || 30 : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!formData.patientName.trim()) {
            setError('Vui lòng nhập tên bệnh nhân');
            return;
        }
        if (!formData.phone.trim()) {
            setError('Vui lòng nhập số điện thoại');
            return;
        }
        if (!formData.clinicId) {
            setError('Vui lòng chọn phòng khám');
            return;
        }
        if (!formData.serviceId) {
            setError('Vui lòng chọn dịch vụ');
            return;
        }
        if (!formData.doctorId) {
            setError('Vui lòng chọn bác sĩ');
            return;
        }

        try {
            setLoading(true);
            const result = await createAppointment(formData);

            if (result.isSuccess && result.data) {
                alert('✅ Tạo lịch hẹn thành công!');
                // Reset form
                setFormData({
                    patientName: '',
                    phone: '',
                    serviceId: '',
                    doctorId: '',
                    clinicId: '',
                    date: new Date().toISOString().split('T')[0],
                    time: '09:00',
                    duration: 30,
                    notes: '',
                });
                onSuccess?.();
            }
        } catch (err: any) {
            console.error('Error creating appointment:', err);
            setError(err.message || 'Có lỗi xảy ra khi tạo lịch hẹn');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-6">Tạo lịch hẹn mới</h2>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Patient Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên bệnh nhân <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="patientName"
                        value={formData.patientName}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="Nguyễn Văn A"
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="0901234567"
                    />
                </div>

                {/* Clinic Dropdown */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phòng khám <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="clinicId"
                        value={formData.clinicId}
                        onChange={handleChange}
                        required
                        disabled={loadingClinics}
                        className="w-full border border-gray-300 rounded px-3 py-2 disabled:bg-gray-100"
                    >
                        <option value="">
                            {loadingClinics ? 'Đang tải...' : '-- Chọn phòng khám --'}
                        </option>
                        {clinics.map((clinic) => (
                            <option key={clinic.clinicId} value={clinic.clinicId}>
                                {clinic.name} ({clinic.code})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Service Dropdown */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dịch vụ <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="serviceId"
                        value={formData.serviceId}
                        onChange={handleChange}
                        required
                        disabled={!formData.clinicId || loadingServices}
                        className="w-full border border-gray-300 rounded px-3 py-2 disabled:bg-gray-100"
                    >
                        <option value="">
                            {!formData.clinicId
                                ? '-- Chọn phòng khám trước --'
                                : loadingServices
                                    ? 'Đang tải...'
                                    : '-- Chọn dịch vụ --'}
                        </option>
                        {services.map((service) => (
                            <option key={service.serviceId} value={service.serviceId}>
                                {service.name} ({service.defaultDurationMin || 30} phút)
                            </option>
                        ))}
                    </select>
                </div>

                {/* Doctor Dropdown */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bác sĩ <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="doctorId"
                        value={formData.doctorId}
                        onChange={handleChange}
                        required
                        disabled={!formData.clinicId || loadingDoctors}
                        className="w-full border border-gray-300 rounded px-3 py-2 disabled:bg-gray-100"
                    >
                        <option value="">
                            {!formData.clinicId
                                ? '-- Chọn phòng khám trước --'
                                : !formData.serviceId
                                    ? '-- Chọn dịch vụ trước --'
                                    : loadingDoctors
                                        ? 'Đang tải...'
                                        : doctors.length === 0
                                            ? '-- Không có bác sĩ nào --'
                                            : '-- Chọn bác sĩ --'}
                        </option>
                        {doctors.map((doctor) => (
                            <option key={doctor.doctorId} value={doctor.doctorId}>
                                {doctor.fullName} {doctor.specialty ? `- ${doctor.specialty}` : ''}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày khám <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>

                {/* Time Slots */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Khung giờ <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        disabled={!formData.doctorId || !formData.date || loadingSlots}
                        className="w-full border border-gray-300 rounded px-3 py-2 disabled:bg-gray-100"
                    >
                        <option value="">
                            {!formData.doctorId || !formData.date
                                ? '-- Chọn bác sĩ và ngày trước --'
                                : loadingSlots
                                    ? 'Đang tải khung giờ...'
                                    : slots.length === 0
                                        ? '-- Không còn khung giờ trống --'
                                        : '-- Chọn khung giờ --'}
                        </option>
                        {slots.map((slot, index) => {
                            const startTime = new Date(slot.startAt).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                            });
                            const endTime = new Date(slot.endAt).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                            });
                            return (
                                <option key={index} value={startTime}>
                                    {startTime} - {endTime}
                                </option>
                            );
                        })}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                        Chỉ hiển thị khung giờ còn trống
                    </p>
                </div>

                {/* Duration */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thời gian (phút)
                    </label>
                    <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        min={15}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Tự động cập nhật khi chọn dịch vụ
                    </p>
                </div>
            </div>

            {/* Notes */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú
                </label>
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Ghi chú thêm (nếu có)..."
                />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? 'Đang tạo...' : 'Tạo lịch hẹn'}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                    >
                        Hủy
                    </button>
                )}
            </div>
        </form>
    );
}
