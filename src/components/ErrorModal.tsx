import React from "react";
import { FiX, FiAlertCircle, FiXCircle, FiInfo } from "react-icons/fi";

interface ErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    errorType?: "LOGIN_FAILED" | "REGISTER_FAILED" | "VALIDATION_ERROR" | "SERVER_ERROR" | "NETWORK_ERROR" | "GENERIC";
    customMessage?: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
    isOpen,
    onClose,
    errorType = "GENERIC",
    customMessage
}) => {
    if (!isOpen) return null;

    // Switch case cho các loại lỗi khác nhau
    const getErrorContent = () => {
        switch (errorType) {
            case "LOGIN_FAILED":
                return {
                    icon: <FiXCircle className="w-16 h-16 text-red-500" />,
                    title: "Đăng nhập thất bại",
                    message: customMessage || "Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại.",
                    bgColor: "bg-red-50",
                    borderColor: "border-red-200"
                };

            case "REGISTER_FAILED":
                return {
                    icon: <FiXCircle className="w-16 h-16 text-red-500" />,
                    title: "Đăng ký thất bại",
                    message: customMessage || "Không thể tạo tài khoản. Tên đăng nhập có thể đã tồn tại.",
                    bgColor: "bg-red-50",
                    borderColor: "border-red-200"
                };

            case "VALIDATION_ERROR":
                return {
                    icon: <FiAlertCircle className="w-16 h-16 text-orange-500" />,
                    title: "Lỗi xác thực",
                    message: customMessage || "Vui lòng kiểm tra lại thông tin đã nhập.",
                    bgColor: "bg-orange-50",
                    borderColor: "border-orange-200"
                };

            case "SERVER_ERROR":
                return {
                    icon: <FiXCircle className="w-16 h-16 text-red-600" />,
                    title: "Lỗi máy chủ",
                    message: customMessage || "Máy chủ đang gặp sự cố. Vui lòng thử lại sau.",
                    bgColor: "bg-red-50",
                    borderColor: "border-red-300"
                };

            case "NETWORK_ERROR":
                return {
                    icon: <FiAlertCircle className="w-16 h-16 text-yellow-600" />,
                    title: "Lỗi kết nối",
                    message: customMessage || "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.",
                    bgColor: "bg-yellow-50",
                    borderColor: "border-yellow-200"
                };

            case "GENERIC":
            default:
                return {
                    icon: <FiInfo className="w-16 h-16 text-blue-500" />,
                    title: "Thông báo",
                    message: customMessage || "Đã xảy ra lỗi. Vui lòng thử lại.",
                    bgColor: "bg-blue-50",
                    borderColor: "border-blue-200"
                };
        }
    };

    const { icon, title, message, bgColor, borderColor } = getErrorContent();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-fadeIn">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
                >
                    <FiX className="w-6 h-6" />
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                    {icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-center text-slate-800 mb-3">
                    {title}
                </h3>

                {/* Message */}
                <div className={`${bgColor} ${borderColor} border rounded-lg p-4 mb-6`}>
                    <p className="text-sm text-slate-700 text-center leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Action button */}
                <button
                    onClick={onClose}
                    className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold py-3 px-4 rounded-lg transition shadow-sm"
                >
                    Đã hiểu
                </button>
            </div>
        </div>
    );
};

export default ErrorModal;
