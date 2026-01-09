import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    FiCheckCircle,
    FiXCircle,
    FiAlertCircle,
    FiArrowLeft,
    FiFileText,
} from 'react-icons/fi';
import { getBillDetail, type BillDetail } from '@/services/apiReceptionist';

// VNPay Response Codes
const VNPAY_RESPONSE_CODES: Record<string, string> = {
    '00': 'Giao dịch thành công',
    '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
    '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
    '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
    '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
    '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
    '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.',
    '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
    '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
    '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
    '75': 'Ngân hàng thanh toán đang bảo trì.',
    '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch',
    '99': 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)',
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};

const PaymentResult: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [bill, setBill] = useState<BillDetail | null>(null);
    const [loading, setLoading] = useState(true);

    // Read params from backend redirect (not raw VNPay params)
    const success = searchParams.get('success');
    const billId = searchParams.get('billId');
    const transactionNo = searchParams.get('transactionNo');
    const amountParam = searchParams.get('amount');
    const bankCode = searchParams.get('bankCode');
    const payDate = searchParams.get('payDate');
    const orderInfo = searchParams.get('orderInfo');
    const errorCode = searchParams.get('code');
    const errorMessage = searchParams.get('message');
    const signatureError = searchParams.get('error');

    const isSuccess = success === 'true';
    const amount = amountParam ? parseFloat(amountParam) : 0;

    // Get error message from params or lookup table
    const getErrorMessage = () => {
        if (signatureError === 'invalid_signature') {
            return 'Chữ ký giao dịch không hợp lệ. Vui lòng thử lại.';
        }
        if (errorMessage) {
            return decodeURIComponent(errorMessage);
        }
        if (errorCode) {
            return (
                VNPAY_RESPONSE_CODES[errorCode] ||
                'Lỗi không xác định. Vui lòng liên hệ hỗ trợ.'
            );
        }
        return 'Giao dịch không thành công.';
    };

    // Log VNPay callback parameters
    console.log('[VNPAY_RESULT] Payment result page loaded');
    console.log('[VNPAY_RESULT] Success:', success);
    console.log('[VNPAY_RESULT] Bill ID:', billId);
    console.log('[VNPAY_RESULT] Transaction No:', transactionNo);
    console.log('[VNPAY_RESULT] Amount:', amount);
    console.log('[VNPAY_RESULT] Bank Code:', bankCode);
    console.log('[VNPAY_RESULT] Is Success:', isSuccess);
    console.log(
        '[VNPAY_RESULT] All URL params:',
        Object.fromEntries(searchParams)
    );

    useEffect(() => {
        // Verify bill status after payment
        if (billId) {
            verifyBillStatus(billId);
        } else {
            setLoading(false);
        }
    }, [billId]);

    const verifyBillStatus = async (id: string) => {
        console.log('[VNPAY_RESULT] Verifying bill status for:', id);
        try {
            const response = await getBillDetail(id);
            console.log('[VNPAY_RESULT] Bill detail response:', response);
            if (response.isSuccess && response.data) {
                setBill(response.data);
                console.log(
                    '[VNPAY_RESULT] Bill status:',
                    response.data.status
                );
            }
        } catch (err) {
            console.error('[VNPAY_RESULT] Failed to verify bill status:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-600">Đang xác thực giao dịch...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header Section */}
                    <div
                        className={`p-8 text-center ${
                            isSuccess
                                ? 'bg-gradient-to-br from-emerald-500 to-green-600'
                                : 'bg-gradient-to-br from-red-500 to-rose-600'
                        }`}
                    >
                        <div className="flex justify-center mb-4">
                            {isSuccess ? (
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                                    <FiCheckCircle className="w-12 h-12 text-emerald-500" />
                                </div>
                            ) : (
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                                    <FiXCircle className="w-12 h-12 text-red-500" />
                                </div>
                            )}
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">
                            {isSuccess
                                ? 'Thanh toán thành công!'
                                : 'Thanh toán thất bại'}
                        </h1>
                        <p className="text-white/90 text-sm">
                            {isSuccess
                                ? 'Giao dịch của bạn đã được xử lý thành công'
                                : getErrorMessage()}
                        </p>
                    </div>

                    {/* Transaction Details */}
                    <div className="p-8 space-y-6">
                        {/* Transaction Info */}
                        <div>
                            <h2 className="text-sm font-semibold text-slate-700 mb-3">
                                Thông tin giao dịch
                            </h2>
                            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                                {transactionNo && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">
                                            Mã giao dịch VNPay
                                        </span>
                                        <span className="text-sm font-medium text-slate-900">
                                            {transactionNo}
                                        </span>
                                    </div>
                                )}
                                {billId && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">
                                            Mã hoá đơn
                                        </span>
                                        <span className="text-sm font-medium text-slate-900">
                                            {bill?.invoiceNumber || billId}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600">
                                        Số tiền
                                    </span>
                                    <span className="text-lg font-bold text-blue-600">
                                        {formatCurrency(amount)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600">
                                        Trạng thái
                                    </span>
                                    {isSuccess ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                                            <FiCheckCircle className="w-3 h-3" />
                                            Thành công
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                            <FiXCircle className="w-3 h-3" />
                                            Thất bại
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Bill Details (if available) */}
                        {bill && (
                            <div>
                                <h2 className="text-sm font-semibold text-slate-700 mb-3">
                                    Thông tin hoá đơn
                                </h2>
                                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">
                                            Bệnh nhân
                                        </span>
                                        <span className="text-sm font-medium text-slate-900">
                                            {bill.patient.name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">
                                            Số điện thoại
                                        </span>
                                        <span className="text-sm font-medium text-slate-900">
                                            {bill.patient.phone}
                                        </span>
                                    </div>
                                    {bill.doctor && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600">
                                                Bác sĩ điều trị
                                            </span>
                                            <span className="text-sm font-medium text-slate-900">
                                                {bill.doctor}
                                            </span>
                                        </div>
                                    )}
                                    <div className="border-t border-slate-200 pt-3">
                                        <div className="space-y-2">
                                            {bill.items.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex justify-between items-center text-xs"
                                                >
                                                    <span className="text-slate-600">
                                                        {item.name} x
                                                        {item.quantity}
                                                    </span>
                                                    <span className="text-slate-900">
                                                        {formatCurrency(
                                                            item.amount
                                                        )}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error Details (if failed) */}
                        {!isSuccess && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                                <FiAlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="text-sm font-semibold text-amber-900 mb-1">
                                        Lưu ý
                                    </h3>
                                    <p className="text-sm text-amber-800">
                                        Nếu bạn gặp vấn đề với giao dịch này,
                                        vui lòng liên hệ bộ phận hỗ trợ hoặc thử
                                        lại sau vài phút.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <button
                                onClick={() =>
                                    navigate('/receptionist/billing')
                                }
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition"
                            >
                                <FiArrowLeft className="w-4 h-4" />
                                Quay lại trang thanh toán
                            </button>
                            {bill && isSuccess && (
                                <button
                                    onClick={() =>
                                        navigate(
                                            `/receptionist/billing?billId=${bill.id}`
                                        )
                                    }
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition"
                                >
                                    <FiFileText className="w-4 h-4" />
                                    Xem hoá đơn
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Support Info */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-600">
                        Cần hỗ trợ? Liên hệ hotline:{' '}
                        <a
                            href="tel:1900xxxx"
                            className="text-blue-600 font-medium hover:underline"
                        >
                            1900 xxxx
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentResult;
