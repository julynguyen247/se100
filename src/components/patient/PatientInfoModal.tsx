// PatientInfoModal.tsx
import React, { useState, useEffect } from "react";

interface PatientInfo {
  name: string;
  email: string;
  dob: string;
  address: string;
  phone: string;
  gender: string;
}

interface PatientInfoModalProps {
  open: boolean;
  onClose: () => void;
  onNext?: (data: PatientInfo) => void;
}

const defaultValues: PatientInfo = {
  name: "John",
  email: "you@untitledui.com",
  dob: "2025-01-01",
  address: "21:00",
  phone: "0101010101010101",
  gender: "Male",
};

export const PatientInfoModal: React.FC<PatientInfoModalProps> = ({
  open,
  onClose,
  onNext,
}) => {
  const [form, setForm] = useState<PatientInfo>(defaultValues);

  useEffect(() => {
    if (open) setForm(defaultValues);
  }, [open]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    onNext?.(form);
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
        {/* Top small title */}
        <div className="px-6 pt-5 text-xs font-medium text-slate-400">
          Appointment - modal
        </div>

        <div className="px-6 pb-6 pt-3">
          {/* Header: icon + title + progress % */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                {/* icon avatar */}
                <span className="text-lg" aria-hidden>
                  👤
                </span>
              </div>
              <div className="text-sm font-semibold text-slate-900">
                Add Patient&apos;s Basic Information
              </div>
            </div>

            <span className="text-xs font-medium text-slate-400">10%</span>
          </div>

          {/* Progress bar */}
          <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600"
              style={{ width: "10%" }}
            />
          </div>

          {/* Form fields */}
          <div className="space-y-4 text-xs text-slate-500">
            {/* Name */}
            <div className="space-y-1">
              <label className="block font-medium">Patient&apos;s Name</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                  👤
                </span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-700 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="block font-medium">Email address</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                  ✉️
                </span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-700 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>

            {/* DOB */}
            <div className="space-y-1">
              <label className="block font-medium">Date of birth</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                  📅
                </span>
                <input
                  name="dob"
                  type="date"
                  value={form.dob}
                  onChange={handleChange}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-700 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1">
              <label className="block font-medium">Address</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                  📍
                </span>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-700 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="block font-medium">Phone</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                  📞
                </span>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-700 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-1">
              <label className="block font-medium">Gender</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                  👤
                </span>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-8 text-xs text-slate-700 outline-none focus:border-blue-500 focus:bg-white"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>

                {/* small ▼ icon */}
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[10px] text-slate-400">
                  ▾
                </span>
              </div>
            </div>
          </div>

          {/* Footer buttons */}
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
              onClick={handleNext}
              className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
