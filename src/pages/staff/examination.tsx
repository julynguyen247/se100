// src/pages/staff/StaffExaminationPage.tsx
import React, { useState } from "react";
import { FiSave } from "react-icons/fi";

const upperTeeth = [
  18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28,
];

const lowerTeeth = [
  48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38,
];

const StaffExaminationPage: React.FC = () => {
  const [reason, setReason] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [note, setNote] = useState("");
  const [nextDate, setNextDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call API lưu phiếu khám
    console.log({
      reason,
      diagnosis,
      treatment,
      note,
      nextDate,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
      <div>
        <h1 className="text-sm font-semibold text-slate-900">
          Phiếu khám bệnh
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Ghi nhận thông tin khám và điều trị
        </p>
      </div>

      <div className="bg-blue-50 rounded-2xl px-5 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
          NA
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-slate-900">Nguyễn Văn A</p>
          <p className="mt-1 text-xs text-slate-600">
            34 tuổi • Nam • Khám gần nhất: 22/11/2024
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-5"
      >
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4 space-y-5">
          <h2 className="text-sm font-semibold text-slate-900">
            Sơ đồ răng miệng
          </h2>

          <div>
            <p className="text-xs font-medium text-slate-500 mb-2">
              Chú thích:
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500">
              <div className="inline-flex items-center gap-2">
                <span className="w-4 h-4 rounded-md border border-slate-300 bg-white" />
                Khỏe mạnh
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="w-4 h-4 rounded-md bg-[#FCA5A5]" />
                Sâu răng
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="w-4 h-4 rounded-md bg-[#93C5FD]" />
                Đã trám
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="w-4 h-4 rounded-md bg-slate-300" />
                Mất răng
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="w-4 h-4 rounded-md bg-[#FACC15]" />
                Răng sứ
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="w-4 h-4 rounded-md bg-[#A855F7]" />
                Điều trị tủy
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500">Hàm trên</p>
            <div className="flex flex-wrap gap-1.5">
              {upperTeeth.map((t) => (
                <button
                  key={t}
                  type="button"
                  className="min-w-[32px] h-8 rounded-md border border-slate-200 text-xs text-slate-600 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500">Hàm dưới</p>
            <div className="flex flex-wrap gap-1.5">
              {lowerTeeth.map((t) => (
                <button
                  key={t}
                  type="button"
                  className="min-w-[32px] h-8 rounded-md border border-slate-200 text-xs text-slate-600 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4 flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Thông tin điều trị
          </h2>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">
              Lý do khám
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Bệnh nhân than phiền..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">
              Chẩn đoán
            </label>
            <textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Chẩn đoán bệnh..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">
              Điều trị
            </label>
            <textarea
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Mô tả điều trị đã thực hiện..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">
              Ghi chú
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Ghi chú thêm, lưu ý..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">
              Ngày tái khám
            </label>
            <input
              type="date"
              value={nextDate}
              onChange={(e) => setNextDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mt-2 flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              className="px-4 py-2 rounded-full border border-slate-200 text-xs font-medium text-slate-600 bg-white hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-600 text-white text-xs font-medium shadow-sm hover:bg-blue-700"
            >
              <FiSave className="w-4 h-4" />
              <span>Lưu phiếu khám</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StaffExaminationPage;
