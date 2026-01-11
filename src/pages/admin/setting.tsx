import React, { useState, useEffect } from "react";
import { FiSave, FiSettings, FiAlertCircle, FiRefreshCw, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { getAdminClinics, createClinic, updateClinic, deleteClinic, type AdminClinicOption, type CreateClinicRequest, type UpdateClinicRequest } from "@/services/apiAdmin";

const AdminSettingsPage: React.FC = () => {
  // Backend-integrated state
  const [clinics, setClinics] = useState<AdminClinicOption[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<AdminClinicOption | null>(null);
  const [loadingClinics, setLoadingClinics] = useState(true);
  const [errorClinics, setErrorClinics] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Modal state for creating new clinic
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form state
  const [clinicCode, setClinicCode] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Fetch clinics on mount
  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    try {
      setLoadingClinics(true);
      setErrorClinics(null);
      const data = await getAdminClinics();
      setClinics(data);

      // Auto-select first clinic or maintain selection
      if (data.length > 0) {
        const existing = selectedClinic ? data.find(c => c.clinicId === selectedClinic.clinicId) : null;
        const toSelect = existing || data[0];
        setSelectedClinic(toSelect);
        setClinicCode(toSelect.code);
        setClinicName(toSelect.name);
        setPhone(toSelect.phone || "");
        setEmail(toSelect.email || "");
      } else {
        // No clinics, clear form
        setSelectedClinic(null);
        setClinicCode("");
        setClinicName("");
        setPhone("");
        setEmail("");
      }
    } catch (error) {
      console.error("Error fetching clinics:", error);
      setErrorClinics(error instanceof Error ? error.message : "Không thể tải thông tin phòng khám");
    } finally {
      setLoadingClinics(false);
    }
  };

  const handleSelectClinic = (clinic: AdminClinicOption) => {
    setSelectedClinic(clinic);
    setClinicCode(clinic.code);
    setClinicName(clinic.name);
    setPhone(clinic.phone || "");
    setEmail(clinic.email || "");
  };

  const handleSave = async () => {
    if (!selectedClinic) {
      alert("Không có phòng khám nào được chọn!");
      return;
    }

    if (!clinicCode.trim() || !clinicName.trim()) {
      alert("Vui lòng nhập mã phòng khám và tên phòng khám!");
      return;
    }

    try {
      setSaving(true);
      const payload: UpdateClinicRequest = {
        code: clinicCode,
        name: clinicName,
        phone: phone || undefined,
        email: email || undefined,
      };

      const response = await updateClinic(selectedClinic.clinicId, payload);

      if (response.isSuccess) {
        alert("Đã lưu cài đặt thành công!");
        await fetchClinics();
      } else {
        alert(response.message || "Không thể lưu cài đặt");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Lỗi kết nối server");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateClinic = async () => {
    if (!clinicCode.trim() || !clinicName.trim()) {
      alert("Vui lòng nhập mã phòng khám và tên phòng khám!");
      return;
    }

    try {
      setCreating(true);
      const payload: CreateClinicRequest = {
        code: clinicCode,
        name: clinicName,
        phone: phone || undefined,
        email: email || undefined,
      };

      const response = await createClinic(payload);

      if (response.isSuccess) {
        alert("Đã tạo phòng khám mới thành công!");
        setShowCreateModal(false);
        await fetchClinics();
      } else {
        alert(response.message || "Không thể tạo phòng khám");
      }
    } catch (error) {
      console.error("Error creating clinic:", error);
      alert("Lỗi kết nối server");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteClinic = async () => {
    if (!selectedClinic) {
      alert("Không có phòng khám nào được chọn!");
      return;
    }

    if (clinics.length <= 1) {
      alert("Không thể xóa phòng khám duy nhất!");
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa phòng khám "${selectedClinic.name}"?\n\nLưu ý: Hành động này không thể hoàn tác!`)) {
      return;
    }

    try {
      setSaving(true);
      const response = await deleteClinic(selectedClinic.clinicId);

      if (response.isSuccess) {
        alert("Đã xóa phòng khám thành công!");
        await fetchClinics();
      } else {
        alert(response.message || "Không thể xóa phòng khám");
      }
    } catch (error) {
      console.error("Error deleting clinic:", error);
      alert("Lỗi kết nối server");
    } finally {
      setSaving(false);
    }
  };

  const handleOpenCreateModal = () => {
    // Clear form for new clinic
    setClinicCode("");
    setClinicName("");
    setPhone("");
    setEmail("");
    setShowCreateModal(true);
  };

  return (
    <div className="px-6 py-8 lg:px-10">
      <div className="max-w-[900px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <span className="inline-flex items-center rounded-full bg-[#E0ECFF] text-[#2563EB] text-[11px] font-semibold px-4 py-1.5 tracking-wide uppercase mb-3">
              SYSTEM SETTINGS
            </span>
            <h1 className="text-xl font-semibold text-slate-900">Cài đặt hệ thống</h1>
            <p className="text-sm text-slate-500 mt-1">Quản lý phòng khám và cấu hình hệ thống</p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#2563EB] text-white text-sm font-semibold rounded-xl hover:bg-[#1D4ED8] shadow-lg shadow-blue-500/25 transition"
          >
            <FiPlus className="w-4 h-4" />
            Thêm phòng khám
          </button>
        </div>

        {/* Loading / Error State */}
        {loadingClinics && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563EB] mx-auto"></div>
            <p className="mt-2 text-sm text-slate-500">Đang tải...</p>
          </div>
        )}

        {errorClinics && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">Lỗi khi tải dữ liệu</p>
              <p className="text-xs text-red-700 mt-1">{errorClinics}</p>
            </div>
            <button
              onClick={fetchClinics}
              className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <FiRefreshCw className="w-3.5 h-3.5" />
              Thử lại
            </button>
          </div>
        )}

        {/* Clinic Information */}
        {!loadingClinics && !errorClinics && clinics.length > 0 && (
          <>
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <FiSettings className="w-5 h-5 text-[#2563EB]" />
                  <h2 className="text-sm font-semibold text-slate-900">Thông tin phòng khám</h2>
                </div>
                {selectedClinic && clinics.length > 1 && (
                  <button
                    onClick={handleDeleteClinic}
                    disabled={saving}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition disabled:opacity-50"
                  >
                    <FiTrash2 className="w-3.5 h-" />
                    Xóa phòng khám
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Clinic Selector */}
                {clinics.length > 1 && (
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Chọn phòng khám</label>
                    <select
                      value={selectedClinic?.clinicId || ""}
                      onChange={(e) => {
                        const clinic = clinics.find(c => c.clinicId === e.target.value);
                        if (clinic) handleSelectClinic(clinic);
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-[#2563EB] focus:bg-white outline-none"
                    >
                      {clinics.map(clinic => (
                        <option key={clinic.clinicId} value={clinic.clinicId}>
                          {clinic.name} ({clinic.code})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Mã phòng khám</label>
                    <input
                      type="text"
                      value={clinicCode}
                      onChange={(e) => setClinicCode(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-[#2563EB] focus:bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Tên phòng khám</label>
                    <input
                      type="text"
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-[#2563EB] focus:bg-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Số điện thoại</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-[#2563EB] focus:bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-[#2563EB] focus:bg-white outline-none"
                    />
                  </div>
                </div>

                {/* Frontend-only fields note */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                  <p className="text-xs text-blue-800">
                    <strong>Lưu ý:</strong> Các cài đặt về địa chỉ, giờ làm việc, lịch hẹn và thông báo chưa được kết nối với backend.
                    Bạn chỉ có thể chỉnh sửa: Mã phòng khám, Tên, SĐT, và Email.
                  </p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving || !selectedClinic}
                className="flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white text-sm font-semibold rounded-xl hover:bg-[#1D4ED8] shadow-lg shadow-blue-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <FiSave className="w-4 h-4" />
                    Lưu cài đặt
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* No clinics state */}
        {!loadingClinics && !errorClinics && clinics.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <FiSettings className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Chưa có phòng khám nào</h3>
            <p className="text-sm text-slate-500 mb-6">Tạo phòng khám đầu tiên để bắt đầu quản lý hệ thống</p>
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white text-sm font-semibold rounded-xl hover:bg-[#1D4ED8] shadow-lg shadow-blue-500/25 transition"
            >
              <FiPlus className="w-4 h-4" />
              Tạo phòng khám mới
            </button>
          </div>
        )}
      </div>

      {/* Create Clinic Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-slate-900">Tạo phòng khám mới</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 transition"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Mã phòng khám *</label>
                <input
                  type="text"
                  value={clinicCode}
                  onChange={(e) => setClinicCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-[#2563EB] focus:bg-white outline-none"
                  placeholder="VD: NK-HCM-02"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Tên phòng khám *</label>
                <input
                  type="text"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-[#2563EB] focus:bg-white outline-none"
                  placeholder="VD: Nha Khoa ABC"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Số điện thoại</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-[#2563EB] focus:bg-white outline-none"
                  placeholder="VD: 028-1234-5678"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-[#2563EB] focus:bg-white outline-none"
                  placeholder="VD: contact@clinic.com"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateClinic}
                disabled={creating}
                className="flex-1 px-4 py-2.5 bg-[#2563EB] text-white text-sm font-semibold rounded-xl hover:bg-[#1D4ED8] transition disabled:opacity-50"
              >
                {creating ? "Đang tạo..." : "Tạo phòng khám"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettingsPage;
