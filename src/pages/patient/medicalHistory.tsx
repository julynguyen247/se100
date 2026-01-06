import React, { useState } from "react";
import { FiSearch, FiCalendar, FiFileText, FiDownload, FiChevronDown, FiChevronUp } from "react-icons/fi";

type MedicalRecord = {
  id: number;
  title: string;
  doctor: string;
  date: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  notes: string;
  attachments: string[];
};

const RECORDS: MedicalRecord[] = [
  {
    id: 1,
    title: "Trám răng",
    doctor: "BS. Lê Văn C",
    date: "10/12/2024",
    diagnosis: "Sâu răng hàm số 6 bên phải",
    treatment: "Trám răng composite",
    prescription: "Thuốc giảm đau Paracetamol 500mg, uống 3 lần/ngày sau ăn",
    notes: "Theo dõi sau 1 tuần. Hạn chế ăn đồ cứng trong 24h đầu.",
    attachments: ["Phim X-quang", "Đơn thuốc"],
  },
  {
    id: 2,
    title: "Khám tổng quát",
    doctor: "BS. Nguyễn Văn A",
    date: "22/11/2024",
    diagnosis: "Răng miệng khỏe mạnh, có cao răng nhẹ",
    treatment: "Vệ sinh răng miệng, lấy cao răng",
    prescription: "",
    notes: "Nên đánh răng 2 lần/ngày. Tái khám sau 6 tháng.",
    attachments: [],
  },
  {
    id: 3,
    title: "Tư vấn niềng răng",
    doctor: "BS. Trần Thị B",
    date: "15/10/2024",
    diagnosis: "Răng khấp khểnh nhẹ, cần chỉnh nha",
    treatment: "Tư vấn phương án niềng răng mắc cài",
    prescription: "",
    notes: "Bệnh nhân sẽ suy nghĩ và quay lại sau 1 tháng",
    attachments: ["Báo giá", "Phim panorama"],
  },
  {
    id: 4,
    title: "Nhổ răng khôn",
    doctor: "BS. Lê Văn C",
    date: "5/9/2024",
    diagnosis: "Răng khôn hàm dưới bên trái mọc lệch",
    treatment: "Nhổ răng khôn dưới hướng dẫn",
    prescription: "Kháng sinh Amoxicillin 500mg, giảm đau, súc miệng Chlorhexidine",
    notes: "Kiêng ăn cứng 3-5 ngày. Tái khám sau 7 ngày để tháo chỉ.",
    attachments: ["Phim X-quang", "Đơn thuốc", "Hướng dẫn chăm sóc"],
  },
];

const MedicalHistoryPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = RECORDS.filter(
    (r) =>
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.diagnosis.toLowerCase().includes(query.toLowerCase()) ||
      r.doctor.toLowerCase().includes(query.toLowerCase())
  );

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

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
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
              <FiFileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-sm font-semibold text-slate-900 mb-1">Không tìm thấy hồ sơ</h3>
              <p className="text-xs text-slate-500">
                Không có hồ sơ bệnh án nào phù hợp với tìm kiếm của bạn
              </p>
            </div>
          ) : (
            filtered.map((record) => (
              <MedicalRecordCard
                key={record.id}
                record={record}
                isExpanded={expandedId === record.id}
                onToggle={() => toggleExpand(record.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalHistoryPage;

/* -------- Card từng hồ sơ -------- */

interface MedicalRecordCardProps {
  record: MedicalRecord;
  isExpanded: boolean;
  onToggle: () => void;
}

const MedicalRecordCard: React.FC<MedicalRecordCardProps> = ({ record, isExpanded, onToggle }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header - Clickable */}
      <div className="p-5 cursor-pointer" onClick={onToggle}>
        <div className="flex gap-4 items-start">
          {/* Icon bên trái */}
          <div className="flex-shrink-0">
            <div className="w-11 h-11 rounded-full bg-[#E0ECFF] text-[#2563EB] flex items-center justify-center">
              <FiFileText className="w-5 h-5" />
            </div>
          </div>

          {/* Nội dung */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {record.title}
                </p>
                <p className="text-xs text-slate-500">{record.doctor}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <FiCalendar className="w-3.5 h-3.5" />
                  <span>{record.date}</span>
                </div>
                <div className="p-1 rounded-full hover:bg-slate-100 transition">
                  {isExpanded ? (
                    <FiChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <FiChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Chẩn đoán */}
            <div className="mt-3 rounded-xl bg-[#EFF6FF] px-4 py-2.5 text-xs text-slate-700">
              <span className="font-semibold text-slate-900">Chẩn đoán: </span>
              <span>{record.diagnosis}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chi tiết - Expandable */}
      {isExpanded && (
        <div className="border-t border-slate-100 bg-slate-50 px-5 py-5">
          <div className="ml-15 space-y-4">
            {/* Điều trị */}
            <div>
              <h4 className="text-xs font-semibold text-slate-900 mb-1.5">Điều trị</h4>
              <p className="text-xs text-slate-600">{record.treatment}</p>
            </div>

            {/* Đơn thuốc */}
            {record.prescription && (
              <div>
                <h4 className="text-xs font-semibold text-slate-900 mb-1.5">Đơn thuốc</h4>
                <p className="text-xs text-slate-600">{record.prescription}</p>
              </div>
            )}

            {/* Ghi chú */}
            {record.notes && (
              <div>
                <h4 className="text-xs font-semibold text-slate-900 mb-1.5">Ghi chú</h4>
                <p className="text-xs text-slate-600">{record.notes}</p>
              </div>
            )}

            {/* Tài liệu đính kèm */}
            {record.attachments.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-900 mb-2">Tài liệu đính kèm</h4>
                <div className="flex flex-wrap gap-2">
                  {record.attachments.map((attachment, index) => (
                    <button
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition"
                    >
                      <FiDownload className="w-3.5 h-3.5" />
                      {attachment}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
