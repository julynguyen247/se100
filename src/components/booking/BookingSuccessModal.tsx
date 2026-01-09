import { useState } from 'react';
import {
    FiCheckCircle,
    FiCopy,
    FiX,
    FiCalendar,
    FiClock,
} from 'react-icons/fi';

interface BookingSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointmentData: {
        appointmentId: string;
        cancelToken: string;
        rescheduleToken: string;
        doctorName?: string;
        serviceName?: string;
        date?: string;
        time?: string;
        // Credentials nếu tạo tài khoản mới
        username?: string | null;
        password?: string | null;
        // For reschedule slot fetching
        clinicId?: string;
        doctorId?: string;
        serviceId?: string;
    };
}

export default function BookingSuccessModal({
    isOpen,
    onClose,
    appointmentData,
}: BookingSuccessModalProps) {
    const [copiedCancel, setCopiedCancel] = useState(false);
    const [copiedReschedule, setCopiedReschedule] = useState(false);
    const [copiedCredentials, setCopiedCredentials] = useState(false);

    if (!isOpen) return null;

    const baseUrl = window.location.origin;
    const cancelLink = `${baseUrl}/cancel-appointment?token=${appointmentData.cancelToken}`;

    // Build reschedule link with additional params for slot fetching
    const rescheduleParams = new URLSearchParams({
        token: appointmentData.rescheduleToken,
        ...(appointmentData.clinicId && { clinicId: appointmentData.clinicId }),
        ...(appointmentData.doctorId && { doctorId: appointmentData.doctorId }),
        ...(appointmentData.serviceId && {
            serviceId: appointmentData.serviceId,
        }),
    });
    const rescheduleLink = `${baseUrl}/reschedule-appointment?${rescheduleParams.toString()}`;

    const copyToClipboard = (
        text: string,
        type: 'cancel' | 'reschedule' | 'credentials'
    ) => {
        navigator.clipboard.writeText(text);
        if (type === 'cancel') {
            setCopiedCancel(true);
            setTimeout(() => setCopiedCancel(false), 2000);
        } else if (type === 'reschedule') {
            setCopiedReschedule(true);
            setTimeout(() => setCopiedReschedule(false), 2000);
        } else {
            setCopiedCredentials(true);
            setTimeout(() => setCopiedCredentials(false), 2000);
        }
    };

    const hasCredentials = appointmentData.username && appointmentData.password;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-t-2xl">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition"
                    >
                        <FiX size={24} />
                    </button>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
                            <FiCheckCircle
                                className="text-green-500"
                                size={32}
                            />
                        </div>
                        <h2 className="text-2xl font-bold">
                            Đặt Lịch Thành Công!
                        </h2>
                        <p className="text-green-100 mt-2">
                            Chúng tôi đã nhận được lịch hẹn của bạn
                        </p>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Appointment Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                            <FiCalendar className="mr-2" />
                            Thông Tin Lịch Hẹn
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            {appointmentData.doctorName && (
                                <div>
                                    <span className="text-blue-600">
                                        Bác sĩ:
                                    </span>
                                    <p className="font-medium text-blue-900">
                                        {appointmentData.doctorName}
                                    </p>
                                </div>
                            )}
                            {appointmentData.serviceName && (
                                <div>
                                    <span className="text-blue-600">
                                        Dịch vụ:
                                    </span>
                                    <p className="font-medium text-blue-900">
                                        {appointmentData.serviceName}
                                    </p>
                                </div>
                            )}
                            {appointmentData.date && (
                                <div>
                                    <span className="text-blue-600">Ngày:</span>
                                    <p className="font-medium text-blue-900">
                                        {appointmentData.date}
                                    </p>
                                </div>
                            )}
                            {appointmentData.time && (
                                <div>
                                    <span className="text-blue-600">Giờ:</span>
                                    <p className="font-medium text-blue-900 flex items-center">
                                        <FiClock className="mr-1" size={14} />
                                        {appointmentData.time}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* New Account Credentials */}
                    {hasCredentials && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <h3 className="font-semibold text-purple-900 mb-2">
                                🎉 Tài Khoản Của Bạn
                            </h3>
                            <p className="text-sm text-purple-700 mb-3">
                                Chúng tôi đã tạo tài khoản để bạn quản lý lịch
                                hẹn dễ dàng hơn:
                            </p>
                            <div className="bg-white rounded-lg p-3 space-y-2">
                                <div>
                                    <span className="text-xs text-purple-600">
                                        Tên đăng nhập:
                                    </span>
                                    <p className="font-mono font-semibold text-purple-900">
                                        {appointmentData.username}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-xs text-purple-600">
                                        Mật khẩu:
                                    </span>
                                    <p className="font-mono font-semibold text-purple-900">
                                        {appointmentData.password}
                                    </p>
                                </div>
                                <button
                                    onClick={() =>
                                        copyToClipboard(
                                            `Username: ${appointmentData.username}\nPassword: ${appointmentData.password}`,
                                            'credentials'
                                        )
                                    }
                                    className="w-full mt-2 px-3 py-2 text-sm bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition flex items-center justify-center"
                                >
                                    <FiCopy className="mr-2" size={14} />
                                    {copiedCredentials
                                        ? '✓ Đã sao chép!'
                                        : 'Sao chép thông tin'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Important Notice */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h3 className="font-semibold text-yellow-900 mb-2">
                            ⚠️ Lưu Ý Quan Trọng
                        </h3>
                        <p className="text-sm text-yellow-800">
                            Vui lòng lưu lại các liên kết bên dưới để có thể hủy
                            hoặc đổi lịch hẹn khi cần. Chúng tôi cũng đã gửi các
                            liên kết này qua email/SMS của bạn.
                        </p>
                    </div>

                    {/* Action Links */}
                    <div className="space-y-4">
                        {/* Cancel Link */}
                        <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                            <h4 className="font-semibold text-red-900 mb-2 text-sm">
                                🚫 Hủy Lịch Hẹn
                            </h4>
                            <p className="text-xs text-red-700 mb-3">
                                Click vào link này để hủy lịch hẹn (chỉ hủy được
                                trước 2 giờ)
                            </p>
                            <div className="bg-white border border-red-300 rounded-lg p-3 mb-2 break-all text-xs font-mono text-red-800">
                                {cancelLink}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        copyToClipboard(cancelLink, 'cancel')
                                    }
                                    className="flex-1 px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center justify-center"
                                >
                                    <FiCopy className="mr-2" size={14} />
                                    {copiedCancel
                                        ? '✓ Đã sao chép!'
                                        : 'Sao chép link'}
                                </button>
                                <a
                                    href={cancelLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 px-3 py-2 text-sm border border-red-300 text-red-700 rounded-lg hover:bg-red-100 transition text-center"
                                >
                                    Mở link
                                </a>
                            </div>
                        </div>

                        {/* Reschedule Link */}
                        <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                            <h4 className="font-semibold text-blue-900 mb-2 text-sm">
                                📅 Đổi Lịch Hẹn
                            </h4>
                            <p className="text-xs text-blue-700 mb-3">
                                Click vào link này để chọn ngày giờ mới cho lịch
                                hẹn
                            </p>
                            <div className="bg-white border border-blue-300 rounded-lg p-3 mb-2 break-all text-xs font-mono text-blue-800">
                                {rescheduleLink}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        copyToClipboard(
                                            rescheduleLink,
                                            'reschedule'
                                        )
                                    }
                                    className="flex-1 px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center"
                                >
                                    <FiCopy className="mr-2" size={14} />
                                    {copiedReschedule
                                        ? '✓ Đã sao chép!'
                                        : 'Sao chép link'}
                                </button>
                                <a
                                    href={rescheduleLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 px-3 py-2 text-sm border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition text-center"
                                >
                                    Mở link
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 text-sm font-semibold bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition"
                        >
                            Đóng
                        </button>
                        <button
                            onClick={() => (window.location.href = '/')}
                            className="flex-1 px-4 py-3 text-sm font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                            Về Trang Chủ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
