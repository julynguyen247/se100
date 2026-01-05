import React, { useState } from "react";
import { FiSearch, FiUser, FiCalendar, FiFileText, FiEye } from "react-icons/fi";
import PatientDetailModal from "../../shared/PatientDetailModal";

type Patient = {
    id: number;
    name: string;
    phone: string;
    email?: string;
    lastVisit: string;
    totalVisits: number;
};

const PATIENTS: Patient[] = [
    { id: 1, name: "Nguyễn Văn A", phone: "0901234567", email: "a@email.com", lastVisit: "10/12/2024", totalVisits: 5 },
    { id: 2, name: "Trần Thị B", phone: "0912345678", email: "b@email.com", lastVisit: "22/11/2024", totalVisits: 3 },
    { id: 3, name: "Lê Văn C", phone: "0923456789", email: "c@email.com", lastVisit: "5/11/2024", totalVisits: 8 },
    { id: 4, name: "Phạm Thị D", phone: "0934567890", email: "d@email.com", lastVisit: "1/10/2024", totalVisits: 2 },
];

const DoctorPatients: React.FC = () => {
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
                <div>
                    <span className="inline-flex items-center rounded-full bg-[#E0ECFF] text-[#2563EB] text-[11px] font-semibold px-4 py-1.5 tracking-wide uppercase mb-3">
                        PATIENT RECORDS
                    </span>
                    <h1 className="text-xl font-semibold text-slate-900">Hồ sơ bệnh nhân</h1>
                    <p className="text-sm text-slate-500 mt-1">Tra cứu và quản lý hồ sơ bệnh nhân</p>
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
                <div className="grid md:grid-cols-2 gap-4">
                    {filtered.map((patient) => (
                        <div key={patient.id} className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-[#E0ECFF] rounded-full flex items-center justify-center">
                                        <FiUser className="w-5 h-5 text-[#2563EB]" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-900">{patient.name}</h3>
                                        <p className="text-xs text-slate-500">{patient.phone}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleViewPatient(patient)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-[#2563EB] text-xs font-medium rounded-lg hover:bg-blue-100"
                                >
                                    <FiEye className="w-3.5 h-3.5" />
                                    Xem hồ sơ
                                </button>
                            </div>

                            <div className="mt-4 flex items-center gap-6 text-xs text-slate-500">
                                <div className="flex items-center gap-1.5">
                                    <FiCalendar className="w-3.5 h-3.5" />
                                    <span>Lần khám cuối: {patient.lastVisit}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <FiFileText className="w-3.5 h-3.5" />
                                    <span>{patient.totalVisits} lần khám</span>
                                </div>
                            </div>
                        </div>
                    ))}
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

export default DoctorPatients;
