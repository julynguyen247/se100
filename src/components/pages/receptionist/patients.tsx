import React, { useState } from "react";
import { FiSearch, FiUser, FiCalendar, FiFileText, FiEye, FiPlus } from "react-icons/fi";
import PatientDetailModal from "../../shared/PatientDetailModal";

type Patient = {
    id: number;
    name: string;
    phone: string;
    email: string;
    lastVisit: string;
    totalVisits: number;
};

const PATIENTS: Patient[] = [
    { id: 1, name: "Nguyễn Văn A", phone: "0901234567", email: "a@email.com", lastVisit: "10/12/2024", totalVisits: 5 },
    { id: 2, name: "Trần Thị B", phone: "0912345678", email: "b@email.com", lastVisit: "22/11/2024", totalVisits: 3 },
    { id: 3, name: "Lê Văn C", phone: "0923456789", email: "c@email.com", lastVisit: "5/11/2024", totalVisits: 8 },
    { id: 4, name: "Phạm Thị D", phone: "0934567890", email: "d@email.com", lastVisit: "1/10/2024", totalVisits: 2 },
];

const ReceptionistPatients: React.FC = () => {
    const [search, setSearch] = useState("");
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filtered = PATIENTS.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.phone.includes(search)
    );

    const handleViewPatient = (patient: Patient) => {
        setSelectedPatient(patient);
        setIsModalOpen(true);
    };

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
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-[#2563EB] text-white text-sm font-semibold rounded-lg hover:bg-[#1D4ED8]">
                        <FiPlus className="w-4 h-4" />
                        Thêm bệnh nhân
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

                {/* Patients Table */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
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
                            {filtered.map((patient) => (
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
                                    <td className="px-6 py-4 text-sm text-slate-600">{patient.email}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                            <FiCalendar className="w-3.5 h-3.5" />
                                            {patient.lastVisit}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                            <FiFileText className="w-3.5 h-3.5" />
                                            {patient.totalVisits} lần
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleViewPatient(patient)}
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
                </div>
            </div>

            {/* Patient Detail Modal */}
            <PatientDetailModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedPatient(null);
                }}
                patient={selectedPatient}
            />
        </div>
    );
};

export default ReceptionistPatients;
