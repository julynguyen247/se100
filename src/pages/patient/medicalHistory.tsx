import React, { useState, useEffect } from "react";
import { FiSearch, FiCalendar, FiFileText, FiDownload, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { getMedicalRecords, type MedicalRecordDto } from "../../services/apiPatient";



const MedicalHistoryPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [records, setRecords] = useState<MedicalRecordDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch medical records on mount
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const response = await getMedicalRecords();

        if (response && response.data) {
          setRecords(response.data);
        }
      } catch (err: any) {
        console.error("Failed to fetch medical records:", err);
        setError("Không thể tải hồ sơ bệnh án. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const filtered = records.filter(
    (r) =>
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      (r.diagnosis?.toLowerCase() || "").includes(query.toLowerCase()) ||
      r.doctor.toLowerCase().includes(query.toLowerCase())
  );

  const toggleExpand = (id: string) => {
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
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm text-slate-600">Đang tải hồ sơ bệnh án...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
            <FiFileText className="w-12 h-12 text-red-300 mx-auto mb-4" />
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Lỗi tải dữ liệu</h3>
            <p className="text-xs text-slate-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Thử lại
            </button>
          </div>
        ) : records.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
            <FiFileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Chưa có bệnh sử</h3>
            <p className="text-xs text-slate-500">
              Bạn chưa có hồ sơ bệnh án nào trong hệ thống
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
            <FiFileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Không tìm thấy hồ sơ</h3>
            <p className="text-xs text-slate-500">
              Không có hồ sơ bệnh án nào phù hợp với tìm kiếm của bạn
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((record) => (
              <MedicalRecordCard
                key={record.id}
                record={record}
                isExpanded={expandedId === record.id}
                onToggle={() => toggleExpand(record.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalHistoryPage;

/* -------- Card từng hồ sơ -------- */

interface MedicalRecordCardProps {
  record: MedicalRecordDto;
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
            {record.diagnosis && (
              <div className="mt-3 rounded-xl bg-[#EFF6FF] px-4 py-2.5 text-xs text-slate-700">
                <span className="font-semibold text-slate-900">Chẩn đoán: </span>
                <span>{record.diagnosis}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chi tiết - Expandable */}
      {isExpanded && (
        <div className="border-t border-slate-100 bg-slate-50 px-5 py-5">
          <div className="ml-15 space-y-4">
            {/* Điều trị */}
            {record.treatment && (
              <div>
                <h4 className="text-xs font-semibold text-slate-900 mb-1.5">Điều trị</h4>
                <p className="text-xs text-slate-600">{record.treatment}</p>
              </div>
            )}

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
