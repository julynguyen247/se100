import React, { useState } from "react";
import { FiSearch, FiCalendar, FiFileText } from "react-icons/fi";

type MedicalRecord = {
  id: number;
  title: string;
  doctor: string;
  date: string;
  diagnosis: string;
};

const RECORDS: MedicalRecord[] = [
  {
    id: 1,
    title: "Trám răng",
    doctor: "BS. Lê Văn C",
    date: "10/12/2024",
    diagnosis: "Sâu răng hàm số 6 bên phải",
  },
  {
    id: 2,
    title: "Khám tổng quát",
    doctor: "BS. Nguyễn Văn A",
    date: "22/11/2024",
    diagnosis: "Răng miệng khỏe mạnh, có cao răng nhẹ",
  },
  {
    id: 3,
    title: "Tư vấn niềng răng",
    doctor: "BS. Trần Thị B",
    date: "15/10/2024",
    diagnosis: "Răng khấp khểnh nhẹ, cân chỉnh nha",
  },
  {
    id: 4,
    title: "Nhổ răng khôn",
    doctor: "BS. Lê Văn C",
    date: "5/9/2024",
    diagnosis: "Răng khôn hàm dưới bên trái mọc lệch",
  },
];

const MedicalHistoryPage: React.FC = () => {
  const [query, setQuery] = useState("");

  const filtered = RECORDS.filter(
    (r) =>
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.diagnosis.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F5F7FB] px-6 py-8 sm:px-10 lg:px-20">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <span className="inline-flex items-center justify-center rounded-full bg-[#E0ECFF] text-[#2563EB] text-[11px] font-semibold px-5 py-1.5 tracking-[0.16em] uppercase mb-3">
            MEDICAL HISTORY
          </span>
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
            Hồ sơ bệnh án
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Lịch sử điều trị và hồ sơ y tế của bạn
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm kiếm hồ sơ..."
            className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/60"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* List records */}
        <div className="space-y-4">
          {filtered.map((record) => (
            <MedicalRecordCard key={record.id} record={record} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicalHistoryPage;

/* -------- Card từng hồ sơ -------- */

const MedicalRecordCard: React.FC<{ record: MedicalRecord }> = ({ record }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-5 py-4 flex gap-4 items-stretch">
      {/* Icon bên trái */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-[#E0ECFF] text-[#2563EB] flex items-center justify-center">
          <FiFileText className="w-5 h-5" />
        </div>
      </div>

      {/* Nội dung */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {record.title}
            </p>
            <p className="text-xs text-slate-500">{record.doctor}</p>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <FiCalendar className="w-3.5 h-3.5" />
            <span>{record.date}</span>
          </div>
        </div>

        {/* Chẩn đoán */}
        <div className="mt-3 rounded-xl bg-[#EFF6FF] px-4 py-2 text-[11px] sm:text-xs text-slate-700">
          <span className="font-semibold">Chẩn đoán: </span>
          <span>{record.diagnosis}</span>
        </div>
      </div>
    </div>
  );
};
