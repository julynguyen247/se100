import React, { useState, useEffect } from 'react';
import {
    FiSearch,
    FiUser,
    FiCalendar,
    FiFileText,
    FiEye,
    FiRefreshCw,
    FiX,
    FiPhone,
    FiMail,
    FiMapPin,
    FiAlertCircle,
    FiActivity,
} from 'react-icons/fi';
import {
    getPatients,
    getPatientDetail,
    getMedicalRecordDetail,
    DoctorPatientListItem,
    DoctorPatientDetail,
    DoctorMedicalRecordDetail,
} from '@/services/apiDoctor';

const DoctorPatients: React.FC = () => {
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [patients, setPatients] = useState<DoctorPatientListItem[]>([]);

    // Modal states
    const [selectedPatient, setSelectedPatient] =
        useState<DoctorPatientDetail | null>(null);
    const [selectedRecord, setSelectedRecord] =
        useState<DoctorMedicalRecordDetail | null>(null);
    const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
    const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getPatients();
            if (response.isSuccess && response.data) {
                setPatients(response.data);
            } else {
                setError(
                    response.message || 'Không thể tải danh sách bệnh nhân'
                );
            }
        } catch (err) {
            console.error('Error fetching patients:', err);
            setError('Lỗi kết nối server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleViewPatient = async (patientId: string) => {
        try {
            setModalLoading(true);
            setIsPatientModalOpen(true);
            const response = await getPatientDetail(patientId);
            if (response.isSuccess && response.data) {
                setSelectedPatient(response.data);
            } else {
                alert(response.message || 'Không thể tải thông tin bệnh nhân');
                setIsPatientModalOpen(false);
            }
        } catch (err) {
            console.error('Error fetching patient detail:', err);
            alert('Lỗi kết nối server');
            setIsPatientModalOpen(false);
        } finally {
            setModalLoading(false);
        }
    };

    const handleViewRecord = async (recordId: string) => {
        try {
            setModalLoading(true);
            setIsRecordModalOpen(true);
            const response = await getMedicalRecordDetail(recordId);
            if (response.isSuccess && response.data) {
                setSelectedRecord(response.data);
            } else {
                alert(response.message || 'Không thể tải hồ sơ bệnh án');
                setIsRecordModalOpen(false);
            }
        } catch (err) {
            console.error('Error fetching record detail:', err);
            alert('Lỗi kết nối server');
            setIsRecordModalOpen(false);
        } finally {
            setModalLoading(false);
        }
    };

    const formatDate = (isoString: string | null) => {
        if (!isoString) return 'N/A';
        return new Date(isoString).toLocaleDateString('vi-VN');
    };

    const filtered = patients.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.phone.includes(search)
    );

    if (loading) {
        return (
            <div className="px-6 py-8 lg:px-10">
                <div className="max-w-[1200px] mx-auto flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
                        <p className="mt-4 text-slate-500">
                            Đang tải danh sách bệnh nhân...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-6 py-8 lg:px-10">
                <div className="max-w-[1200px] mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <p className="text-red-600">{error}</p>
                        <button
                            onClick={fetchPatients}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="px-6 py-8 lg:px-10">
            <div className="max-w-[1200px] mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <span className="inline-flex items-center rounded-full bg-[#E0ECFF] text-[#2563EB] text-[11px] font-semibold px-4 py-1.5 tracking-wide uppercase mb-3">
                            PATIENT RECORDS
                        </span>
                        <h1 className="text-xl font-semibold text-slate-900">
                            Hồ sơ bệnh nhân
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Tra cứu và quản lý hồ sơ bệnh nhân
                        </p>
                    </div>
                    <button
                        onClick={fetchPatients}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[#2563EB] hover:bg-blue-50 rounded-lg transition"
                    >
                        <FiRefreshCw className="w-4 h-4" />
                        Làm mới
                    </button>
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên hoặc số điện thoại..."
                        className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#2563EB]"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Patients List */}
                {filtered.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-slate-400">
                        <FiUser className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Không tìm thấy bệnh nhân</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                        {filtered.map((patient) => (
                            <div
                                key={patient.id}
                                className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-[#E0ECFF] rounded-full flex items-center justify-center">
                                            <FiUser className="w-5 h-5 text-[#2563EB]" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-900">
                                                {patient.name}
                                            </h3>
                                            <p className="text-xs text-slate-500">
                                                {patient.phone}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() =>
                                            handleViewPatient(patient.id)
                                        }
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-[#2563EB] text-xs font-medium rounded-lg hover:bg-blue-100"
                                    >
                                        <FiEye className="w-3.5 h-3.5" />
                                        Xem hồ sơ
                                    </button>
                                </div>

                                <div className="mt-4 flex items-center gap-6 text-xs text-slate-500">
                                    <div className="flex items-center gap-1.5">
                                        <FiCalendar className="w-3.5 h-3.5" />
                                        <span>
                                            Lần khám cuối:{' '}
                                            {formatDate(patient.lastVisit)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <FiFileText className="w-3.5 h-3.5" />
                                        <span>
                                            {patient.totalVisits} lần khám
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Patient Detail Modal */}
            {isPatientModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Thông tin bệnh nhân
                            </h2>
                            <button
                                onClick={() => {
                                    setIsPatientModalOpen(false);
                                    setSelectedPatient(null);
                                }}
                                className="p-2 hover:bg-slate-100 rounded-lg"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                            {modalLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563EB]"></div>
                                </div>
                            ) : selectedPatient ? (
                                <div className="space-y-6">
                                    {/* Basic Info */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-[#E0ECFF] rounded-full flex items-center justify-center">
                                            <FiUser className="w-8 h-8 text-[#2563EB]" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-slate-900">
                                                {selectedPatient.name}
                                            </h3>
                                            <p className="text-sm text-slate-500">
                                                {selectedPatient.gender} •{' '}
                                                {formatDate(
                                                    selectedPatient.dob
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Contact Info */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <FiPhone className="w-4 h-4 text-slate-400" />
                                            {selectedPatient.phone}
                                        </div>
                                        {selectedPatient.email && (
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <FiMail className="w-4 h-4 text-slate-400" />
                                                {selectedPatient.email}
                                            </div>
                                        )}
                                        {selectedPatient.address && (
                                            <div className="flex items-center gap-2 text-sm text-slate-600 col-span-2">
                                                <FiMapPin className="w-4 h-4 text-slate-400" />
                                                {selectedPatient.address}
                                            </div>
                                        )}
                                    </div>

                                    {/* Medical Info */}
                                    {(selectedPatient.allergy ||
                                        selectedPatient.chronicDisease) && (
                                        <div className="bg-amber-50 rounded-xl p-4 space-y-2">
                                            {selectedPatient.allergy && (
                                                <div className="flex items-center gap-2 text-sm text-amber-700">
                                                    <FiAlertCircle className="w-4 h-4" />
                                                    <span>
                                                        Dị ứng:{' '}
                                                        {
                                                            selectedPatient.allergy
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                            {selectedPatient.chronicDisease && (
                                                <div className="flex items-center gap-2 text-sm text-amber-700">
                                                    <FiActivity className="w-4 h-4" />
                                                    <span>
                                                        Bệnh mãn tính:{' '}
                                                        {
                                                            selectedPatient.chronicDisease
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Medical History */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900 mb-3">
                                            Lịch sử khám bệnh
                                        </h4>
                                        {selectedPatient.medicalHistory
                                            .length === 0 ? (
                                            <p className="text-sm text-slate-400">
                                                Chưa có lịch sử khám bệnh
                                            </p>
                                        ) : (
                                            <div className="space-y-2">
                                                {selectedPatient.medicalHistory.map(
                                                    (record) => (
                                                        <div
                                                            key={record.id}
                                                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer"
                                                            onClick={() =>
                                                                handleViewRecord(
                                                                    record.id
                                                                )
                                                            }
                                                        >
                                                            <div>
                                                                <p className="text-sm font-medium text-slate-900">
                                                                    {
                                                                        record.service
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-slate-500">
                                                                    {formatDate(
                                                                        record.recordDate
                                                                    )}{' '}
                                                                    •{' '}
                                                                    {
                                                                        record.doctor
                                                                    }
                                                                </p>
                                                            </div>
                                                            <FiEye className="w-4 h-4 text-slate-400" />
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}

            {/* Medical Record Detail Modal */}
            {isRecordModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Chi tiết hồ sơ bệnh án
                            </h2>
                            <button
                                onClick={() => {
                                    setIsRecordModalOpen(false);
                                    setSelectedRecord(null);
                                }}
                                className="p-2 hover:bg-slate-100 rounded-lg"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                            {modalLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563EB]"></div>
                                </div>
                            ) : selectedRecord ? (
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900">
                                            {selectedRecord.title}
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            {formatDate(
                                                selectedRecord.recordDate
                                            )}{' '}
                                            • {selectedRecord.doctor}
                                        </p>
                                    </div>

                                    {selectedRecord.diagnosis && (
                                        <div>
                                            <p className="text-xs font-medium text-slate-500 mb-1">
                                                Chẩn đoán
                                            </p>
                                            <p className="text-sm text-slate-900">
                                                {selectedRecord.diagnosis}
                                            </p>
                                        </div>
                                    )}

                                    {selectedRecord.treatment && (
                                        <div>
                                            <p className="text-xs font-medium text-slate-500 mb-1">
                                                Điều trị
                                            </p>
                                            <p className="text-sm text-slate-900">
                                                {selectedRecord.treatment}
                                            </p>
                                        </div>
                                    )}

                                    {selectedRecord.prescription && (
                                        <div>
                                            <p className="text-xs font-medium text-slate-500 mb-1">
                                                Đơn thuốc
                                            </p>
                                            <p className="text-sm text-slate-900 whitespace-pre-line">
                                                {selectedRecord.prescription}
                                            </p>
                                        </div>
                                    )}

                                    {selectedRecord.notes && (
                                        <div>
                                            <p className="text-xs font-medium text-slate-500 mb-1">
                                                Ghi chú
                                            </p>
                                            <p className="text-sm text-slate-900">
                                                {selectedRecord.notes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorPatients;
