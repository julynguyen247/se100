import React, { useState } from 'react';
import { FiX, FiCopy, FiCheck, FiMail, FiMessageSquare } from 'react-icons/fi';

interface CredentialModalProps {
    isOpen: boolean;
    onClose: () => void;
    credentials: {
        username: string;
        password: string;
        patientName: string;
        patientPhone: string;
    };
}

const CredentialModal: React.FC<CredentialModalProps> = ({
    isOpen,
    onClose,
    credentials,
}) => {
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [sendingEmail, setSendingEmail] = useState(false);
    const [sendingSMS, setSendingSMS] = useState(false);

    if (!isOpen) return null;

    const handleCopy = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const handleSendEmail = async () => {
        setSendingEmail(true);
        try {
            
            console.log('Email would be sent to:', credentials.patientPhone);
            alert('Tính năng gửi email đang được phát triển');
        } catch (error) {
            console.error('Failed to send email:', error);
            alert('Không thể gửi email');
        } finally {
            setSendingEmail(false);
        }
    };

    const handleSendSMS = async () => {
        setSendingSMS(true);
        try {
            // TODO: Implement SMS sending API call
            // await sendCredentialsSMS({ phone: credentials.patientPhone, username: credentials.username, password: credentials.password });
            console.log('SMS would be sent to:', credentials.patientPhone);
            alert('Tính năng gửi SMS đang được phát triển');
        } catch (error) {
            console.error('Failed to send SMS:', error);
            alert('Không thể gửi SMS');
        } finally {
            setSendingSMS(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 mx-4 animate-in fade-in zoom-in duration-200">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <FiX className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="mb-6">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                        <FiCheck className="w-6 h-6 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                        Tài khoản mới đã được tạo!
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Bệnh nhân:{' '}
                        <span className="font-medium text-gray-700">
                            {credentials.patientName}
                        </span>
                    </p>
                </div>

                {/* Credentials display */}
                <div className="space-y-4 mb-6">
                    {/* Username */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <label className="block text-xs font-medium text-gray-600 mb-2">
                            Username (Số điện thoại)
                        </label>
                        <div className="flex items-center justify-between gap-2">
                            <code className="text-lg font-mono font-semibold text-gray-900">
                                {credentials.username}
                            </code>
                            <button
                                onClick={() =>
                                    handleCopy(credentials.username, 'username')
                                }
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                {copiedField === 'username' ? (
                                    <>
                                        <FiCheck className="w-4 h-4 text-green-600" />
                                        <span className="text-green-600">
                                            Copied
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <FiCopy className="w-4 h-4" />
                                        <span>Copy</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Password */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <label className="block text-xs font-medium text-gray-600 mb-2">
                            Password (Số điện thoại)
                        </label>
                        <div className="flex items-center justify-between gap-2">
                            <code className="text-lg font-mono font-semibold text-gray-900">
                                {credentials.password}
                            </code>
                            <button
                                onClick={() =>
                                    handleCopy(credentials.password, 'password')
                                }
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                {copiedField === 'password' ? (
                                    <>
                                        <FiCheck className="w-4 h-4 text-green-600" />
                                        <span className="text-green-600">
                                            Copied
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <FiCopy className="w-4 h-4" />
                                        <span>Copy</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <button
                            onClick={handleSendSMS}
                            disabled={sendingSMS}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FiMessageSquare className="w-4 h-4" />
                            {sendingSMS ? 'Đang gửi...' : 'Gửi SMS'}
                        </button>
                        <button
                            onClick={handleSendEmail}
                            disabled={sendingEmail}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FiMail className="w-4 h-4" />
                            {sendingEmail ? 'Đang gửi...' : 'Gửi Email'}
                        </button>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Đóng
                    </button>
                </div>

                {/* Note */}
                <p className="mt-4 text-xs text-gray-500 text-center">
                    💡 Vui lòng thông báo thông tin đăng nhập cho bệnh nhân
                </p>
            </div>
        </div>
    );
};

export default CredentialModal;
