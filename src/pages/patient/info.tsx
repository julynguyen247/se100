import React, { useState } from "react";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";

type ProfileData = {
  fullName: string;
  gender: string;
  dob: string;
  phone: string;
  email: string;
  address: string;
  emergencyName: string;
  emergencyPhone: string;
  bloodGroup: string;
  allergy: string;
  chronicDisease: string;
  insuranceType: string;
  insuranceNumber: string;
};

const INITIAL_PROFILE: ProfileData = {
  fullName: "Nguyễn Văn A",
  gender: "Nam",
  dob: "15/05/1990",
  phone: "0123456789",
  email: "patient@example.com",
  address: "123 Đường ABC, Quận 1, TP.HCM",
  emergencyName: "Nguyễn Thị B",
  emergencyPhone: "0987654321",
  bloodGroup: "O+",
  allergy: "Không",
  chronicDisease: "Không",
  insuranceType: "Bảo hiểm y tế quốc gia",
  insuranceNumber: "1234567890123",
};

const GENDER_OPTIONS = ["Nam", "Nữ", "Khác"];
//const BLOOD_GROUP_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Không rõ"];

const MyProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData>(INITIAL_PROFILE);
  const [editProfile, setEditProfile] = useState<ProfileData>(INITIAL_PROFILE);

  const handleEdit = () => {
    setEditProfile({ ...profile });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditProfile({ ...profile });
    setIsEditing(false);
  };

  const handleSave = () => {
    // Validate required fields
    if (!editProfile.fullName || !editProfile.phone) {
      alert("Vui lòng nhập đầy đủ họ tên và số điện thoại!");
      return;
    }
    setProfile({ ...editProfile });
    setIsEditing(false);
    alert("Đã lưu thông tin thành công!");
  };

  const handleChange = (field: keyof ProfileData, value: string) => {
    setEditProfile((prev) => ({ ...prev, [field]: value }));
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

          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-[#1D4ED8]"
            >
              <FiEdit2 className="w-4 h-4" />
              <span>Chỉnh sửa</span>
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                <FiX className="w-4 h-4" />
                <span>Huỷ</span>
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-emerald-600"
              >
                <FiSave className="w-4 h-4" />
                <span>Lưu thay đổi</span>
              </button>
            </div>
          )}
        </div>

        {/* Thông tin cơ bản */}
        <ProfileSection title="Thông tin cơ bản">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Họ và tên"
              value={isEditing ? editProfile.fullName : profile.fullName}
              isEditing={isEditing}
              onChange={(v) => handleChange("fullName", v)}
              required
            />
            <Field
              label="Ngày sinh"
              value={isEditing ? editProfile.dob : profile.dob}
              isEditing={isEditing}
              onChange={(v) => handleChange("dob", v)}
              type="date"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <SelectField
              label="Giới tính"
              value={isEditing ? editProfile.gender : profile.gender}
              options={GENDER_OPTIONS}
              isEditing={isEditing}
              onChange={(v) => handleChange("gender", v)}
            />
            <Field
              label="Số điện thoại"
              value={isEditing ? editProfile.phone : profile.phone}
              isEditing={isEditing}
              onChange={(v) => handleChange("phone", v)}
              type="tel"
              required
            />
          </div>

          <div className="mt-4">
            <Field
              label="Email"
              value={isEditing ? editProfile.email : profile.email}
              isEditing={isEditing}
              onChange={(v) => handleChange("email", v)}
              type="email"
            />
          </div>

          <div className="mt-4">
            <Field
              label="Địa chỉ"
              value={isEditing ? editProfile.address : profile.address}
              isEditing={isEditing}
              onChange={(v) => handleChange("address", v)}
            />
          </div>
        </ProfileSection>

        {/* Liên hệ khẩn cấp */}
        {/* <ProfileSection title="Liên hệ khẩn cấp">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Tên người liên hệ"
              value={isEditing ? editProfile.emergencyName : profile.emergencyName}
              isEditing={isEditing}
              onChange={(v) => handleChange("emergencyName", v)}
            />
            <Field
              label="Số điện thoại"
              value={isEditing ? editProfile.emergencyPhone : profile.emergencyPhone}
              isEditing={isEditing}
              onChange={(v) => handleChange("emergencyPhone", v)}
              type="tel"
            />
          </div>
        </ProfileSection> */}

        {/* Thông tin y tế */}
        <ProfileSection title="Thông tin y tế">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {/* <SelectField
              label="Nhóm máu"
              value={isEditing ? editProfile.bloodGroup : profile.bloodGroup}
              options={BLOOD_GROUP_OPTIONS}
              isEditing={isEditing}
              onChange={(v) => handleChange("bloodGroup", v)}
            /> */}
            <Field
              label="Dị ứng"
              value={isEditing ? editProfile.allergy : profile.allergy}
              isEditing={isEditing}
              onChange={(v) => handleChange("allergy", v)}
              placeholder="Nhập các loại dị ứng (nếu có)..."
            />
            <Field
              label="Bệnh lý nền"
              value={isEditing ? editProfile.chronicDisease : profile.chronicDisease}
              isEditing={isEditing}
              onChange={(v) => handleChange("chronicDisease", v)}
              placeholder="Nhập các bệnh lý nền (nếu có)..."
            />
          </div>
        </ProfileSection>

        {/* Bảo hiểm y tế */}
        {/* <ProfileSection title="Bảo hiểm y tế">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Loại bảo hiểm"
              value={isEditing ? editProfile.insuranceType : profile.insuranceType}
              isEditing={isEditing}
              onChange={(v) => handleChange("insuranceType", v)}
            />
            <Field
              label="Số thẻ bảo hiểm"
              value={isEditing ? editProfile.insuranceNumber : profile.insuranceNumber}
              isEditing={isEditing}
              onChange={(v) => handleChange("insuranceNumber", v)}
            />
          </div>
        </ProfileSection> */}
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
  isEditing?: boolean;
  onChange?: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
};

const Field: React.FC<FieldProps> = ({
  label,
  value = "",
  isEditing = false,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
}) => {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-slate-600">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        readOnly={!isEditing}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition ${isEditing
          ? "border-slate-300 bg-white text-slate-900 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30"
          : "border-slate-200 bg-[#F9FAFB] text-slate-700 cursor-default"
          }`}
      />
    </div>
  );
};

type SelectFieldProps = {
  label: string;
  value?: string;
  options: string[];
  isEditing?: boolean;
  onChange?: (value: string) => void;
};

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value = "",
  options,
  isEditing = false,
  onChange,
}) => {
  if (!isEditing) {
    return (
      <div className="space-y-1">
        <label className="block text-xs font-medium text-slate-600">{label}</label>
        <input
          type="text"
          readOnly
          value={value}
          className="w-full rounded-lg border border-slate-200 bg-[#F9FAFB] px-4 py-2.5 text-sm text-slate-700 outline-none cursor-default"
        />
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-slate-600">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 appearance-none cursor-pointer"
      >
        <option value="">-- Chọn --</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};
