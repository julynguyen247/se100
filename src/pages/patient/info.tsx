import React from "react";
import { FiEdit2 } from "react-icons/fi";

const MyProfilePage: React.FC = () => {
  const profile = {
    fullName: "Nguyễn Văn A",
    gender: "",
    dob: "",
    phone: "0123456789",
    email: "patient@example.com",
    address: "",
    emergencyName: "Nguyễn Thị B",
    emergencyPhone: "0987654321",
    bloodGroup: "",
    allergy: "Không",
    chronicDisease: "Không",
    insuranceType: "Bảo hiểm y tế quốc gia",
    insuranceNumber: "1234567890123",
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F5F7FB] px-6 py-8 sm:px-10 lg:px-20">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center justify-center rounded-full bg-[#E0ECFF] text-[#2563EB] text-[11px] font-semibold px-5 py-1.5 tracking-[0.16em] uppercase mb-3">
              MY PROFILE
            </span>
            <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
              Thông tin cá nhân
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Quản lý thông tin hồ sơ của bạn
            </p>
          </div>

          <button className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-[#1D4ED8]">
            <FiEdit2 className="w-4 h-4" />
            <span>Chỉnh sửa</span>
          </button>
        </div>

        {/* Thông tin cơ bản */}
        <ProfileSection title="Thông tin cơ bản">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Họ và tên" value={profile.fullName} />
            <Field label="Ngày sinh" value={profile.dob} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Field label="Giới tính" value={profile.gender} />
            <Field label="Số điện thoại" value={profile.phone} />
          </div>

          <div className="mt-4">
            <Field label="Email" value={profile.email} />
          </div>

          <div className="mt-4">
            <Field label="Địa chỉ" value={profile.address} />
          </div>
        </ProfileSection>

        {/* Liên hệ khẩn cấp */}
        <ProfileSection title="Liên hệ khẩn cấp">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Tên người liên hệ" value={profile.emergencyName} />
            <Field label="Số điện thoại" value={profile.emergencyPhone} />
          </div>
        </ProfileSection>

        {/* Thông tin y tế */}
        <ProfileSection title="Thông tin y tế">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nhóm máu" value={profile.bloodGroup} />
            <Field label="Dị ứng" value={profile.allergy} />
          </div>

          <div className="mt-4">
            <Field label="Bệnh lý nền" value={profile.chronicDisease} />
          </div>
        </ProfileSection>

        {/* Bảo hiểm y tế */}
        <ProfileSection title="Bảo hiểm y tế">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Loại bảo hiểm" value={profile.insuranceType} />
            <Field label="Số thẻ bảo hiểm" value={profile.insuranceNumber} />
          </div>
        </ProfileSection>
      </div>
    </div>
  );
};

export default MyProfilePage;

/* ---------- Sub components ---------- */

type ProfileSectionProps = {
  title: string;
  children: React.ReactNode;
};

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, children }) => {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-100 px-6 py-5 sm:px-8 sm:py-6 space-y-4">
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      {children}
    </section>
  );
};

type FieldProps = {
  label: string;
  value?: string;
};

const Field: React.FC<FieldProps> = ({ label, value = "" }) => {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-slate-600">
        {label}
      </label>
      <input
        readOnly
        value={value}
        placeholder=""
        className="w-full rounded-lg border border-slate-200 bg-[#F9FAFB] px-4 py-2.5 text-sm text-slate-700 outline-none"
      />
    </div>
  );
};
