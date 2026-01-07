import React, { useState, useEffect } from "react";
import { FiEdit2, FiSave, FiX, FiAlertCircle, FiUser, FiCalendar, FiPhone, FiMail, FiMapPin, FiHeart } from "react-icons/fi";
import {
  getPatientProfile,
  getGenderEnum,
  updatePatientProfile,
  type ProfileData,
  type EnumDto
} from "../../services/apiPatient";

// Helper function to convert ISO date to DD/MM/YYYY format
const formatDate = (isoDate: string): string => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper function to convert DD/MM/YYYY to YYYY-MM-DD for date input
const formatDateForInput = (ddmmyyyy: string): string => {
  if (!ddmmyyyy || !ddmmyyyy.includes('/')) return "";
  const [day, month, year] = ddmmyyyy.split('/');
  return `${year}-${month}-${day}`;
};

// Helper function to convert YYYY-MM-DD to DD/MM/YYYY
const formatDateFromInput = (yyyymmdd: string): string => {
  if (!yyyymmdd || !yyyymmdd.includes('-')) return "";
  const [year, month, day] = yyyymmdd.split('-');
  return `${day}/${month}/${year}`;
};

// Map backend gender enum to Vietnamese labels
const mapGenderToVietnamese = (gender: string): string => {
  const mapping: Record<string, string> = {
    MALE: "Nam",
    FEMALE: "Nữ",
    X: "Khác"
  };
  return mapping[gender] || gender;
};

const mapVietnameseToGender = (label: string): string => {
  const mapping: Record<string, string> = {
    "Nam": "MALE",
    "Nữ": "FEMALE",
    "Khác": "X"
  };
  return mapping[label] || label;
};

const MyProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [editProfile, setEditProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [genderOptions, setGenderOptions] = useState<string[]>(["Nam", "Nữ", "Khác"]);

  // Save modal states
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState<ProfileData | null>(null);

  // Fetch patient profile and gender enum on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both profile and gender enum in parallel
        const [profileResponse, genderResponse] = await Promise.all([
          getPatientProfile(),
          getGenderEnum()
        ]);

        // Process gender enum
        if (genderResponse && genderResponse.data) {
          const genderLabels = genderResponse.data.map((item: EnumDto) =>
            mapGenderToVietnamese(item.name)
          );
          setGenderOptions(genderLabels);
        }

        // Process profile data
        if (profileResponse && profileResponse.data) {
          const profileData: ProfileData = {
            ...profileResponse.data,
            gender: mapGenderToVietnamese(profileResponse.data.gender),
            dob: formatDate(profileResponse.data.dob),
            allergy: profileResponse.data.allergy || "",
            chronicDisease: profileResponse.data.chronicDisease || "",
            emergencyName: profileResponse.data.emergencyName || "",
            emergencyPhone: profileResponse.data.emergencyPhone || "",
            bloodGroup: profileResponse.data.bloodGroup || "",
            insuranceType: profileResponse.data.insuranceType || "",
            insuranceNumber: profileResponse.data.insuranceNumber || "",
          };
          setProfile(profileData);
          setEditProfile(profileData);
        }
      } catch (err: any) {
        console.error("Failed to fetch data:", err);
        setError("Không thể tải thông tin. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = () => {
    if (profile) {
      setEditProfile({ ...profile });
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditProfile({ ...profile });
      setIsEditing(false);
    }
  };

  const handleSave = async () => {
    if (!editProfile) return;

    // Validate required fields
    if (!editProfile.fullName || !editProfile.phone) {
      alert("Vui lòng nhập đầy đủ họ tên và số điện thoại!");
      return;
    }

    try {
      // Show modal and start saving
      setShowSaveModal(true);
      setIsSaving(true);
      setSaveSuccess(false);

      const genderEnum = mapVietnameseToGender(editProfile.gender);

      const dataToSave = {
        ...editProfile,
        gender: genderEnum,
      };

      console.log("=== DATA BEING SENT TO BACKEND ===");
      console.log("Data to save:", dataToSave);
      console.log("Gender enum:", genderEnum);
      console.log("Edit profile:", editProfile);

      const response = await updatePatientProfile(dataToSave);

      console.log("=== SAVE RESPONSE DEBUG ===");
      console.log("Full response:", response);
      console.log("Response data:", response?.data);

      // Backend returns {isSuccess: true, data: {success: true}}, then refetch profile
      if (response && response.isSuccess) {
        console.log("Save successful, refetching profile...");

        const profileResponse = await getPatientProfile();

        if (profileResponse && profileResponse.data) {
          const updatedProfile = {
            ...profileResponse.data,
            gender: mapGenderToVietnamese(profileResponse.data.gender),
            dob: formatDate(profileResponse.data.dob),
            allergy: profileResponse.data.allergy || "",
            chronicDisease: profileResponse.data.chronicDisease || "",
            emergencyName: profileResponse.data.emergencyName || "",
            emergencyPhone: profileResponse.data.emergencyPhone || "",
            bloodGroup: profileResponse.data.bloodGroup || "",
            insuranceType: profileResponse.data.insuranceType || "",
            insuranceNumber: profileResponse.data.insuranceNumber || "",
          };

          console.log("Refetched profile:", updatedProfile);

          setProfile(updatedProfile);
          setEditProfile(updatedProfile);
          setUpdatedInfo(updatedProfile);
          setIsEditing(false);

          // Show success state
          setIsSaving(false);
          setSaveSuccess(true);
        }
      }
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      setShowSaveModal(false);
      setIsSaving(false);
      setSaveSuccess(false);
      alert("Không thể lưu thông tin. Vui lòng thử lại sau.");
    }
  };

  const handleChange = (field: keyof ProfileData, value: string) => {
    setEditProfile((prev) => prev ? ({ ...prev, [field]: value }) : null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#F5F7FB] px-6 py-8 sm:px-10 lg:px-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#2563EB] border-r-transparent mb-4"></div>
          <p className="text-sm text-slate-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#F5F7FB] px-6 py-8 sm:px-10 lg:px-20 flex items-center justify-center">
        <div className="text-center max-w-md">
          <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Không thể tải thông tin</h2>
          <p className="text-sm text-slate-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1D4ED8]"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // No profile data
  if (!profile) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#F5F7FB] px-6 py-8 sm:px-10 lg:px-20 flex items-center justify-center">
        <p className="text-sm text-slate-600">Không tìm thấy thông tin</p>
      </div>
    );
  }

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
              value={isEditing ? (editProfile?.fullName || "") : (profile?.fullName || "")}
              isEditing={isEditing}
              onChange={(v) => handleChange("fullName", v)}
              required
              icon={<FiUser className="w-4 h-4" />}
            />
            <Field
              label="Ngày sinh"
              value={formatDateForInput(isEditing ? (editProfile?.dob || "") : (profile?.dob || ""))}
              isEditing={isEditing}
              onChange={(v) => handleChange("dob", formatDateFromInput(v))}
              type="date"
              icon={<FiCalendar className="w-4 h-4" />}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <SelectField
              label="Giới tính"
              value={isEditing ? (editProfile?.gender || "") : (profile?.gender || "")}
              options={genderOptions}
              isEditing={isEditing}
              onChange={(v) => handleChange("gender", v)}
              icon={<FiUser className="w-4 h-4" />}
            />
            <Field
              label="Số điện thoại"
              value={isEditing ? (editProfile?.phone || "") : (profile?.phone || "")}
              isEditing={isEditing}
              onChange={(v) => handleChange("phone", v)}
              type="tel"
              required
              icon={<FiPhone className="w-4 h-4" />}
            />
          </div>

          <div className="mt-4">
            <Field
              label="Email"
              value={isEditing ? (editProfile?.email || "") : (profile?.email || "")}
              isEditing={isEditing}
              onChange={(v) => handleChange("email", v)}
              type="email"
              icon={<FiMail className="w-4 h-4" />}
            />
          </div>

          <div className="mt-4">
            <Field
              label="Địa chỉ"
              value={isEditing ? (editProfile?.address || "") : (profile?.address || "")}
              isEditing={isEditing}
              onChange={(v) => handleChange("address", v)}
              icon={<FiMapPin className="w-4 h-4" />}
            />
          </div>
        </ProfileSection>


        {/* Thông tin y tế */}
        <ProfileSection title="Thông tin y tế">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Field
              label="Dị ứng"
              value={isEditing ? (editProfile?.allergy || "") : (profile.allergy || "")}
              isEditing={isEditing}
              onChange={(v) => handleChange("allergy", v)}
              placeholder="Nhập các loại dị ứng (nếu có)..."
              icon={<FiHeart className="w-4 h-4" />}
            />
            <Field
              label="Bệnh lý nền"
              value={isEditing ? (editProfile?.chronicDisease || "") : (profile.chronicDisease || "")}
              isEditing={isEditing}
              onChange={(v) => handleChange("chronicDisease", v)}
              placeholder="Nhập các bệnh lý nền (nếu có)..."
              icon={<FiHeart className="w-4 h-4" />}
            />
          </div>
        </ProfileSection>

        {/* Save Modal */}
        <SaveModal
          isOpen={showSaveModal}
          isSaving={isSaving}
          isSuccess={saveSuccess}
          updatedInfo={updatedInfo}
          onClose={() => {
            setShowSaveModal(false);
            setSaveSuccess(false);
            setIsSaving(false);
          }}
        />
      </div>
    </div>
  );
};

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
  icon?: React.ReactNode;
};

const Field: React.FC<FieldProps> = ({
  label,
  value = "",
  isEditing = false,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
  icon,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          readOnly={!isEditing}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full rounded-xl border ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 text-sm outline-none transition-all duration-200 ${isEditing
            ? "border-slate-300 bg-white text-slate-900 shadow-sm hover:border-slate-400 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10"
            : "border-slate-200 bg-slate-50 text-slate-700 cursor-default"
            }`}
        />
      </div>
    </div>
  );
};

type SelectFieldProps = {
  label: string;
  value?: string;
  options: string[];
  isEditing?: boolean;
  onChange?: (value: string) => void;
  icon?: React.ReactNode;
};

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value = "",
  options,
  isEditing = false,
  onChange,
  icon,
}) => {
  if (!isEditing) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">{label}</label>
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}
          <input
            type="text"
            readOnly
            value={value}
            className={`w-full rounded-xl border border-slate-200 bg-slate-50 ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 text-sm text-slate-700 outline-none cursor-default`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10">
            {icon}
          </div>
        )}
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full rounded-xl border border-slate-300 bg-white ${icon ? 'pl-10' : 'pl-4'} pr-10 py-3 text-sm text-slate-900 outline-none shadow-sm hover:border-slate-400 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all duration-200 appearance-none cursor-pointer`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23cbd5e1'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundPosition: 'right 0.75rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.25rem',
          }}
        >
          <option value="">-- Chọn --</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

/* ---------- Save Modal Component ---------- */
type SaveModalProps = {
  isOpen: boolean;
  isSaving: boolean;
  isSuccess: boolean;
  updatedInfo: ProfileData | null;
  onClose: () => void;
};

const SaveModal: React.FC<SaveModalProps> = ({
  isOpen,
  isSaving,
  isSuccess,
  updatedInfo,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all">
        {isSaving ? (
          // Loading State
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Đang lưu thông tin...
            </h3>
            <p className="text-sm text-slate-600">
              Vui lòng đợi trong giây lát
            </p>
          </div>
        ) : isSuccess && updatedInfo ? (
          // Success State
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Lưu thành công!
              </h3>
              <p className="text-sm text-slate-600">
                Thông tin của bạn đã được cập nhật
              </p>
            </div>

            {/* Updated Info Display */}
            <div className="bg-slate-50 rounded-xl p-4 mb-6 space-y-3">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Thông tin đã cập nhật:</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-500">Họ tên:</span>
                  <p className="font-medium text-slate-900">{updatedInfo.fullName}</p>
                </div>
                <div>
                  <span className="text-slate-500">Giới tính:</span>
                  <p className="font-medium text-slate-900">{updatedInfo.gender}</p>
                </div>
                <div>
                  <span className="text-slate-500">Ngày sinh:</span>
                  <p className="font-medium text-slate-900">{updatedInfo.dob}</p>
                </div>
                <div>
                  <span className="text-slate-500">Số ĐT:</span>
                  <p className="font-medium text-slate-900">{updatedInfo.phone}</p>
                </div>
                {updatedInfo.email && (
                  <div className="col-span-2">
                    <span className="text-slate-500">Email:</span>
                    <p className="font-medium text-slate-900">{updatedInfo.email}</p>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full rounded-lg bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#1D4ED8] transition-colors"
            >
              Đóng
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MyProfilePage;
