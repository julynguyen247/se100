// src/components/staff/NewAppointmentModal.tsx
import React, { useState } from "react";
import Modal from "../ui/Modal";

type NewAppointmentModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate?: (payload: {
    fullName: string;
    phone: string;
    service: string;
    doctor: string;
    date: string;
    time: string;
    note: string;
  }) => void;
};

const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  open,
  onClose,
  onCreate,
}) => {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    service: "",
    doctor: "",
    date: "",
    time: "",
    note: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate?.(form);

    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Tạo lịch hẹn mới"
      closeOnBackdrop
      showCloseButton={false}
      className="max-w-lg"
      footer={
        <div className="flex justify-between gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-full border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            form="new-appointment-form"
            className="flex-1 px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-medium hover:bg-blue-700"
          >
            Tạo lịch hẹn
          </button>
        </div>
      }
    >
      <form
        id="new-appointment-form"
        onSubmit={handleSubmit}
        className="space-y-3 text-xs"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] text-slate-500 font-medium">
              Họ tên bệnh nhân
            </label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Nguyễn Thị Lan"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-500 font-medium">
              Số điện thoại
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="0901234567"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] text-slate-500 font-medium">
            Dịch vụ
          </label>
          <input
            name="service"
            value={form.service}
            onChange={handleChange}
            placeholder="VD: Khám tổng quát, trám răng..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] text-slate-500 font-medium">
            Bác sĩ
          </label>
          <input
            name="doctor"
            value={form.doctor}
            onChange={handleChange}
            placeholder="VD: BS. Nguyễn Văn A"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] text-slate-500 font-medium">
              Ngày hẹn
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-500 font-medium">
              Giờ hẹn
            </label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] text-slate-500 font-medium">
            Ghi chú
          </label>
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            rows={3}
            placeholder="Ghi chú thêm..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>
      </form>
    </Modal>
  );
};

export default NewAppointmentModal;
