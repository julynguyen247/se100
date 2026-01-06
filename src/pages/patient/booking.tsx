import React, { useState, FormEvent, useEffect } from "react";
import { useLocation } from "react-router-dom";

type Step = 1 | 2 | 3;

type AppointmentData = {
  fullName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  service: string;
  doctor: string;
  note: string;
};

// Interface for booking data passed from HomePage
interface BookingDataFromHome {
  name: string;
  phone: string;
  date: string;
  time: string;
}

const BookAppointmentPage: React.FC = () => {
  const location = useLocation();
  const [step, setStep] = useState<Step>(1);
  const [data, setData] = useState<AppointmentData>({
    fullName: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    service: "",
    doctor: "",
    note: "",
  });

  // Pre-fill data from HomePage if available
  useEffect(() => {
    const state = location.state as { bookingData?: BookingDataFromHome } | null;
    if (state?.bookingData) {
      const { name, phone, date, time } = state.bookingData;
      setData((prev) => ({
        ...prev,
        fullName: name || "",
        phone: phone || "",
        date: date || "",
        time: time || "",
      }));

      // Determine which step to go to based on missing info
      const hasPersonalInfo = name && phone;
      const hasTimeInfo = date && time;

      if (!hasPersonalInfo) {
        // Missing personal info -> go to step 1
        setStep(1);
      } else if (!hasTimeInfo) {
        // Has personal info but missing time -> go to step 2
        setStep(2);
      } else {
        // Has all info -> go to step 3 (Service selection)
        setStep(3);
      }
    }
  }, [location.state]);

  const updateField = <K extends keyof AppointmentData>(
    key: K,
    value: AppointmentData[K]
  ) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmitAll = (e: FormEvent) => {
    e.preventDefault();
    console.log("Submit full appointment:", data);
    // TODO: call API đặt lịch
    alert("Đặt lịch thành công!");
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex justify-center px-4 py-10">
      <div className="w-full max-w-4xl">
        <HeaderStepper step={step} />

        <div className="bg-white rounded-2xl shadow-sm px-6 py-6 sm:px-8 sm:py-7 mt-4">
          {step === 1 && (
            <StepInfo
              data={data}
              onChange={updateField}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <StepTime
              data={data}
              onChange={updateField}
              onPrev={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}

          {step === 3 && (
            <StepService
              data={data}
              onChange={updateField}
              onPrev={() => setStep(2)}
              onSubmit={handleSubmitAll}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentPage;

/* ---------- HEADER + STEPPER ---------- */

const HeaderStepper: React.FC<{ step: Step }> = ({ step }) => {
  return (
    <div className="flex flex-col items-center text-center mb-2">
      <span className="inline-flex items-center justify-center rounded-full bg-[#E0ECFF] text-[#2563EB] text-[10px] font-semibold px-4 py-1 tracking-[0.18em] uppercase">
        BOOK APPOINTMENT
      </span>

      <h1 className="mt-4 text-xl sm:text-2xl font-semibold text-slate-900">
        Đặt lịch hẹn
      </h1>
      <p className="mt-1 text-xs sm:text-sm text-slate-500">
        Vui lòng điền đầy đủ thông tin để đặt lịch
      </p>

      <div className="mt-6 w-full max-w-lg flex items-center">
        <StepCircle index={1} current={step} label="Thông tin" />
        <div className="flex-1 h-px bg-slate-200 mx-3" />
        <StepCircle index={2} current={step} label="Thời gian" />
        <div className="flex-1 h-px bg-slate-200 mx-3" />
        <StepCircle index={3} current={step} label="Dịch vụ" />
      </div>
    </div>
  );
};

const StepCircle: React.FC<{
  index: number;
  current: number;
  label: string;
}> = ({ index, current, label }) => {
  const isActive = current === index;
  const isDone = current > index;

  const circleClass = isActive
    ? "bg-[#2563EB] text-white"
    : isDone
      ? "bg-emerald-500 text-white"
      : "bg-slate-100 text-slate-400 border border-slate-200";

  const textClass = isActive
    ? "text-[#2563EB]"
    : isDone
      ? "text-emerald-600"
      : "text-slate-400";

  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shadow-sm ${circleClass}`}
      >
        {index}
      </div>
      <span className={`mt-2 text-xs font-medium ${textClass}`}>{label}</span>
    </div>
  );
};

/* ---------- STEP 1: THÔNG TIN CÁ NHÂN ---------- */

type StepProps = {
  data: AppointmentData;
  onChange: <K extends keyof AppointmentData>(
    key: K,
    value: AppointmentData[K]
  ) => void;
};

const StepInfo: React.FC<
  StepProps & {
    onNext: () => void;
  }
> = ({ data, onChange, onNext }) => {
  const handleNext = (e: FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <>
      <h2 className="text-sm font-semibold text-slate-900 mb-5">
        Thông tin cá nhân
      </h2>
      <form className="space-y-4" onSubmit={handleNext}>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-700">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Nhập họ và tên"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white"
            value={data.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-700">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            placeholder="Nhập số điện thoại"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white"
            value={data.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-700">
            Email
          </label>
          <input
            type="email"
            placeholder="Nhập email (không bắt buộc)"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white"
            value={data.email}
            onChange={(e) => onChange("email", e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="mt-4 w-full rounded-lg bg-[#2563EB] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1D4ED8]"
        >
          Tiếp tục
        </button>
      </form>
    </>
  );
};

/* ---------- STEP 2: THỜI GIAN ---------- */

const timeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

const StepTime: React.FC<
  StepProps & {
    onPrev: () => void;
    onNext: () => void;
  }
> = ({ data, onChange, onPrev, onNext }) => {
  const handleSelectTime = (slot: string) => {
    onChange("time", slot);
  };

  const handleNext = (e: FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <>
      <h2 className="text-sm font-semibold text-slate-900 mb-5">
        Chọn ngày và giờ
      </h2>

      <form className="space-y-4" onSubmit={handleNext}>
        {/* Ngày hẹn */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-700">
            Ngày hẹn <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white"
            value={data.date}
            onChange={(e) => onChange("date", e.target.value)}
            required
          />
        </div>

        {/* Giờ hẹn */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-700">
            Giờ hẹn <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {timeSlots.map((slot) => {
              const selected = data.time === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => handleSelectTime(slot)}
                  className={`rounded-md border text-xs py-2 text-center transition
                  ${selected
                      ? "bg-[#2563EB] border-[#2563EB] text-white"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onPrev}
            className="w-1/2 rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Quay lại
          </button>
          <button
            type="submit"
            className="w-1/2 rounded-lg bg-[#2563EB] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1D4ED8]"
          >
            Tiếp tục
          </button>
        </div>
      </form>
    </>
  );
};

/* ---------- STEP 3: DỊCH VỤ + XÁC NHẬN ---------- */

const StepService: React.FC<
  StepProps & {
    onPrev: () => void;
    onSubmit: (e: FormEvent) => void;
  }
> = ({ data, onChange, onPrev, onSubmit }) => {
  return (
    <>
      <h2 className="text-sm font-semibold text-slate-900 mb-5">
        Chọn dịch vụ và xác nhận
      </h2>

      <form className="space-y-4" onSubmit={onSubmit}>
        {/* Dịch vụ */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-700">
            Dịch vụ <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white"
            value={data.service}
            onChange={(e) => onChange("service", e.target.value)}
            required
          >
            <option value="">Chọn dịch vụ</option>
            <option value="kham-tong-quat">Khám tổng quát</option>
            <option value="tay-trang">Tẩy trắng răng</option>
            <option value="nieng-rang">Niềng răng</option>
            <option value="trong-rang">Trồng răng Implant</option>
            <option value="nho-rang">Nhổ răng</option>
            <option value="cham-soc">Chăm sóc nướu</option>
          </select>
        </div>

        {/* Bác sĩ */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-700">
            Bác sĩ <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white"
            value={data.doctor}
            onChange={(e) => onChange("doctor", e.target.value)}
            required
          >
            <option value="">Chọn bác sĩ</option>
            <option value="bs-nguyen-van-a">BS. Nguyễn Văn A</option>
            <option value="bs-tran-thi-b">BS. Trần Thị B</option>
            <option value="bs-le-van-c">BS. Lê Văn C</option>
          </select>
        </div>

        {/* Ghi chú */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-700">
            Ghi chú
          </label>
          <textarea
            rows={3}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white resize-none"
            placeholder="Triệu chứng, yêu cầu đặc biệt... (không bắt buộc)"
            value={data.note}
            onChange={(e) => onChange("note", e.target.value)}
          />
        </div>

        {/* Tóm tắt thông tin */}
        <div className="bg-slate-50 rounded-lg p-4 mt-4">
          <h3 className="text-xs font-semibold text-slate-700 mb-3">Tóm tắt thông tin đặt lịch:</h3>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div><span className="font-medium">Họ tên:</span> {data.fullName || "-"}</div>
            <div><span className="font-medium">SĐT:</span> {data.phone || "-"}</div>
            <div><span className="font-medium">Ngày:</span> {data.date || "-"}</div>
            <div><span className="font-medium">Giờ:</span> {data.time || "-"}</div>
          </div>
        </div>

        <div className="flex justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onPrev}
            className="w-1/2 rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Quay lại
          </button>
          <button
            type="submit"
            className="w-1/2 rounded-lg bg-[#2563EB] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1D4ED8]"
          >
            Xác nhận đặt lịch
          </button>
        </div>
      </form>
    </>
  );
};
