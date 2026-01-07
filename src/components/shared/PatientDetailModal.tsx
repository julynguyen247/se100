import React, { useState, useEffect } from "react";
import { FiX, FiUser, FiPhone, FiMail, FiCalendar, FiFileText, FiClock, FiEdit } from "react-icons/fi";
import { getPatientDetail, type PatientDetail } from "@/services/apiReceptionist";
import UpdatePatientModal from "../receptionist/UpdatePatientModal";

interface PatientDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    patientId: string | null;
    onUpdate?: () => void;
}

const PatientDetailModal: React.FC<PatientDetailModalProps> = ({
    isOpen,
    onClose,
    patientId,
    onUpdate
}) => {
    const [patient, setPatient] = useState<PatientDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        if (isOpen && patientId) {
            fetchPatientDetail();
        }
    }, [isOpen, patientId]);

    const fetchPatientDetail = async () => {
        if (!patientId) return;

        try {
            setLoading(true);
            const result = await getPatientDetail(patientId);

            if (result.isSuccess && result.data) {
                setPatient(result.data);
            }
        } catch (err) {
            console.error('Error fetching patient detail:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSuccess = () => {
        fetchPatientDetail(); // Refresh patient data
        if (onUpdate) onUpdate(); // Notify parent to refresh list
    };

    if (!isOpen) return null;

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/50" onClick={onClose} />
                <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 p-12">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mb-4"></div>
                        <p className="text-slate-600">Đang tải thông tin bệnh nhân...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/50" onClick={onClose} />
                <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 p-12">
                    <div className="text-center">
                        <p className="text-slate-600">Không tìm thấy thông tin bệnh nhân</p>
                        <button
                            onClick={onClose}
                            className="mt-4 px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
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
                                        {patient.address && (
                                            <div className="flex items-center gap-2 text-sm text-slate-600 col-span-2">
                                                <FiUser className="w-4 h-4 text-slate-400" />
                                                <span>Địa chỉ: {patient.address}</span>
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
                                <p className="text-sm font-semibold text-slate-900">
                                    {patient.lastVisit || 'Chưa có'}
                                </p>
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
                        {patient.medicalHistory && patient.medicalHistory.length > 0 && (
                            <div>
                                <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                    <FiFileText className="w-4 h-4 text-[#2563EB]" />
                                    Lịch sử khám bệnh
                                </h4>
                                <div className="space-y-3">
                                    {patient.medicalHistory.map((record) => (
                                        <div
                                            key={record.id}
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
                                            {record.diagnosis && (
                                                <div className="mt-2 bg-blue-50 rounded-lg px-3 py-2">
                                                    <p className="text-xs text-slate-700">
                                                        <span className="font-medium">Chẩn đoán:</span> {record.diagnosis}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recent Appointments */}
                        {patient.appointments && patient.appointments.length > 0 && (
                            <div>
                                <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                    <FiCalendar className="w-4 h-4 text-[#2563EB]" />
                                    Lịch hẹn gần đây
                                </h4>
                                <div className="space-y-2">
                                    {patient.appointments.map((apt) => (
                                        <div
                                            key={apt.id}
                                            className="bg-white border border-slate-100 rounded-lg p-3 flex items-center justify-between"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{apt.service}</p>
                                                <p className="text-xs text-slate-500">{apt.doctor}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-slate-600">{apt.date} - {apt.time}</p>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${apt.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                                        apt.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                                            apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                                'bg-slate-100 text-slate-700'
                                                    }`}>
                                                    {apt.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t bg-slate-50 flex gap-3">
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="flex-1 py-2.5 rounded-xl bg-[#2563EB] text-white text-sm font-medium hover:bg-[#1D4ED8] transition flex items-center justify-center gap-2"
                        >
                            <FiEdit className="w-4 h-4" />
                            Chỉnh sửa
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>

            {/* Update Patient Modal */}
            <UpdatePatientModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={handleUpdateSuccess}
                patient={patient}
            />
        </>
    );
};

export default PatientDetailModal;
