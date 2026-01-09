import React, { useState, useRef, useEffect } from 'react';
import {
    FiSearch,
    FiUser,
    FiDollarSign,
    FiCheck,
    FiPrinter,
    FiFileText,
    FiCreditCard,
    FiCalendar,
    FiPhone,
    FiMail,
    FiAlertCircle,
    FiX,
} from 'react-icons/fi';
import Modal from '../../components/ui/Modal';
import {
    getBills,
    getBillDetail,
    payBill,
    cancelBill,
    getBillingStats,
    createVNPayUrl,
    BillStatus,
    type BillListItem,
    type BillDetail,
    type BillingStats,
    type PayBillRequest,
} from '@/services/apiReceptionist';

// =============== TYPES ===============
type PaymentMethod = 'Cash' | 'Card' | 'Transfer' | 'VNPay';

const paymentMethods = [
    { id: 'Cash' as PaymentMethod, label: 'Tiền mặt', icon: FiDollarSign },
    { id: 'Card' as PaymentMethod, label: 'Thẻ tín dụng', icon: FiCreditCard },
    {
        id: 'Transfer' as PaymentMethod,
        label: 'Chuyển khoản',
        icon: FiDollarSign,
    },
    { id: 'VNPay' as PaymentMethod, label: 'VNPay', icon: FiCreditCard },
];

const statusConfig: Record<
    BillStatus,
    { label: string; bg: string; text: string }
> = {
    [BillStatus.Pending]: {
        label: 'Chờ thanh toán',
        bg: 'bg-amber-100',
        text: 'text-amber-700',
    },
    [BillStatus.Paid]: {
        label: 'Đã thanh toán',
        bg: 'bg-emerald-100',
        text: 'text-emerald-700',
    },
    [BillStatus.Cancelled]: {
        label: 'Đã hủy',
        bg: 'bg-red-100',
        text: 'text-red-700',
    },
    [BillStatus.Refunded]: {
        label: 'Đã hoàn tiền',
        bg: 'bg-blue-100',
        text: 'text-blue-700',
    },
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
};

// =============== PAYMENT MODAL ===============
type PaymentModalProps = {
    open: boolean;
    onClose: () => void;
    bill: BillDetail | null;
    onConfirmPayment: (billId: string, method: PaymentMethod) => Promise<void>;
};

const PaymentModal: React.FC<PaymentModalProps> = ({
    open,
    onClose,
    bill,
    onConfirmPayment,
}) => {
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('Cash');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!bill) return null;

    const handleConfirm = async () => {
        setIsProcessing(true);
        setError(null);
        try {
            await onConfirmPayment(bill.id, selectedMethod);
            onClose();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Thanh toán thất bại. Vui lòng thử lại.'
            );
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Thanh toán hoá đơn"
            className="max-w-md"
        >
            <div className="space-y-5">
                {/* Bill Summary */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <FiUser className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900">
                                {bill.patient.name}
                            </p>
                            <p className="text-xs text-slate-500">
                                {bill.patient.phone}
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-blue-100 pt-3 mt-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">
                                Tổng tiền
                            </span>
                            <span className="text-xl font-bold text-blue-600">
                                {formatCurrency(bill.totalAmount)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Services List */}
                <div>
                    <h4 className="text-xs font-semibold text-slate-700 mb-2">
                        Dịch vụ
                    </h4>
                    <div className="space-y-2">
                        {bill.items.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex justify-between items-center text-sm bg-slate-50 px-3 py-2 rounded-lg"
                            >
                                <span className="text-slate-700">
                                    {item.name}{' '}
                                    <span className="text-slate-400">
                                        x{item.quantity}
                                    </span>
                                </span>
                                <span className="font-medium text-slate-900">
                                    {formatCurrency(item.amount)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment Method Selection */}
                <div>
                    <h4 className="text-xs font-semibold text-slate-700 mb-2">
                        Phương thức thanh toán
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                        {paymentMethods.map((method) => {
                            const Icon = method.icon;
                            const isSelected = selectedMethod === method.id;
                            return (
                                <button
                                    key={method.id}
                                    onClick={() => setSelectedMethod(method.id)}
                                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                                        isSelected
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="text-xs font-medium">
                                        {method.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                        <FiAlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition"
                    >
                        Huỷ
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isProcessing}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isProcessing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <FiCheck className="w-4 h-4" />
                                Xác nhận thanh toán
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

// =============== INVOICE DETAIL MODAL ===============
type InvoiceDetailModalProps = {
    open: boolean;
    onClose: () => void;
    bill: BillDetail | null;
    onPrint: () => void;
};

const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
    open,
    onClose,
    bill,
    onPrint,
}) => {
    if (!bill) return null;

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Chi tiết hoá đơn"
            className="max-w-lg w-[95vw]"
        >
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                {/* Invoice Header - Compact */}
                <div className="flex justify-between items-start text-xs">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">
                            NHA KHOA DENTAL CLINIC
                        </h3>
                        <p className="text-[10px] text-slate-500">
                            123 Đường ABC, Quận 1, TP.HCM
                        </p>
                        <p className="text-[10px] text-slate-500">
                            Hotline: 1900 xxxx
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-slate-500">Số hoá đơn</p>
                        <p className="text-xs font-bold text-blue-600">
                            {bill.invoiceNumber}
                        </p>
                        <p className="text-[10px] text-slate-500">
                            Ngày: {formatDate(bill.createdAt)}
                        </p>
                    </div>
                </div>

                <div className="h-px bg-slate-200" />

                {/* Patient & Visit Info - Compact 2 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="bg-slate-50 rounded-lg p-2.5">
                        <h4 className="text-[10px] font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                            <FiUser className="w-3 h-3" />
                            Thông tin bệnh nhân
                        </h4>
                        <div className="space-y-0.5 text-xs">
                            <p className="font-medium text-slate-900">
                                {bill.patient.name}
                            </p>
                            <p className="flex items-center gap-1.5 text-slate-600">
                                <FiPhone className="w-3 h-3 text-slate-400" />
                                {bill.patient.phone}
                            </p>
                            {bill.patient.email && (
                                <p className="flex items-center gap-1.5 text-slate-600 truncate">
                                    <FiMail className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                    <span className="truncate">
                                        {bill.patient.email}
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2.5">
                        <h4 className="text-[10px] font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                            <FiCalendar className="w-3 h-3" />
                            Thông tin khám
                        </h4>
                        <div className="space-y-0.5 text-xs">
                            {bill.doctor && (
                                <p>
                                    <span className="text-slate-500">
                                        Bác sĩ:{' '}
                                    </span>
                                    <span className="font-medium text-slate-900">
                                        {bill.doctor}
                                    </span>
                                </p>
                            )}
                            <p>
                                <span className="text-slate-500">
                                    Ngày khám:{' '}
                                </span>
                                <span className="text-slate-900">
                                    {formatDate(bill.createdAt)}
                                </span>
                            </p>
                            <p className="flex items-center gap-1">
                                <span className="text-slate-500">
                                    Trạng thái:{' '}
                                </span>
                                <span
                                    className={`inline-flex px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                                        statusConfig[bill.status].bg
                                    } ${statusConfig[bill.status].text}`}
                                >
                                    {statusConfig[bill.status].label}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Services Table - Compact */}
                <div>
                    <h4 className="text-[10px] font-semibold text-slate-700 mb-1.5">
                        Chi tiết dịch vụ
                    </h4>
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <table className="w-full text-xs">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="text-left font-semibold text-slate-600 px-2 py-2">
                                        Dịch vụ
                                    </th>
                                    <th className="text-center font-semibold text-slate-600 px-2 py-2">
                                        SL
                                    </th>
                                    <th className="text-right font-semibold text-slate-600 px-2 py-2">
                                        Đơn giá
                                    </th>
                                    <th className="text-right font-semibold text-slate-600 px-2 py-2">
                                        Thành tiền
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {bill.items.map((item, idx) => (
                                    <tr
                                        key={idx}
                                        className="border-t border-slate-100"
                                    >
                                        <td className="px-2 py-2 text-slate-900">
                                            {item.name}
                                        </td>
                                        <td className="px-2 py-2 text-slate-600 text-center">
                                            {item.quantity}
                                        </td>
                                        <td className="px-2 py-2 text-slate-600 text-right">
                                            {formatCurrency(item.unitPrice)}
                                        </td>
                                        <td className="px-2 py-2 font-medium text-slate-900 text-right">
                                            {formatCurrency(item.amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gradient-to-r from-blue-50 to-indigo-50">
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-2 py-2 text-xs font-semibold text-slate-700 text-right"
                                    >
                                        Tổng cộng
                                    </td>
                                    <td className="px-2 py-2 text-sm font-bold text-blue-600 text-right">
                                        {formatCurrency(bill.totalAmount)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Notes - Compact */}
                {bill.notes && (
                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-2.5">
                        <h4 className="text-[10px] font-semibold text-amber-700 mb-0.5">
                            Ghi chú
                        </h4>
                        <p className="text-xs text-amber-800">{bill.notes}</p>
                    </div>
                )}
            </div>

            {/* Action Buttons - Fixed at bottom */}
            <div className="flex gap-2 pt-3 mt-3 border-t border-slate-100">
                <button
                    onClick={onClose}
                    className="flex-1 px-3 py-2 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 transition"
                >
                    Đóng
                </button>
                <button
                    onClick={onPrint}
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-xs font-medium hover:from-blue-700 hover:to-indigo-700 transition flex items-center justify-center gap-1.5"
                >
                    <FiPrinter className="w-3.5 h-3.5" />
                    In hoá đơn
                </button>
            </div>
        </Modal>
    );
};

// =============== PRINT INVOICE COMPONENT ===============
type PrintInvoiceProps = {
    bill: BillDetail;
};

const PrintInvoice = React.forwardRef<HTMLDivElement, PrintInvoiceProps>(
    ({ bill }, ref) => {
        return (
            <div
                ref={ref}
                className="print-invoice bg-white p-8"
                style={{ width: '210mm', minHeight: '297mm' }}
            >
                <style>{`
                @media print {
                    .print-invoice {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
            `}</style>

                {/* Header */}
                <div className="text-center mb-8 border-b-2 border-blue-600 pb-6">
                    <h1 className="text-2xl font-bold text-blue-600 mb-1">
                        NHA KHOA DENTAL CLINIC
                    </h1>
                    <p className="text-sm text-gray-600">
                        123 Đường ABC, Quận 1, TP.HCM
                    </p>
                    <p className="text-sm text-gray-600">
                        Hotline: 1900 xxxx | Email: contact@dentalclinic.vn
                    </p>
                </div>

                {/* Invoice Title */}
                <div className="text-center mb-8">
                    <h2 className="text-xl font-bold text-gray-800">
                        HOÁ ĐƠN THANH TOÁN
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Số: {bill.invoiceNumber}
                    </p>
                    <p className="text-sm text-gray-500">
                        Ngày: {formatDate(bill.createdAt)}
                    </p>
                </div>

                {/* Patient Info */}
                <div className="mb-8 bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                        Thông tin bệnh nhân
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p>
                                <span className="text-gray-500">
                                    Họ và tên:
                                </span>{' '}
                                <strong>{bill.patient.name}</strong>
                            </p>
                            <p>
                                <span className="text-gray-500">
                                    Số điện thoại:
                                </span>{' '}
                                {bill.patient.phone}
                            </p>
                        </div>
                        <div>
                            {bill.patient.email && (
                                <p>
                                    <span className="text-gray-500">
                                        Email:
                                    </span>{' '}
                                    {bill.patient.email}
                                </p>
                            )}
                            {bill.patient.address && (
                                <p>
                                    <span className="text-gray-500">
                                        Địa chỉ:
                                    </span>{' '}
                                    {bill.patient.address}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Doctor Info */}
                {bill.doctor && (
                    <div className="mb-8">
                        <p className="text-sm">
                            <span className="text-gray-500">
                                Bác sĩ điều trị:
                            </span>{' '}
                            <strong>{bill.doctor}</strong>
                        </p>
                    </div>
                )}

                {/* Services Table */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                        Chi tiết dịch vụ
                    </h3>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-blue-600 text-white">
                                <th className="p-3 text-left text-sm font-semibold">
                                    STT
                                </th>
                                <th className="p-3 text-left text-sm font-semibold">
                                    Dịch vụ
                                </th>
                                <th className="p-3 text-center text-sm font-semibold">
                                    Số lượng
                                </th>
                                <th className="p-3 text-right text-sm font-semibold">
                                    Đơn giá
                                </th>
                                <th className="p-3 text-right text-sm font-semibold">
                                    Thành tiền
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {bill.items.map((item, idx) => (
                                <tr
                                    key={idx}
                                    className="border-b border-gray-200"
                                >
                                    <td className="p-3 text-sm text-gray-600">
                                        {idx + 1}
                                    </td>
                                    <td className="p-3 text-sm text-gray-800">
                                        {item.name}
                                    </td>
                                    <td className="p-3 text-sm text-gray-600 text-center">
                                        {item.quantity}
                                    </td>
                                    <td className="p-3 text-sm text-gray-600 text-right">
                                        {formatCurrency(item.unitPrice)}
                                    </td>
                                    <td className="p-3 text-sm text-gray-800 font-medium text-right">
                                        {formatCurrency(item.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-blue-50">
                                <td
                                    colSpan={4}
                                    className="p-3 text-right text-sm font-bold text-gray-700"
                                >
                                    TỔNG CỘNG
                                </td>
                                <td className="p-3 text-right text-lg font-bold text-blue-600">
                                    {formatCurrency(bill.totalAmount)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Notes */}
                {bill.notes && (
                    <div className="mb-8 bg-yellow-50 p-4 rounded-lg">
                        <h3 className="text-sm font-bold text-yellow-700 mb-2">
                            Ghi chú
                        </h3>
                        <p className="text-sm text-yellow-800">{bill.notes}</p>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-12 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-8 text-center">
                        <div>
                            <p className="text-sm text-gray-600 mb-16">
                                Người lập hoá đơn
                            </p>
                            <p className="text-sm font-medium text-gray-800">
                                _____________________
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-16">
                                Bệnh nhân ký xác nhận
                            </p>
                            <p className="text-sm font-medium text-gray-800">
                                _____________________
                            </p>
                        </div>
                    </div>
                </div>

                {/* Thank you message */}
                <div className="text-center mt-8 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 italic">
                        Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        Mọi thắc mắc xin liên hệ hotline: 1900 xxxx
                    </p>
                </div>
            </div>
        );
    }
);

PrintInvoice.displayName = 'PrintInvoice';

// =============== MAIN COMPONENT ===============
const ReceptionistBilling: React.FC = () => {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<BillStatus | 'all'>('all');
    const [bills, setBills] = useState<BillListItem[]>([]);
    const [stats, setStats] = useState<BillingStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal states
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
    const [selectedBill, setSelectedBill] = useState<BillDetail | null>(null);

    // Print ref
    const printRef = useRef<HTMLDivElement>(null);

    // Fetch bills and stats on mount
    useEffect(() => {
        fetchBills();
        fetchStats();
    }, [filter]);

    const fetchBills = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getBills({
                status: filter === 'all' ? undefined : filter.toString(),
            });
            if (response.isSuccess && response.data) {
                setBills(response.data);
            } else {
                setError(response.message || 'Failed to load bills');
            }
        } catch (err) {
            setError('Không thể tải danh sách hoá đơn');
            console.error('Failed to fetch bills:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await getBillingStats();
            if (response.isSuccess && response.data) {
                setStats(response.data);
            }
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        }
    };

    const filtered = bills.filter((bill) => {
        const matchSearch =
            bill.patientName.toLowerCase().includes(search.toLowerCase()) ||
            bill.phone.includes(search);
        return matchSearch;
    });

    const handlePayment = async (bill: BillListItem) => {
        // Fetch full bill detail for payment modal
        try {
            const response = await getBillDetail(bill.id);
            if (response.isSuccess && response.data) {
                setSelectedBill(response.data);
                setPaymentModalOpen(true);
            }
        } catch (err) {
            console.error('Failed to fetch bill detail:', err);
            alert('Không thể tải chi tiết hoá đơn');
        }
    };

    const handleConfirmPayment = async (
        billId: string,
        method: PaymentMethod
    ) => {
        if (method === 'VNPay') {
            // Handle VNPay payment
            console.log('[VNPAY] Starting VNPay payment flow...', {
                billId,
                method,
                amount: selectedBill?.totalAmount,
                patient: selectedBill?.patient.name,
            });
            try {
                console.log('[VNPAY] Calling createVNPayUrl API...');
                const response = await createVNPayUrl(billId);
                console.log('[VNPAY] API Response:', response);

                if (response.isSuccess && response.data) {
                    console.log(
                        '[VNPAY] Payment URL created successfully:',
                        response.data
                    );
                    // Open VNPay in new tab to keep console logs visible
                    console.log('[VNPAY] Opening VNPay in new tab...');
                    window.open(response.data, '_blank');

                    // Close the modal
                    setPaymentModalOpen(false);
                } else {
                    console.error(
                        '[VNPAY] Failed to create payment URL:',
                        response.message
                    );
                    throw new Error(
                        response.message || 'Failed to create VNPay URL'
                    );
                }
            } catch (err) {
                console.error('[VNPAY] Error during VNPay flow:', err);
                throw new Error('Không thể tạo link thanh toán VNPay');
            }
        } else {
            // Handle cash/card/transfer payment
            try {
                const paymentData: PayBillRequest = {
                    paymentMethod: method,
                    amount: selectedBill!.totalAmount,
                    discount: null,
                    notes: null,
                };
                const response = await payBill(billId, paymentData);
                if (response.isSuccess) {
                    // Refetch bills and stats
                    await fetchBills();
                    await fetchStats();
                    alert('Thanh toán thành công!');
                } else {
                    throw new Error(response.message || 'Payment failed');
                }
            } catch (err) {
                throw err;
            }
        }
    };

    const handleViewInvoice = async (bill: BillListItem) => {
        try {
            const response = await getBillDetail(bill.id);
            if (response.isSuccess && response.data) {
                setSelectedBill(response.data);
                setInvoiceModalOpen(true);
            }
        } catch (err) {
            console.error('Failed to fetch bill detail:', err);
            alert('Không thể tải chi tiết hoá đơn');
        }
    };

    const handlePrint = () => {
        if (!selectedBill) return;

        const printContent = document.getElementById('print-area');
        if (!printContent) return;

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Hoá đơn - ${selectedBill.invoiceNumber}</title>
                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                <style>
                    @media print {
                        body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    }
                    body { font-family: 'Inter', sans-serif; }
                </style>
            </head>
            <body>
                ${printContent.innerHTML}
                <script>
                    window.onload = function() {
                        window.print();
                        window.onafterprint = function() { window.close(); };
                    };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    const handleDirectPrint = async (bill: BillListItem) => {
        try {
            const response = await getBillDetail(bill.id);
            if (response.isSuccess && response.data) {
                setSelectedBill(response.data);
                setTimeout(() => {
                    handlePrint();
                }, 100);
            }
        } catch (err) {
            console.error('Failed to fetch bill detail:', err);
            alert('Không thể in hoá đơn');
        }
    };

    const handleCancelBill = async (billId: string) => {
        if (!confirm('Bạn có chắc muốn hủy hóa đơn này?')) return;

        try {
            const response = await cancelBill(billId);
            if (response.isSuccess) {
                alert('Đã hủy hóa đơn thành công!');
                // Refetch bills and stats
                await fetchBills();
                await fetchStats();
            } else {
                throw new Error(response.message || 'Failed to cancel bill');
            }
        } catch (err) {
            console.error('Failed to cancel bill:', err);
            alert('Không thể hủy hóa đơn. Vui lòng thử lại.');
        }
    };

    if (loading && bills.length === 0) {
        return (
            <div className="px-6 py-8 lg:px-10 flex items-center justify-center h-[60vh]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-600">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-6 py-8 lg:px-10">
            <div className="max-w-[1400px] mx-auto space-y-6">
                {/* Header */}
                <div>
                    <span className="inline-flex items-center rounded-full bg-[#E0ECFF] text-[#2563EB] text-[11px] font-semibold px-4 py-1.5 tracking-wide uppercase mb-3">
                        BILLING
                    </span>
                    <h1 className="text-xl font-semibold text-slate-900">
                        Quản lý thanh toán
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Theo dõi và xử lý thanh toán
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                        <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <div>
                            <p className="font-medium text-red-900">
                                Lỗi tải dữ liệu
                            </p>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                        <button
                            onClick={() => {
                                fetchBills();
                                fetchStats();
                            }}
                            className="ml-auto px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                        >
                            Thử lại
                        </button>
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl shadow-sm p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                                <FiDollarSign className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">
                                    Chờ thanh toán
                                </p>
                                <p className="text-lg font-semibold text-slate-900">
                                    {formatCurrency(stats?.totalPending || 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                                <FiCheck className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">
                                    Đã thanh toán
                                </p>
                                <p className="text-lg font-semibold text-slate-900">
                                    {formatCurrency(stats?.totalPaid || 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                <FiFileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">
                                    Tổng hoá đơn
                                </p>
                                <p className="text-lg font-semibold text-slate-900">
                                    {bills.length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                                <FiUser className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">
                                    Bệnh nhân
                                </p>
                                <p className="text-lg font-semibold text-slate-900">
                                    {new Set(bills.map((b) => b.phone)).size}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Tìm theo tên hoặc SĐT..."
                            className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#2563EB]"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        {(
                            [
                                'all',
                                BillStatus.Pending,
                                BillStatus.Paid,
                            ] as const
                        ).map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-3 py-2 text-xs font-medium rounded-lg transition ${
                                    filter === status
                                        ? 'bg-[#2563EB] text-white'
                                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                {status === 'all'
                                    ? 'Tất cả'
                                    : statusConfig[status].label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bills Table */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="text-left text-xs font-semibold text-slate-600 px-6 py-4">
                                    Bệnh nhân
                                </th>
                                <th className="text-left text-xs font-semibold text-slate-600 px-6 py-4">
                                    Dịch vụ
                                </th>
                                <th className="text-left text-xs font-semibold text-slate-600 px-6 py-4">
                                    Ngày
                                </th>
                                <th className="text-left text-xs font-semibold text-slate-600 px-6 py-4">
                                    Tổng tiền
                                </th>
                                <th className="text-left text-xs font-semibold text-slate-600 px-6 py-4">
                                    Trạng thái
                                </th>
                                <th className="text-left text-xs font-semibold text-slate-600 px-6 py-4">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-12 text-center text-slate-500"
                                    >
                                        Không có dữ liệu
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((bill) => {
                                    const status = statusConfig[bill.status];
                                    return (
                                        <tr
                                            key={bill.id}
                                            className="border-b border-slate-50 hover:bg-slate-50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 bg-[#E0ECFF] rounded-full flex items-center justify-center">
                                                        <FiUser className="w-4 h-4 text-[#2563EB]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900">
                                                            {bill.patientName}
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            {bill.phone}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {bill.services
                                                        .slice(0, 2)
                                                        .map((s, i) => (
                                                            <span
                                                                key={i}
                                                                className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded"
                                                            >
                                                                {s}
                                                            </span>
                                                        ))}
                                                    {bill.services.length >
                                                        2 && (
                                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                                                            +
                                                            {bill.services
                                                                .length - 2}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {formatDate(bill.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                                                {formatCurrency(
                                                    bill.totalAmount
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}
                                                >
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    {bill.status ===
                                                        BillStatus.Pending && (
                                                        <>
                                                            <button
                                                                onClick={() =>
                                                                    handlePayment(
                                                                        bill
                                                                    )
                                                                }
                                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2563EB] text-white text-xs font-medium rounded-lg hover:bg-[#1D4ED8]"
                                                            >
                                                                <FiCheck className="w-3.5 h-3.5" />
                                                                Thanh toán
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleCancelBill(
                                                                        bill.id
                                                                    )
                                                                }
                                                                className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                                                                title="Hủy hóa đơn"
                                                            >
                                                                <FiX className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={() =>
                                                            handleDirectPrint(
                                                                bill
                                                            )
                                                        }
                                                        className="p-1.5 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100"
                                                        title="In hoá đơn"
                                                    >
                                                        <FiPrinter className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleViewInvoice(
                                                                bill
                                                            )
                                                        }
                                                        className="p-1.5 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100"
                                                        title="Xem chi tiết"
                                                    >
                                                        <FiFileText className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            <PaymentModal
                open={paymentModalOpen}
                onClose={() => setPaymentModalOpen(false)}
                bill={selectedBill}
                onConfirmPayment={handleConfirmPayment}
            />

            <InvoiceDetailModal
                open={invoiceModalOpen}
                onClose={() => setInvoiceModalOpen(false)}
                bill={selectedBill}
                onPrint={handlePrint}
            />

            {/* Hidden Print Area */}
            <div id="print-area" className="hidden">
                {selectedBill && (
                    <PrintInvoice ref={printRef} bill={selectedBill} />
                )}
            </div>
        </div>
    );
};

export default ReceptionistBilling;
