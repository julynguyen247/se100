import React from 'react';
import { FiX, FiCheckCircle, FiXCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    type?: AlertType;
    title?: string;
    message: string;
}

const AlertModal: React.FC<AlertModalProps> = ({
    isOpen,
    onClose,
    type = 'info',
    title,
    message,
}) => {
    if (!isOpen) return null;

    const config = {
        success: {
            icon: FiCheckCircle,
            iconColor: 'text-green-500',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            buttonColor: 'bg-green-600 hover:bg-green-700',
            defaultTitle: 'Thành công',
        },
        error: {
            icon: FiXCircle,
            iconColor: 'text-red-500',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            buttonColor: 'bg-red-600 hover:bg-red-700',
            defaultTitle: 'Lỗi',
        },
        warning: {
            icon: FiAlertCircle,
            iconColor: 'text-amber-500',
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-200',
            buttonColor: 'bg-amber-600 hover:bg-amber-700',
            defaultTitle: 'Cảnh báo',
        },
        info: {
            icon: FiInfo,
            iconColor: 'text-blue-500',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            buttonColor: 'bg-blue-600 hover:bg-blue-700',
            defaultTitle: 'Thông báo',
        },
    };

    const { icon: Icon, iconColor, bgColor, borderColor, buttonColor, defaultTitle } = config[type];
    const displayTitle = title || defaultTitle;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform animate-slideUp"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Icon & Close Button */}
                <div className="relative px-6 pt-6 pb-4 flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full ${bgColor} border-2 ${borderColor} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${iconColor}`} />
                    </div>

                    <div className="flex-1 pt-1">
                        <h3 className="text-lg font-semibold text-slate-900">
                            {displayTitle}
                        </h3>
                    </div>

                    <button
                        onClick={onClose}
                        className="flex-shrink-0 p-1 hover:bg-slate-100 rounded-lg transition"
                    >
                        <FiX className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Message */}
                <div className="px-6 pb-6">
                    <p className="text-sm text-slate-600 leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Action Button */}
                <div className="px-6 pb-6">
                    <button
                        onClick={onClose}
                        className={`w-full px-4 py-2.5 rounded-xl text-white font-semibold transition ${buttonColor}`}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertModal;
