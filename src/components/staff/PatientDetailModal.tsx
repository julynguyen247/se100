// src/components/staff/PatientDetailModal.tsx
import React from "react";
import { FiCalendar, FiMail, FiPhone } from "react-icons/fi";
import Modal from "../ui/Modal";

type PatientInfo = {
  name: string;
  birthday: string;
  gender: string;
  bloodType: string;
  phone: string;
  email: string;
  address: string;
  allergy: string;
  totalVisits: number;
};

type VisitInfo = {
  date: string;
  service: string;
  doctor: string;
  diagnosis: string;
  treatment: string;
};

type PatientDetailModalProps = {
  open: boolean;
  onClose: () => void;
  patient?: Partial<PatientInfo>;
  lastVisit?: Partial<VisitInfo>;
};

const defaultPatient: PatientInfo = {
  name: "Nguyễn Văn A",
  birthday: "15/05/1990",
  gender: "Nam",
  bloodType: "O",
  phone: "0123456789",
  email: "example@email.com",
  address: "123 Đường ABC, Quận 1, TP.HCM",
  allergy: "Không",
  totalVisits: 0,
};

const defaultVisit: VisitInfo = {
  date: "10/12/2024",
  service: "Khám và tư vấn",
  doctor: "BS. Nguyễn Văn B",
  diagnosis: "Chưa có chẩn đoán",
  treatment: "Chưa điều trị",
};

const PatientDetailModal: React.FC<PatientDetailModalProps> = ({
  open,
  onClose,
  patient,
  lastVisit,
}) => {
  const p = { ...defaultPatient, ...patient };
  const v = { ...defaultVisit, ...lastVisit };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Hồ sơ bệnh nhân"
      closeOnBackdrop
      className="max-w-3xl"
    >
      <div className="space-y-4 text-xs">
        {/* Thông tin cá nhân */}
        <section>
          <h3 className="text-xs font-semibold text-slate-700 mb-2">
            Thông tin cá nhân
          </h3>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700">
            <div className="space-y-1">
              <p>
                <span className="font-medium">Họ và tên</span>
                <br />
                {p.name}
              </p>
              <p>
                <span className="font-medium">Giới tính</span>
                <br />
                {p.gender}
              </p>
              <p className="flex items-center gap-1">
                <span className="font-medium">Ngày sinh</span>
              </p>
              <p className="flex items-center gap-1">
                <FiCalendar className="w-3 h-3 text-slate-500" />
                {p.birthday}
              </p>
              <p>
                <span className="font-medium">Nhóm máu</span>
                <br />
                {p.bloodType}
              </p>
            </div>

            <div className="space-y-1">
              <p className="flex items-center gap-1">
                <span className="font-medium">Số điện thoại</span>
              </p>
              <p className="flex items-center gap-1">
                <FiPhone className="w-3 h-3 text-slate-500" />
                {p.phone}
              </p>

              <p className="flex items-center gap-1 mt-1">
                <span className="font-medium">Email</span>
              </p>
              <p className="flex items-center gap-1">
                <FiMail className="w-3 h-3 text-slate-500" />
                {p.email}
              </p>

              <p className="mt-1">
                <span className="font-medium">Địa chỉ</span>
                <br />
                {p.address}
              </p>

              <p className="mt-1">
                <span className="font-medium">Dị ứng</span>
                <br />
                {p.allergy}
              </p>

              <p className="mt-1">
                <span className="font-medium">Tổng số lần khám</span>
                <br />
                {p.totalVisits} lần
              </p>
            </div>
          </div>
        </section>

        {/* Lần khám gần nhất */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-slate-700">
              Lần khám gần nhất
            </h3>
            <p className="text-[11px] text-slate-400">{v.date}</p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3 space-y-1 text-slate-700">
            <p>
              <span className="font-medium">Dịch vụ: </span>
              {v.service}
            </p>
            <p>
              <span className="font-medium">Bác sĩ: </span>
              {v.doctor}
            </p>
            <p>
              <span className="font-medium">Chẩn đoán: </span>
              {v.diagnosis}
            </p>
            <p>
              <span className="font-medium">Điều trị: </span>
              {v.treatment}
            </p>
          </div>
        </section>
      </div>
    </Modal>
  );
};

export default PatientDetailModal;
