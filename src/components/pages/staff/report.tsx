// src/pages/staff/StaffPatientRecordsPage.tsx
import React, { useMemo, useState } from "react";
import { FiSearch, FiFileText } from "react-icons/fi";
import PatientDetailModal from "@/components/staff/PatientDetailModal";

type PatientRecord = {
  id: string;
  name: string;
  phone: string;
  email: string;
  lastVisit: string;
  totalVisits: number;
};

const PATIENTS: PatientRecord[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    phone: "0123456789",
    email: "nguyenvana@email.com",
    lastVisit: "10/11/2024",
    totalVisits: 8,
  },
  {
    id: "2",
    name: "Trần Thị B",
    phone: "0987654321",
    email: "tranthib@email.com",
    lastVisit: "22/11/2024",
    totalVisits: 5,
  },
  {
    id: "3",
    name: "Lê Văn C",
    phone: "0912345678",
    email: "levanc@email.com",
    lastVisit: "15/10/2024",
    totalVisits: 3,
  },
];

const StaffPatientRecordsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(
    null
  );
  const [openDetail, setOpenDetail] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return PATIENTS;
    const q = search.toLowerCase();
    return PATIENTS.filter((p) =>
      `${p.name} ${p.phone} ${p.email}`.toLowerCase().includes(q)
    );
  }, [search]);

  const handleViewDetail = (patient: PatientRecord) => {
    setSelectedPatient(patient);
    setOpenDetail(true);
  };

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        {/* Tiêu đề */}
        <div>
          <h1 className="text-sm font-semibold text-slate-900">
            Hồ sơ bệnh nhân
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Tra cứu và quản lý hồ sơ bệnh án
          </p>
        </div>

        {/* Ô tìm kiếm */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, số điện thoại hoặc email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-9 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Danh sách bệnh nhân */}
        <div className="space-y-3 pb-6">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <FiFileText className="w-4 h-4" />
                </div>
                <div className="leading-snug">
                  <p className="text-sm font-semibold text-slate-900">
                    {p.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 flex flex-wrap gap-x-3 gap-y-1">
                    <span>{p.phone}</span>
                    <span>•</span>
                    <span>{p.email}</span>
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Lần khám gần nhất:{" "}
                    <span className="font-medium text-slate-500">
                      {p.lastVisit}
                    </span>{" "}
                    • Tổng:{" "}
                    <span className="font-medium text-slate-500">
                      {p.totalVisits} lần
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleViewDetail(p)}
                className="inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-xs px-4 py-1.5 hover:bg-blue-700"
              >
                Xem hồ sơ
              </button>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="text-xs text-slate-400 text-center pt-4">
              Không tìm thấy bệnh nhân phù hợp.
            </p>
          )}
        </div>
      </div>

      <PatientDetailModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        patient={
          selectedPatient
            ? {
                name: selectedPatient.name,
                phone: selectedPatient.phone,
                email: selectedPatient.email,
                totalVisits: selectedPatient.totalVisits,
              }
            : undefined
        }
        lastVisit={
          selectedPatient
            ? {
                date: selectedPatient.lastVisit,
              }
            : undefined
        }
      />
    </>
  );
};

export default StaffPatientRecordsPage;
