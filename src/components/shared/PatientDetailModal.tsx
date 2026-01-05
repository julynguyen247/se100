import React from "react";
import { FiX, FiUser, FiPhone, FiMail, FiCalendar, FiFileText, FiClock } from "react-icons/fi";

type MedicalRecord = {
    date: string;
    service: string;
    doctor: string;
    diagnosis: string;
};

type Patient = {
    id: number;
    name: string;
    phone: string;
    email?: string;
    dob?: string;
    gender?: string;
    address?: string;
    lastVisit: string;
    totalVisits: number;
    medicalHistory?: MedicalRecord[];
};

interface PatientDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    patient: Patient | null;
}

const PatientDetailModal: React.FC<PatientDetailModalProps> = ({
    isOpen,
    onClose,
    patient,
}) => {
    if (!isOpen || !patient) return null;

    // Mock medical history if not provided
    const medicalHistory = patient.medicalHistory || [
        { date: "10/12/2024", service: "Trám răng", doctor: "BS. Lê Văn C", diagnosis: "Sâu răng hàm số 6" },
        { date: "22/11/2024", service: "Khám tổng quát", doctor: "BS. Nguyễn Văn A", diagnosis: "Răng miệng khỏe mạnh" },
        { date: "5/10/2024", service: "Lấy cao răng", doctor: "BS. Trần Thị B", diagnosis: "Cao răng nhẹ" },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]">
                    <h2 className="text-lg font-semibold text-white">Hồ sơ bệnh nhân</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-white/20 rounded-lg transition"
                    >
                        <FiX className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                    {/* Patient Info Card */}
                    <div className="bg-slate-50 rounded-xl p-5">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-[#E0ECFF] rounded-full flex items-center justify-center">
                                <FiUser className="w-7 h-7 text-[#2563EB]" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-slate-900">{patient.name}</h3>
                                <div className="mt-2 grid grid-cols-2 gap-3">
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <FiPhone className="w-4 h-4 text-slate-400" />
                                        <span>{patient.phone}</span>
                                    </div>
                                    {patient.email && (
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <FiMail className="w-4 h-4 text-slate-400" />
                                            <span>{patient.email}</span>
                                        </div>
                                    )}
                                    {patient.dob && (
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <FiCalendar className="w-4 h-4 text-slate-400" />
                                            <span>Ngày sinh: {patient.dob}</span>
                                        </div>
                                    )}
                                    {patient.gender && (
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <FiUser className="w-4 h-4 text-slate-400" />
                                            <span>Giới tính: {patient.gender}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-[#2563EB] mb-1">
                                <FiCalendar className="w-4 h-4" />
                                <span className="text-xs font-medium">Lần khám cuối</span>
                            </div>
                            <p className="text-sm font-semibold text-slate-900">{patient.lastVisit}</p>
                        </div>
                        <div className="bg-emerald-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-emerald-600 mb-1">
                                <FiFileText className="w-4 h-4" />
                                <span className="text-xs font-medium">Tổng số lần khám</span>
                            </div>
                            <p className="text-sm font-semibold text-slate-900">{patient.totalVisits} lần</p>
                        </div>
                    </div>

                    {/* Medical History */}
                    <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                            <FiFileText className="w-4 h-4 text-[#2563EB]" />
                            Lịch sử khám bệnh
                        </h4>
                        <div className="space-y-3">
                            {medicalHistory.map((record, index) => (
                                <div
                                    key={index}
                                    className="bg-white border border-slate-100 rounded-xl p-4 hover:shadow-sm transition"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{record.service}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{record.doctor}</p>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                            <FiClock className="w-3.5 h-3.5" />
                                            {record.date}
                                        </div>
                                    </div>
                                    <div className="mt-2 bg-blue-50 rounded-lg px-3 py-2">
                                        <p className="text-xs text-slate-700">
                                            <span className="font-medium">Chẩn đoán:</span> {record.diagnosis}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t bg-slate-50">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PatientDetailModal;
