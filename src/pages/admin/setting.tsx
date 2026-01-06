import React, { useState } from "react";
import { FiSave, FiSettings, FiBell, FiCalendar, FiMail, FiMessageSquare, FiGlobe, FiClock } from "react-icons/fi";

const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    // Clinic Info
    clinicName: "Nha Khoa Dental Care",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    phone: "028 1234 5678",
    email: "contact@dentalcare.vn",
    workingHours: "8:00 - 20:00",

    // Appointment Settings
    appointmentDuration: "30",
    maxAppointmentsPerDay: "50",
    enableOnlineBooking: true,
    allowCancellation: true,
    cancellationHours: "24",

    // Notification Settings
    enableSMSNotification: true,
    enableEmailNotification: true,
    reminderHours: "24",
    sendConfirmation: true,
  });

  const handleSave = () => {
    console.log("Settings saved:", settings);
    alert("Đã lưu cài đặt thành công!");
  };

  return (
    <div className="px-6 py-8 lg:px-10">
      <div className="max-w-[900px] mx-auto space-y-6">
        {/* Header */}
        <div>
          <span className="inline-flex items-center rounded-full bg-[#E0ECFF] text-[#2563EB] text-[11px] font-semibold px-4 py-1.5 tracking-wide uppercase mb-3">
            SYSTEM SETTINGS
          </span>
          <h1 className="text-xl font-semibold text-slate-900">Cài đặt hệ thống</h1>
          <p className="text-sm text-slate-500 mt-1">Cấu hình thông tin và tùy chọn hệ thống</p>
        </div>

        {/* Clinic Information */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <FiSettings className="w-5 h-5 text-[#2563EB]" />
            <h2 className="text-sm font-semibold text-slate-900">Thông tin phòng khám</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Tên phòng khám</label>
              <input
                type="text"
                value={settings.clinicName}
                onChange={(e) => setSettings({ ...settings, clinicName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-[#2563EB] focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Địa chỉ</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-[#2563EB] focus:bg-white outline-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Số điện thoại</label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-[#2563EB] focus:bg-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-[#2563EB] focus:bg-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Giờ làm việc</label>
              <input
                type="text"
                value={settings.workingHours}
                onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-[#2563EB] focus:bg-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Appointment Settings */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <FiCalendar className="w-5 h-5 text-[#2563EB]" />
            <h2 className="text-sm font-semibold text-slate-900">Cài đặt lịch hẹn</h2>
          </div>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Thời gian mỗi lịch hẹn (phút)
                </label>
                <input
                  type="number"
                  value={settings.appointmentDuration}
                  onChange={(e) => setSettings({ ...settings, appointmentDuration: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-[#2563EB] focus:bg-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Số lịch hẹn tối đa/ngày
                </label>
                <input
                  type="number"
                  value={settings.maxAppointmentsPerDay}
                  onChange={(e) => setSettings({ ...settings, maxAppointmentsPerDay: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-[#2563EB] focus:bg-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Thời hạn hủy lịch (giờ trước hẹn)
              </label>
              <input
                type="number"
                value={settings.cancellationHours}
                onChange={(e) => setSettings({ ...settings, cancellationHours: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-[#2563EB] focus:bg-white outline-none"
              />
            </div>

            {/* Toggle Options */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <FiGlobe className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Đặt lịch trực tuyến</p>
                    <p className="text-xs text-slate-500">Cho phép bệnh nhân đặt lịch qua website</p>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableOnlineBooking}
                    onChange={(e) => setSettings({ ...settings, enableOnlineBooking: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-[#2563EB] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <FiClock className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Cho phép hủy lịch</p>
                    <p className="text-xs text-slate-500">Bệnh nhân có thể tự hủy lịch hẹn</p>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowCancellation}
                    onChange={(e) => setSettings({ ...settings, allowCancellation: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-[#2563EB] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <FiBell className="w-5 h-5 text-[#2563EB]" />
            <h2 className="text-sm font-semibold text-slate-900">Cài đặt thông báo</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <FiMessageSquare className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Thông báo SMS</p>
                  <p className="text-xs text-slate-500">Gửi SMS nhắc nhở lịch hẹn</p>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableSMSNotification}
                  onChange={(e) => setSettings({ ...settings, enableSMSNotification: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-[#2563EB] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <FiMail className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Thông báo Email</p>
                  <p className="text-xs text-slate-500">Gửi email xác nhận và nhắc nhở</p>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableEmailNotification}
                  onChange={(e) => setSettings({ ...settings, enableEmailNotification: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-[#2563EB] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <FiBell className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Gửi xác nhận đặt lịch</p>
                  <p className="text-xs text-slate-500">Tự động gửi thông báo khi đặt lịch thành công</p>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.sendConfirmation}
                  onChange={(e) => setSettings({ ...settings, sendConfirmation: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-[#2563EB] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
              </label>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Gửi nhắc nhở trước lịch hẹn (giờ)
              </label>
              <input
                type="number"
                value={settings.reminderHours}
                onChange={(e) => setSettings({ ...settings, reminderHours: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-[#2563EB] focus:bg-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white text-sm font-semibold rounded-xl hover:bg-[#1D4ED8] shadow-lg shadow-blue-500/25 transition"
          >
            <FiSave className="w-4 h-4" />
            Lưu cài đặt
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
