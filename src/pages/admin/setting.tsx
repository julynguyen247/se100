import React, { useState } from "react";

const AdminSettingsPage: React.FC = () => {
  const [clinicName, setClinicName] = useState("Nha Khoa Dental Care");
  const [address, setAddress] = useState("123 Đường ABC, Quận 1, TP.HCM");
  const [phone, setPhone] = useState("028 1234 5678");
  const [email, setEmail] = useState("contact@dentalcare.vn");
  const [workingHours, setWorkingHours] = useState("8:00 - 20:00");

  const [slotDuration, setSlotDuration] = useState("30");
  const [maxDailySlots, setMaxDailySlots] = useState("50");

  const [onlineBooking, setOnlineBooking] = useState(true);
  const [smsNotification, setSmsNotification] = useState(true);
  const [emailNotification, setEmailNotification] = useState(true);

  const handleSave = () => {
    // TODO: call API lưu cấu hình
    console.log({
      clinicName,
      address,
      phone,
      email,
      workingHours,
      slotDuration,
      maxDailySlots,
      onlineBooking,
      smsNotification,
      emailNotification,
    });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F5F7FB] px-6 py-8 sm:px-10 lg:px-16">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
            Cài đặt hệ thống
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Cấu hình thông tin và tùy chọn hệ thống
          </p>
        </div>

        {/* Thông tin phòng khám */}
        <SectionCard title="Thông tin phòng khám">
          <div className="space-y-4">
            <InputField
              label="Tên phòng khám"
              value={clinicName}
              onChange={setClinicName}
            />
            <InputField label="Địa chỉ" value={address} onChange={setAddress} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Số điện thoại"
                value={phone}
                onChange={setPhone}
              />
              <InputField label="Email" value={email} onChange={setEmail} />
            </div>

            <InputField
              label="Giờ làm việc"
              value={workingHours}
              onChange={setWorkingHours}
            />
          </div>
        </SectionCard>

        {/* Cài đặt lịch hẹn */}
        <SectionCard title="Cài đặt lịch hẹn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Thời gian mỗi lịch hẹn (phút)"
              value={slotDuration}
              onChange={setSlotDuration}
            />
            <InputField
              label="Số lịch tối đa/ngày"
              value={maxDailySlots}
              onChange={setMaxDailySlots}
            />
          </div>
        </SectionCard>

        {/* Cài đặt thông báo */}
        <SectionCard title="Cài đặt thông báo">
          <div className="space-y-4">
            <ToggleRow
              title="Đặt lịch trực tuyến"
              description="Cho phép bệnh nhân đặt lịch qua website"
              checked={onlineBooking}
              onChange={setOnlineBooking}
            />
            <ToggleRow
              title="Thông báo SMS"
              description="Gửi SMS nhắc nhở lịch hẹn"
              checked={smsNotification}
              onChange={setSmsNotification}
            />
            <ToggleRow
              title="Thông báo Email"
              description="Gửi email xác nhận và nhắc nhở"
              checked={emailNotification}
              onChange={setEmailNotification}
            />
          </div>
        </SectionCard>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#EF4444] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#DC2626]"
          >
            Lưu cài đặt
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;

/* ---------- Sub components ---------- */

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, children }) => {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-100 px-6 py-5 sm:px-8 sm:py-6 space-y-4">
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      {children}
    </section>
  );
};

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange }) => {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-slate-600">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-[#F9FAFB] px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#2563EB] focus:bg-white"
      />
    </div>
  );
};

interface ToggleRowProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}

const ToggleRow: React.FC<ToggleRowProps> = ({
  title,
  description,
  checked,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-900">{title}</p>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition
          ${checked ? "bg-red-500" : "bg-slate-300"}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition
            ${checked ? "translate-x-5" : "translate-x-1"}`}
        />
      </button>
    </div>
  );
};
