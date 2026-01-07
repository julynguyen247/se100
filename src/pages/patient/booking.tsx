import {
  createAppointmentAPI,
  getDoctorsAPI,
  getServicesAPI,
  getTimeSlotsAPI,
} from "@/services/api";
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

interface BookingDataFromHome {
  name: string;
  phone: string;
  date: string;
  time: string;
}

const BookAppointmentPage: React.FC = () => {
  const location = useLocation();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);

  const [services, setServices] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

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

  useEffect(() => {
    getServicesAPI().then((res) => setServices(res.data));
    getDoctorsAPI().then((res) => setDoctors(res.data));
    getTimeSlotsAPI().then((res) => setTimeSlots(res.data));
  }, []);

  useEffect(() => {
    const state = location.state as {
      bookingData?: BookingDataFromHome;
    } | null;
    if (state?.bookingData) {
      const { name, phone, date, time } = state.bookingData;
      setData((prev) => ({
        ...prev,
        fullName: name || "",
        phone: phone || "",
        date: date || "",
        time: time || "",
      }));

      if (!name || !phone) setStep(1);
      else if (!date || !time) setStep(2);
      else setStep(3);
    }
  }, [location.state]);

  const updateField = <K extends keyof AppointmentData>(
    key: K,
    value: AppointmentData[K]
  ) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmitAll = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await createAppointmentAPI(
        data.fullName,
        data.phone,
        data.email,
        data.date,
        data.time,
        data.service,
        data.doctor,
        data.note
      );

      if (res.data?.success) {
        alert("Đặt lịch thành công!");
      }
    } catch {
      alert("Đặt lịch thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex justify-center px-4 py-10">
      <div className="w-full max-w-4xl">
        <HeaderStepper step={step} />

        <div className="bg-white rounded-2xl shadow-sm px-6 py-6 mt-4">
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
              timeSlots={timeSlots}
              onChange={updateField}
              onPrev={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}

          {step === 3 && (
            <StepService
              data={data}
              services={services}
              doctors={doctors}
              loading={loading}
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

const HeaderStepper: React.FC<{ step: Step }> = ({ step }) => (
  <div className="flex flex-col items-center text-center mb-2">
    <h1 className="mt-4 text-xl font-semibold">Đặt lịch hẹn</h1>
    <div className="mt-6 w-full max-w-lg flex items-center">
      <StepCircle index={1} current={step} label="Thông tin" />
      <div className="flex-1 h-px bg-slate-200 mx-3" />
      <StepCircle index={2} current={step} label="Thời gian" />
      <div className="flex-1 h-px bg-slate-200 mx-3" />
      <StepCircle index={3} current={step} label="Dịch vụ" />
    </div>
  </div>
);

const StepCircle = ({ index, current, label }: any) => (
  <div className="flex flex-col items-center">
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center ${
        current === index ? "bg-blue-600 text-white" : "bg-slate-200"
      }`}
    >
      {index}
    </div>
    <span className="mt-2 text-xs">{label}</span>
  </div>
);

const StepInfo = ({ data, onChange, onNext }: any) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      onNext();
    }}
    className="space-y-4"
  >
    <input
      value={data.fullName}
      onChange={(e) => onChange("fullName", e.target.value)}
      required
      className="w-full border px-4 py-2"
    />
    <input
      value={data.phone}
      onChange={(e) => onChange("phone", e.target.value)}
      required
      className="w-full border px-4 py-2"
    />
    <input
      value={data.email}
      onChange={(e) => onChange("email", e.target.value)}
      className="w-full border px-4 py-2"
    />
    <button className="w-full bg-blue-600 text-white py-2">Tiếp tục</button>
  </form>
);

const StepTime = ({ data, timeSlots, onChange, onPrev, onNext }: any) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      onNext();
    }}
  >
    <input
      type="date"
      value={data.date}
      onChange={(e) => onChange("date", e.target.value)}
      required
      className="w-full border px-4 py-2 mb-4"
    />
    <div className="grid grid-cols-4 gap-2 mb-4">
      {timeSlots.map((slot: string) => (
        <button
          key={slot}
          type="button"
          onClick={() => onChange("time", slot)}
          className={`py-2 border ${
            data.time === slot ? "bg-blue-600 text-white" : ""
          }`}
        >
          {slot}
        </button>
      ))}
    </div>
    <div className="flex gap-3">
      <button type="button" onClick={onPrev} className="w-1/2 border py-2">
        Quay lại
      </button>
      <button className="w-1/2 bg-blue-600 text-white py-2">Tiếp tục</button>
    </div>
  </form>
);

const StepService = ({
  data,
  services,
  doctors,
  loading,
  onChange,
  onPrev,
  onSubmit,
}: any) => (
  <form onSubmit={onSubmit}>
    <select
      value={data.service}
      onChange={(e) => onChange("service", e.target.value)}
      required
      className="w-full border px-4 py-2 mb-3"
    >
      <option value="">Chọn dịch vụ</option>
      {services.map((s: any) => (
        <option key={s.id} value={s.id}>
          {s.name}
        </option>
      ))}
    </select>

    <select
      value={data.doctor}
      onChange={(e) => onChange("doctor", e.target.value)}
      required
      className="w-full border px-4 py-2 mb-3"
    >
      <option value="">Chọn bác sĩ</option>
      {doctors.map((d: any) => (
        <option key={d.id} value={d.id}>
          {d.name}
        </option>
      ))}
    </select>

    <textarea
      value={data.note}
      onChange={(e) => onChange("note", e.target.value)}
      className="w-full border px-4 py-2 mb-4"
    />

    <div className="flex gap-3">
      <button type="button" onClick={onPrev} className="w-1/2 border py-2">
        Quay lại
      </button>
      <button disabled={loading} className="w-1/2 bg-blue-600 text-white py-2">
        {loading ? "Đang xử lý..." : "Xác nhận"}
      </button>
    </div>
  </form>
);
