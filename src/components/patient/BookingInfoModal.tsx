// BookingInfoModal.tsx
import React, { useEffect, useState } from "react";

interface BookingInfo {
  dentist: string;
  date: string;
  time: string;
  alergic: string;
  service: string;
}

interface BookingInfoModalProps {
  open: boolean;
  onClose: () => void;
  onBook?: (data: BookingInfo) => void;
  onAddAlergic?: () => void;
  onAddService?: () => void;
}

const defaultBookingInfo: BookingInfo = {
  dentist: "",
  date: "2025-01-01",
  time: "21:00",
  alergic: "0101010101010",
  service: "0101010101010",
};

export const BookingInfoModal: React.FC<BookingInfoModalProps> = ({
  open,
  onClose,
  onBook,
  onAddAlergic,
  onAddService,
}) => {
  const [form, setForm] = useState<BookingInfo>(defaultBookingInfo);

  useEffect(() => {
    if (open) setForm(defaultBookingInfo);
  }, [open]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBook = () => {
    onBook?.(form);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="w-[380px] max-w-full rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-5 text-xs font-medium text-slate-400">
          Appointment - modal
        </div>

        <div className="px-6 pb-6 pt-3">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <span className="text-lg" aria-hidden>
                  📅
                </span>
              </div>
              <div className="text-sm font-semibold text-slate-900">
                Add Booking Information
              </div>
            </div>

            <span className="text-xs font-medium text-slate-400">10%</span>
          </div>

          {/* Progress */}
          <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600"
              style={{ width: "10%" }}
            />
          </div>

          {/* Form */}
          <div className="space-y-4 text-xs text-slate-500">
            {/* Dentist */}
            <div className="space-y-1">
              <label className="block font-medium">Dentist</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                  🧑‍⚕️
                </span>
                <select
                  name="dentist"
                  value={form.dentist}
                  onChange={handleChange}
                  className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-8 text-xs text-slate-700 outline-none focus:border-blue-500 focus:bg-white"
                >
                  <option value="">Select dentist</option>
                  <option value="Dr. Smith">Dr. Smith</option>
                  <option value="Dr. John">Dr. John</option>
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[10px] text-slate-400">
                  ▾
                </span>
              </div>
            </div>

            {/* Date */}
            <div className="space-y-1">
              <label className="block font-medium">Date</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                  📅
                </span>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-700 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Time */}
            <div className="space-y-1">
              <label className="block font-medium">Time</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                  ⏰
                </span>
                <input
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-700 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Alergic */}
            <div className="space-y-1">
              <label className="block font-medium">Alergic</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                  💊
                </span>
                <input
                  name="alergic"
                  value={form.alergic}
                  onChange={handleChange}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-700 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={onAddAlergic}
              className="flex items-center gap-2 text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              <span className="text-base leading-none">＋</span>
              <span>Add Allergic</span>
            </button>

            {/* Service */}
            <div className="space-y-1">
              <label className="block font-medium">Service</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                  🦷
                </span>
                <input
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-700 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={onAddService}
              className="flex items-center gap-2 text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              <span className="text-base leading-none">＋</span>
              <span>Add Service</span>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleBook}
              className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
