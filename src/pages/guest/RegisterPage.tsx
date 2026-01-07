import React, { useState, FormEvent } from "react";
import {
  FiArrowLeft,
  FiUser,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { registerAPI } from "../../services/api";
import ErrorModal from "../../components/ErrorModal";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Error modal state
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorType, setErrorType] = useState<"REGISTER_FAILED" | "VALIDATION_ERROR" | "SERVER_ERROR" | "NETWORK_ERROR" | "GENERIC">("GENERIC");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate password match
    if (password !== confirmPassword) {
      setErrorType("VALIDATION_ERROR");
      setErrorMessage("Mật khẩu và xác nhận mật khẩu không khớp!");
      setShowErrorModal(true);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setErrorType("VALIDATION_ERROR");
      setErrorMessage("Mật khẩu phải có ít nhất 6 ký tự!");
      setShowErrorModal(true);
      return;
    }

    setLoading(true);

    try {
      const response = await registerAPI(username, password);

      if (response?.isSuccess) {
        // Navigate to login page directly without notification
        navigate("/login");
      } else {
        // Show error modal
        setErrorType("REGISTER_FAILED");
        setErrorMessage(typeof response === 'string' ? response : "Tên đăng nhập đã tồn tại hoặc không hợp lệ");
        setShowErrorModal(true);
      }
    } catch (error: any) {
      // Determine error type based on error details
      if (error?.code === "ERR_NETWORK") {
        setErrorType("NETWORK_ERROR");
        setErrorMessage("Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.");
      } else if (error?.response?.status >= 500) {
        setErrorType("SERVER_ERROR");
        setErrorMessage("Máy chủ đang gặp sự cố. Vui lòng thử lại sau.");
      } else {
        setErrorType("REGISTER_FAILED");
        setErrorMessage(error?.response?.data || error?.message || "Không thể tạo tài khoản. Vui lòng thử lại.");
      }
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
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
              Điền thông tin để tạo tài khoản mới
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                Tên đăng nhập <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nhập tên đăng nhập"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
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
                  required
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
                  required
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
              disabled={loading}
              className="mt-2 w-full rounded-lg bg-[#2563EB] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang đăng ký..." : "Đăng ký"}
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

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        errorType={errorType}
        customMessage={errorMessage}
      />
    </div>
  );
};

export default RegisterPage;
