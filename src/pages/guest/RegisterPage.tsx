import React, { useState, FormEvent } from "react";
import {
  FiArrowLeft,
  FiUser,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: sau này gắn registerAPI ở đây
    console.log({ fullName, email, phone, password, confirmPassword });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#E5F0FF] via-[#EFF4FF] to-[#DDEBFF] relative">

      <div className="w-full max-w-lg px-4">
        <div className="bg-white rounded-2xl shadow-xl px-8 py-8 sm:px-10 sm:py-10">
          {/* Link quay lại */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 text-xs text-[#2563EB] hover:text-[#1D4ED8] mb-6"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Quay lại đăng nhập</span>
          </button>

          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-full bg-[#E0EDFF] flex items-center justify-center text-[#2563EB] mb-3">
              <FiUser className="w-7 h-7" />
            </div>
            <h1 className="text-base font-semibold text-slate-800">
              Đăng ký tài khoản
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Tạo tài khoản bệnh nhân mới
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Họ và tên */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="example@email.com"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Số điện thoại */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="0123456789"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* Mật khẩu */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Ít nhất 6 ký tự"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 pr-10 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <FiEyeOff className="w-4 h-4" />
                  ) : (
                    <FiEye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Xác nhận mật khẩu */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 pr-10 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="w-4 h-4" />
                  ) : (
                    <FiEye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Button đăng ký */}
            <button
              type="submit"
              className="mt-2 w-full rounded-lg bg-[#2563EB] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1D4ED8]"
            >
              Đăng ký
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-xs">
            <span className="text-slate-500">Đã có tài khoản? </span>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-[#2563EB] font-medium hover:underline"
            >
              Đăng nhập ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
