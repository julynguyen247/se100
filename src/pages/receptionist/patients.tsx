import React, { useState, useEffect } from "react";
import { FiSearch, FiUser, FiCalendar, FiFileText, FiEye, FiPlus } from "react-icons/fi";
import { getPatients, type PatientListItem } from "@/services/apiReceptionist";
import PatientDetailModal from "../../components/shared/PatientDetailModal";
import CreatePatientModal from "../../components/receptionist/CreatePatientModal";
import { toast } from "sonner";

const ReceptionistPatients: React.FC = () => {
    const [search, setSearch] = useState("");
    const [patients, setPatients] = useState<PatientListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async (searchTerm?: string) => {
        try {
            setLoading(true);
            setError(null);

            const result = await getPatients(searchTerm, undefined);

            if (result.isSuccess && result.data) {
                setPatients(result.data);
            } else {
                setError(result.message || 'Có lỗi xảy ra khi tải danh sách bệnh nhân');
            }
        } catch (err: any) {
            console.error('Error fetching patients:', err);
            setError('Có lỗi xảy ra khi tải danh sách bệnh nhân');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchPatients(value || undefined);
        }, 500);
        return () => clearTimeout(timeoutId);
    };

    const handleViewPatient = (patientId: string) => {
        setSelectedPatientId(patientId);
        setIsDetailModalOpen(true);
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedPatientId(null);
    };

    const handleCreateSuccess = () => {
        fetchPatients(search || undefined);
    };

    const handleUpdateSuccess = () => {
        fetchPatients(search || undefined);
    };

    if (loading) {
        return (
            <div className="px-6 py-8 lg:px-10">
                <div className="max-w-[1200px] mx-auto flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mb-4"></div>
                        <p className="text-slate-600">Đang tải danh sách bệnh nhân...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-6 py-8 lg:px-10">
                <div className="max-w-[1200px] mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                        <p className="text-red-700 font-semibold mb-2">Lỗi tải dữ liệu</p>
                        <p className="text-red-600 text-sm">{error}</p>
                        <button
                            onClick={() => fetchPatients()}
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <span className="inline-flex items-center rounded-full bg-[#E0ECFF] text-[#2563EB] text-[11px] font-semibold px-4 py-1.5 tracking-wide uppercase mb-3">
                            PATIENT RECORDS
                        </span>
                        <h1 className="text-xl font-semibold text-slate-900">Hồ sơ bệnh nhân</h1>
                        <p className="text-sm text-slate-500 mt-1">Quản lý thông tin bệnh nhân</p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#2563EB] text-white text-sm font-semibold rounded-lg hover:bg-[#1D4ED8]"
                    >
                        <FiPlus className="w-4 h-4" />
                        Thêm bệnh nhân
                    </button>
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên, số điện thoại, email hoặc mã BN..."
                        className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#2563EB]"
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>

                {/* Patients Table */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {patients.length === 0 ? (
                        <div className="text-center py-12">
                            <FiUser className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-sm text-slate-500">
                                {search ? 'Không tìm thấy bệnh nhân phù hợp' : 'Chưa có bệnh nhân nào'}
                            </p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="text-left text-xs font-semibold text-slate-600 px-6 py-4">Bệnh nhân</th>
                                    <th className="text-left text-xs font-semibold text-slate-600 px-6 py-4">Số điện thoại</th>
                                    <th className="text-left text-xs font-semibold text-slate-600 px-6 py-4">Email</th>
                                    <th className="text-left text-xs font-semibold text-slate-600 px-6 py-4">Lần khám cuối</th>
                                    <th className="text-left text-xs font-semibold text-slate-600 px-6 py-4">Số lần khám</th>
                                    <th className="text-left text-xs font-semibold text-slate-600 px-6 py-4">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.map((patient) => (
                                    <tr key={patient.id} className="border-b border-slate-50 hover:bg-slate-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-[#E0ECFF] rounded-full flex items-center justify-center">
                                                    <FiUser className="w-4 h-4 text-[#2563EB]" />
                                                </div>
                                                <span className="text-sm font-medium text-slate-900">{patient.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{patient.phone}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{patient.email || '-'}</td>
                                        <td className="px-6 py-4">
                                            {patient.lastVisit ? (
                                                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                                    <FiCalendar className="w-3.5 h-3.5" />
                                                    {patient.lastVisit}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-slate-400">Chưa có</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                                <FiFileText className="w-3.5 h-3.5" />
                                                {patient.totalVisits} lần
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleViewPatient(patient.id)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-[#2563EB] text-xs font-medium rounded-lg hover:bg-blue-100"
                                            >
                                                <FiEye className="w-3.5 h-3.5" />
                                                Xem hồ sơ
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Patient Detail Modal */}
            <PatientDetailModal
                isOpen={isDetailModalOpen}
                onClose={handleCloseDetailModal}
                patientId={selectedPatientId}
                onUpdate={handleUpdateSuccess}
            />

            {/* Create Patient Modal */}
            <CreatePatientModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />
        </div>
    );
};

export default ReceptionistPatients;
