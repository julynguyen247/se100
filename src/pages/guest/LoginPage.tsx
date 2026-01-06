import React, { useState, FormEvent } from "react";
import { FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: sau này gắn loginAPI ở đây
    console.log({ email, password });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#E5F0FF] via-[#EFF4FF] to-[#DDEBFF] relative">

      <div className="w-full max-w-md px-4">
        <div className="bg-white rounded-2xl shadow-xl px-10 py-12">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[#E0EDFF] flex items-center justify-center text-[#2563EB] mb-3">
              <FiUser className="w-8 h-8" />
            </div>
            <h1 className="text-base font-semibold text-slate-800 text-center">
              Hệ Thống Quản Lý Nha Khoa
            </h1>
            <p className="text-xs text-slate-500 mt-1">Đăng nhập để tiếp tục</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">
                Mật khẩu
              </label>
              <input
                type="password"
                placeholder="Nhập mật khẩu"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-lg bg-[#2563EB] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1D4ED8]"
            >
              Đăng nhập
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-xs">
            <span className="text-slate-500">Chưa có tài khoản? </span>
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-[#2563EB] font-medium hover:underline"
            >
              Đăng ký tài khoản mới
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
