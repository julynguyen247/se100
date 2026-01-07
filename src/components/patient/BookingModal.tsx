import React, { useState, useEffect } from "react";
import { FiX, FiCalendar, FiUser, FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import {
    getClinics, getServices, getDoctors, getSlots, createBooking,
    ClinicDto, ServiceDto, DoctorDto, SlotDto
} from "@/services/apiPatient";
import dayjs from "dayjs";

type Step = 1 | 2 | 3 | 4;

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (data: any) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const [step, setStep] = useState<Step>(1);
    const [isLoading, setIsLoading] = useState(false);

    // Data & Selection State
    const [clinics, setClinics] = useState<ClinicDto[]>([]);
    const [services, setServices] = useState<ServiceDto[]>([]);
    const [doctors, setDoctors] = useState<DoctorDto[]>([]);
    const [slots, setSlots] = useState<SlotDto[]>([]);

    const [selectedClinic, setSelectedClinic] = useState<ClinicDto | null>(null);
    const [selectedService, setSelectedService] = useState<ServiceDto | null>(null);
    const [selectedDoctor, setSelectedDoctor] = useState<DoctorDto | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedSlot, setSelectedSlot] = useState<SlotDto | null>(null);

    const [patientInfo, setPatientInfo] = useState({
        fullName: "",
        phone: "",
        email: "",
        note: ""
    });

    // Reset flow when opening
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            fetchClinics();
            // Reset selections
            setSelectedClinic(null);
            setSelectedService(null);
            setSelectedDoctor(null);
            setSelectedDate("");
            setSelectedSlot(null);
            setSlots([]);
        }
    }, [isOpen]);

    // Cleanup when clinic changes
    useEffect(() => {
        setSelectedService(null);
        setSelectedDoctor(null);
        setSelectedDate("");
        setSelectedSlot(null);
        setSlots([]);
        setDoctors([]); // Clear doctors too
    }, [selectedClinic]);

    // Refetch doctors when service changes
    useEffect(() => {
        if (selectedClinic && selectedService) {
            fetchDoctorsForService(selectedClinic.clinicId, selectedService.serviceId);
        }
        // Clear doctor selection when service changes
        setSelectedDoctor(null);
    }, [selectedService]);

    const fetchClinics = async () => {
        try {
            const res = await getClinics();
            if (res.isSuccess) {
                setClinics(res.data || []);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchServicesAndDoctors = async (clinicId: string) => {
        setIsLoading(true);
        try {
            const sRes = await getServices(clinicId);
            if (sRes.isSuccess) setServices(sRes.data || []);
            // Don't fetch doctors yet - wait for service selection
            setDoctors([]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDoctorsForService = async (clinicId: string, serviceId: string) => {
        setIsLoading(true);
        try {
            const dRes = await getDoctors(clinicId, serviceId);
            if (dRes.isSuccess) setDoctors(dRes.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSlots = async () => {
        if (!selectedClinic || !selectedDoctor || !selectedDate) return;
        setIsLoading(true);
        try {
            const res = await getSlots(
                selectedClinic.clinicId,
                selectedDoctor.doctorId,
                dayjs(selectedDate).format("YYYY-MM-DD"),
                selectedService?.serviceId
            );
            if (res.isSuccess) {
                setSlots(res.data || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Effect to fetch services/doctors when clinic is selected
    useEffect(() => {
        if (selectedClinic) {
            fetchServicesAndDoctors(selectedClinic.clinicId);
        }
    }, [selectedClinic]);

    // Effect to fetch slots when doctor/date changes
    useEffect(() => {
        if (selectedDate && selectedDoctor) {
            fetchSlots();
        }
    }, [selectedDate, selectedDoctor]);


    const handleConfirmBooking = async () => {
        if (!selectedClinic || !selectedDoctor || !selectedSlot) return;

        setIsLoading(true);
        try {
            const response = await createBooking({
                clinicId: selectedClinic.clinicId,
                doctorId: selectedDoctor.doctorId,
                serviceId: selectedService?.serviceId,
                patientId: localStorage.getItem("id") || undefined,
                startAt: selectedSlot.startAt,
                endAt: selectedSlot.endAt,
                fullName: patientInfo.fullName,
                phone: patientInfo.phone,
                email: patientInfo.email,
                notes: patientInfo.note
            });

            if (response.isSuccess) {
                alert("Đặt lịch thành công! Vui lòng kiểm tra email.");
                onSubmit?.(response.data);
                onClose();
            } else {
                alert(response.message || "Đặt lịch thất bại");
            }
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || "Đã xảy ra lỗi");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Đặt lịch khám</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${step >= 1 ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-slate-100 text-slate-500'}`}>1. Cơ sở</span>
                            <span className="text-slate-300">/</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${step >= 2 ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-slate-100 text-slate-500'}`}>2. Dịch vụ</span>
                            <span className="text-slate-300">/</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${step >= 3 ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-slate-100 text-slate-500'}`}>3. Thời gian</span>
                            <span className="text-slate-300">/</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${step >= 4 ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-slate-100 text-slate-500'}`}>4. Thông tin</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition">
                        <FiX className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 grow space-y-6">
                    {/* STEP 1: Select Clinic */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-800">Chọn phòng khám</h3>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {clinics.map(clinic => (
                                    <div
                                        key={clinic.clinicId}
                                        onClick={() => setSelectedClinic(clinic)}
                                        className={`p-4 rounded-xl border text-left cursor-pointer transition-all hover:shadow-md ${selectedClinic?.clinicId === clinic.clinicId
                                            ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                                            : 'border-slate-200 hover:border-blue-300'
                                            }`}
                                    >
                                        <div className="font-medium text-slate-900">{clinic.name}</div>
                                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                            <FiMapPin className="w-3 h-3" /> {clinic.email || "Đang cập nhật"}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Select Service & Doctor */}
                    {step === 2 && (
                        <div className="space-y-6">
                            {/* Services */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-slate-800">Chọn dịch vụ</h3>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {services.map(svc => (
                                        <div
                                            key={svc.serviceId}
                                            onClick={() => setSelectedService(svc)}
                                            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${selectedService?.serviceId === svc.serviceId
                                                ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                                                : 'border-slate-200 hover:border-blue-300'
                                                }`}
                                        >
                                            <div className="text-sm font-medium text-slate-900">{svc.name}</div>
                                            <div className="text-xs text-slate-500 mt-1">
                                                {svc.defaultPrice?.toLocaleString()} đ • {svc.defaultDurationMin} phút
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Doctors */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-slate-800">Chọn bác sĩ</h3>
                                {!selectedService ? (
                                    <div className="text-center py-6 bg-slate-50 rounded-xl">
                                        <p className="text-sm text-slate-500">Vui lòng chọn dịch vụ trước</p>
                                    </div>
                                ) : isLoading ? (
                                    <div className="text-center py-6">
                                        <p className="text-sm text-slate-500">Đang tải danh sách bác sĩ...</p>
                                    </div>
                                ) : doctors.length === 0 ? (
                                    <div className="text-center py-6 bg-amber-50 rounded-xl">
                                        <p className="text-sm text-amber-700">Không có bác sĩ nào cung cấp dịch vụ này</p>
                                    </div>
                                ) : (
                                    <div className="grid sm:grid-cols-2 gap-3">
                                        {doctors.map(doc => (
                                            <div
                                                key={doc.doctorId}
                                                onClick={() => setSelectedDoctor(doc)}
                                                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${selectedDoctor?.doctorId === doc.doctorId
                                                    ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                                                    : 'border-slate-200 hover:border-blue-300'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                                        <FiUser />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-slate-900">{doc.fullName}</div>
                                                        <div className="text-xs text-slate-500">{doc.specialty || "Bác sĩ"}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Time Selection */}
                    {step === 3 && (
                        <div className="space-y-6">
                            {/* Date Picker */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Ngày khám</label>
                                <div className="relative">
                                    <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="date"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                        min={new Date().toISOString().split('T')[0]}
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Slot Grid */}
                            {selectedDate && (
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-slate-800">Giờ khám còn trống</h3>
                                    {isLoading ? (
                                        <div className="text-center py-4 text-slate-500 text-sm">Đang tải lịch...</div>
                                    ) : slots.length === 0 ? (
                                        <div className="text-center py-4 text-slate-500 text-sm bg-slate-50 rounded-lg">Không có lịch trống cho ngày này</div>
                                    ) : (
                                        <div className="grid grid-cols-4 gap-2">
                                            {slots.map((slot, idx) => {
                                                const timeLabel = dayjs(slot.startAt).format("HH:mm");
                                                const isSelected = selectedSlot?.startAt === slot.startAt;
                                                return (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setSelectedSlot(slot)}
                                                        className={`py-2 text-sm rounded-lg border transition-all ${isSelected
                                                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                                            : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
                                                            }`}
                                                    >
                                                        {timeLabel}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 4: Personal Info */}
                    {step === 4 && (
                        <div className="space-y-5">
                            <div className="bg-blue-50 p-4 rounded-xl space-y-2 text-sm">
                                <div className="font-semibold text-blue-900 border-b border-blue-100 pb-2 mb-2">Thông tin đặt khám</div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Cơ sở:</span>
                                    <span className="font-medium text-slate-900">{selectedClinic?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Dịch vụ:</span>
                                    <span className="font-medium text-slate-900">{selectedService ? selectedService.name : "Khám bệnh"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Bác sĩ:</span>
                                    <span className="font-medium text-slate-900">{selectedDoctor?.fullName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Thời gian:</span>
                                    <span className="font-medium text-slate-900">
                                        {selectedSlot && dayjs(selectedSlot.startAt).format("HH:mm DD/MM/YYYY")}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-slate-700">Họ và tên *</label>
                                        <div className="relative">
                                            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={patientInfo.fullName}
                                                onChange={e => setPatientInfo({ ...patientInfo, fullName: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-slate-700">Số điện thoại *</label>
                                        <div className="relative">
                                            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={patientInfo.phone}
                                                onChange={e => setPatientInfo({ ...patientInfo, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-700">Email</label>
                                    <div className="relative">
                                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="email"
                                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={patientInfo.email}
                                            onChange={e => setPatientInfo({ ...patientInfo, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-700">Ghi chú</label>
                                    <textarea
                                        rows={2}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={patientInfo.note}
                                        onChange={e => setPatientInfo({ ...patientInfo, note: e.target.value })}
                                        placeholder="Triệu chứng hoặc yêu cầu đặc biệt..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="px-6 py-4 border-t bg-slate-50 flex gap-3 shrink-0">
                    {step > 1 && (
                        <button
                            onClick={() => setStep(prev => (prev - 1) as Step)}
                            className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition"
                        >
                            Quay lại
                        </button>
                    )}

                    <button
                        onClick={() => {
                            if (step === 1 && selectedClinic) setStep(2);
                            else if (step === 2 && selectedDoctor) setStep(3);
                            else if (step === 3 && selectedSlot) setStep(4);
                            else if (step === 4) handleConfirmBooking();
                        }}
                        disabled={
                            (step === 1 && !selectedClinic) ||
                            (step === 2 && !selectedDoctor) ||
                            (step === 3 && !selectedSlot) ||
                            (step === 4 && (!patientInfo.fullName || !patientInfo.phone || isLoading))
                        }
                        className="flex-1 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {step === 4 ? (isLoading ? "Đang xử lý..." : "Xác nhận đặt lịch") : "Tiếp tục"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
