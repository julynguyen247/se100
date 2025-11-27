// src/pages/staff/StaffMedicinePage.tsx
import React, { useState } from "react";
import { FiPlus, FiSave } from "react-icons/fi";

type MedicineItem = {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  note: string;
};

const StaffMedicinePage: React.FC = () => {
  const [medicines, setMedicines] = useState<MedicineItem[]>([
    {
      id: 1,
      name: "",
      dosage: "",
      frequency: "",
      duration: "",
      note: "",
    },
  ]);

  const [advice, setAdvice] = useState("");

  const handleMedicineChange = (
    id: number,
    field: keyof MedicineItem,
    value: string
  ) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handleAddMedicine = () => {
    setMedicines((prev) => [
      ...prev,
      {
        id: prev.length ? prev[prev.length - 1].id + 1 : 1,
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
        note: "",
      },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call API lưu đơn thuốc
    console.log({ medicines, advice });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      {/* tiêu đề */}
      <div>
        <h1 className="text-sm font-semibold text-slate-900">Kê đơn thuốc</h1>
        <p className="mt-1 text-xs text-slate-400">
          Tạo đơn thuốc cho bệnh nhân
        </p>
      </div>

      {/* thông tin bệnh nhân */}
      <div className="bg-blue-50 rounded-2xl px-5 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
          NA
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-slate-900">Nguyễn Văn A</p>
          <p className="mt-1 text-xs text-slate-600">34 tuổi • Nam</p>
        </div>
      </div>

      {/* form kê đơn */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4 space-y-4"
      >
        {/* header danh sách thuốc */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">
            Danh sách thuốc
          </h2>
          <button
            type="button"
            onClick={handleAddMedicine}
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 text-white text-xs px-3 py-1.5 hover:bg-blue-700"
          >
            <FiPlus className="w-4 h-4" />
            <span>Thêm thuốc</span>
          </button>
        </div>

        {/* từng thuốc */}
        <div className="space-y-5">
          {medicines.map((m, idx) => (
            <div
              key={m.id}
              className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 space-y-3"
            >
              <p className="text-xs font-semibold text-slate-500">
                Thuốc {idx + 1}
              </p>

              {/* tên thuốc */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-500">
                  Tên thuốc
                </label>
                <input
                  type="text"
                  value={m.name}
                  onChange={(e) =>
                    handleMedicineChange(m.id, "name", e.target.value)
                  }
                  placeholder="VD: Amoxicillin"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* dòng 2: liều & tần suất */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-500">
                    Liều lượng
                  </label>
                  <input
                    type="text"
                    value={m.dosage}
                    onChange={(e) =>
                      handleMedicineChange(m.id, "dosage", e.target.value)
                    }
                    placeholder="VD: 500mg"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-500">
                    Tần suất
                  </label>
                  <input
                    type="text"
                    value={m.frequency}
                    onChange={(e) =>
                      handleMedicineChange(m.id, "frequency", e.target.value)
                    }
                    placeholder="VD: 3 lần/ngày"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* dòng 3: thời gian & ghi chú */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-500">
                    Thời gian
                  </label>
                  <input
                    type="text"
                    value={m.duration}
                    onChange={(e) =>
                      handleMedicineChange(m.id, "duration", e.target.value)
                    }
                    placeholder="VD: 7 ngày"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-500">
                    Ghi chú
                  </label>
                  <input
                    type="text"
                    value={m.note}
                    onChange={(e) =>
                      handleMedicineChange(m.id, "note", e.target.value)
                    }
                    placeholder="VD: Uống sau ăn"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* lời dặn */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">Lời dặn</label>
          <textarea
            value={advice}
            onChange={(e) => setAdvice(e.target.value)}
            rows={2}
            placeholder="Lời dặn dành cho bệnh nhân..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

        {/* nút hành động */}
        <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
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
            <span>Lưu đơn thuốc</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default StaffMedicinePage;
