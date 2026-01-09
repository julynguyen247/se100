import React, { useState, useEffect } from 'react';
import {
    FiSearch,
    FiCalendar,
    FiFileText,
    FiDownload,
    FiChevronDown,
    FiChevronUp,
    FiX,
    FiPaperclip,
} from 'react-icons/fi';
import {
    getMedicalRecords,
    getMedicalRecordDetail,
    downloadMedicalRecordAttachment,
    type MedicalRecordDto,
    type MedicalRecordDetailDto,
    type AttachmentDto,
} from '../../services/apiPatient';

const MedicalHistoryPage: React.FC = () => {
    const [query, setQuery] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [records, setRecords] = useState<MedicalRecordDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal states
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedRecordId, setSelectedRecordId] = useState<string | null>(
        null
    );

    // Fetch medical records on mount
    useEffect(() => {
        const fetchRecords = async () => {
            try {
                setLoading(true);
                const response = await getMedicalRecords();

                if (response && response.data) {
                    setRecords(response.data);
                }
            } catch (err: any) {
                console.error('Failed to fetch medical records:', err);
                setError('Không thể tải hồ sơ bệnh án. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchRecords();
    }, []);

    const filtered = records.filter(
        (r) =>
            r.title.toLowerCase().includes(query.toLowerCase()) ||
            (r.diagnosis?.toLowerCase() || '').includes(query.toLowerCase()) ||
            r.doctor.toLowerCase().includes(query.toLowerCase())
    );

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleViewDetail = (recordId: string) => {
        setSelectedRecordId(recordId);
        setShowDetailModal(true);
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#F5F7FB] px-6 py-8 sm:px-10 lg:px-20">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <span className="inline-flex items-center justify-center rounded-full bg-[#E0ECFF] text-[#2563EB] text-[11px] font-semibold px-5 py-1.5 tracking-[0.16em] uppercase mb-3">
                        MEDICAL HISTORY
                    </span>
                    <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
                        Hồ sơ bệnh án
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Lịch sử điều trị và hồ sơ y tế của bạn
                    </p>
                </div>

                {/* Search */}
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm hồ sơ..."
                        className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/60"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                {/* List records */}
                {loading ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-sm text-slate-600">
                            Đang tải hồ sơ bệnh án...
                        </p>
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
                        <FiFileText className="w-12 h-12 text-red-300 mx-auto mb-4" />
                        <h3 className="text-sm font-semibold text-slate-900 mb-1">
                            Lỗi tải dữ liệu
                        </h3>
                        <p className="text-xs text-slate-500 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : records.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
                        <FiFileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-sm font-semibold text-slate-900 mb-1">
                            Chưa có bệnh sử
                        </h3>
                        <p className="text-xs text-slate-500">
                            Bạn chưa có hồ sơ bệnh án nào trong hệ thống
                        </p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
                        <FiFileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-sm font-semibold text-slate-900 mb-1">
                            Không tìm thấy hồ sơ
                        </h3>
                        <p className="text-xs text-slate-500">
                            Không có hồ sơ bệnh án nào phù hợp với tìm kiếm của
                            bạn
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map((record) => (
                            <MedicalRecordCard
                                key={record.id}
                                record={record}
                                isExpanded={expandedId === record.id}
                                onToggle={() => toggleExpand(record.id)}
                                onViewDetail={() => handleViewDetail(record.id)}
                            />
                        ))}
                    </div>
                )}

                {/* Detail Modal */}
                <MedicalRecordDetailModal
                    isOpen={showDetailModal}
                    recordId={selectedRecordId}
                    onClose={() => {
                        setShowDetailModal(false);
                        setSelectedRecordId(null);
                    }}
                />
            </div>
        </div>
    );
};

export default MedicalHistoryPage;

/* -------- Card từng hồ sơ -------- */

interface MedicalRecordCardProps {
    record: MedicalRecordDto;
    isExpanded: boolean;
    onToggle: () => void;
    onViewDetail: () => void;
}

const MedicalRecordCard: React.FC<MedicalRecordCardProps> = ({
    record,
    isExpanded,
    onToggle,
    onViewDetail,
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* Header - Clickable */}
            <div className="p-5">
                <div className="flex gap-4 items-start">
                    {/* Icon bên trái */}
                    <div className="flex-shrink-0">
                        <div className="w-11 h-11 rounded-full bg-[#E0ECFF] text-[#2563EB] flex items-center justify-center">
                            <FiFileText className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Nội dung */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div className="cursor-pointer" onClick={onToggle}>
                                <p className="text-sm font-semibold text-slate-900">
                                    {record.title}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {record.doctor}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                    <FiCalendar className="w-3.5 h-3.5" />
                                    <span>{record.date}</span>
                                </div>
                                <button
                                    onClick={onViewDetail}
                                    className="px-3 py-1.5 bg-[#2563EB] text-white text-xs rounded-lg hover:bg-[#1D4ED8] transition-colors"
                                >
                                    Xem chi tiết
                                </button>
                                <div
                                    className="p-1 rounded-full hover:bg-slate-100 transition cursor-pointer"
                                    onClick={onToggle}
                                >
                                    {isExpanded ? (
                                        <FiChevronUp className="w-4 h-4 text-slate-400" />
                                    ) : (
                                        <FiChevronDown className="w-4 h-4 text-slate-400" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Chẩn đoán */}
                        {record.diagnosis && (
                            <div className="mt-3 rounded-xl bg-[#EFF6FF] px-4 py-2.5 text-xs text-slate-700">
                                <span className="font-semibold text-slate-900">
                                    Chẩn đoán:{' '}
                                </span>
                                <span>{record.diagnosis}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Chi tiết - Expandable */}
            {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50 px-5 py-5">
                    <div className="ml-15 space-y-4">
                        {/* Điều trị */}
                        {record.treatment && (
                            <div>
                                <h4 className="text-xs font-semibold text-slate-900 mb-1.5">
                                    Điều trị
                                </h4>
                                <p className="text-xs text-slate-600">
                                    {record.treatment}
                                </p>
                            </div>
                        )}

                        {/* Đơn thuốc */}
                        {record.prescription &&
                            (() => {
                                try {
                                    const prescription =
                                        typeof record.prescription === 'string'
                                            ? JSON.parse(record.prescription)
                                            : record.prescription;

                                    const medicines =
                                        prescription.Medicines ||
                                        prescription.medicines ||
                                        [];

                                    if (medicines.length > 0) {
                                        return (
                                            <div>
                                                <h4 className="text-xs font-semibold text-slate-900 mb-1.5">
                                                    Đơn thuốc
                                                </h4>
                                                <div className="space-y-1">
                                                    {medicines.map(
                                                        (
                                                            med: any,
                                                            idx: number
                                                        ) => (
                                                            <div
                                                                key={idx}
                                                                className="text-xs text-slate-600"
                                                            >
                                                                •{' '}
                                                                {med.Name ||
                                                                    med.name}{' '}
                                                                -{' '}
                                                                {med.Dosage ||
                                                                    med.dosage}{' '}
                                                                x{' '}
                                                                {med.Quantity ||
                                                                    med.quantity}
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                } catch (error) {
                                    return (
                                        <div>
                                            <h4 className="text-xs font-semibold text-slate-900 mb-1.5">
                                                Đơn thuốc
                                            </h4>
                                            <p className="text-xs text-slate-600">
                                                {record.prescription}
                                            </p>
                                        </div>
                                    );
                                }
                            })()}

                        {/* Ghi chú */}
                        {record.notes &&
                            (() => {
                                try {
                                    let parsed = record.notes;

                                    // Check if notes has format: [ToothStatus]: {"T26":"normal"}
                                    if (
                                        typeof record.notes === 'string' &&
                                        record.notes.includes('[ToothStatus]:')
                                    ) {
                                        const jsonPart = record.notes
                                            .split('[ToothStatus]:')[1]
                                            ?.trim();
                                        if (jsonPart) {
                                            parsed = JSON.parse(jsonPart);
                                        }
                                    } else if (
                                        typeof record.notes === 'string'
                                    ) {
                                        try {
                                            parsed = JSON.parse(record.notes);
                                        } catch {
                                            // Not JSON, display as-is
                                            return (
                                                <div>
                                                    <h4 className="text-xs font-semibold text-slate-900 mb-1.5">
                                                        Ghi chú
                                                    </h4>
                                                    <p className="text-xs text-slate-600">
                                                        {record.notes}
                                                    </p>
                                                </div>
                                            );
                                        }
                                    }

                                    // Check if object has tooth keys
                                    const keys = Object.keys(parsed);
                                    const hasToothKeys = keys.some((k) =>
                                        /^T\d+$/i.test(k)
                                    );

                                    if (hasToothKeys) {
                                        return (
                                            <div>
                                                <h4 className="text-xs font-semibold text-slate-900 mb-1.5 flex items-center gap-1">
                                                    🦷 Tình trạng răng
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {keys
                                                        .filter((k) =>
                                                            /^T\d+$/i.test(k)
                                                        )
                                                        .map(
                                                            (toothNum, idx) => {
                                                                const status = (
                                                                    parsed as any
                                                                )[toothNum];
                                                                const isNormal =
                                                                    status ===
                                                                    'normal';
                                                                return (
                                                                    <div
                                                                        key={
                                                                            idx
                                                                        }
                                                                        className={`text-xs px-2 py-1 rounded ${
                                                                            isNormal
                                                                                ? 'bg-green-50 text-green-700'
                                                                                : 'bg-red-50 text-red-700'
                                                                        }`}
                                                                    >
                                                                        #
                                                                        {
                                                                            toothNum
                                                                        }
                                                                        :{' '}
                                                                        {isNormal
                                                                            ? '✓'
                                                                            : status}
                                                                    </div>
                                                                );
                                                            }
                                                        )}
                                                </div>
                                            </div>
                                        );
                                    }

                                    // Fallback
                                    return (
                                        <div>
                                            <h4 className="text-xs font-semibold text-slate-900 mb-1.5">
                                                Ghi chú
                                            </h4>
                                            <p className="text-xs text-slate-600">
                                                {JSON.stringify(
                                                    parsed,
                                                    null,
                                                    2
                                                )}
                                            </p>
                                        </div>
                                    );
                                } catch (error) {
                                    return (
                                        <div>
                                            <h4 className="text-xs font-semibold text-slate-900 mb-1.5">
                                                Ghi chú
                                            </h4>
                                            <p className="text-xs text-slate-600">
                                                {record.notes}
                                            </p>
                                        </div>
                                    );
                                }
                            })()}

                        {/* Tài liệu đính kèm */}
                        {record.attachments.length > 0 && (
                            <div>
                                <h4 className="text-xs font-semibold text-slate-900 mb-2">
                                    Tài liệu đính kèm
                                </h4>
                                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                                    <FiPaperclip className="w-4 h-4 text-blue-600" />
                                    <span className="text-xs text-blue-900">
                                        {record.attachments.length} tệp đính kèm
                                    </span>
                                    <span className="text-xs text-blue-600 ml-auto">
                                        → Click "Xem chi tiết" để tải về
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

/* -------- Detail Modal Component -------- */

type MedicalRecordDetailModalProps = {
    isOpen: boolean;
    recordId: string | null;
    onClose: () => void;
};

const MedicalRecordDetailModal: React.FC<MedicalRecordDetailModalProps> = ({
    isOpen,
    recordId,
    onClose,
}) => {
    const [record, setRecord] = useState<MedicalRecordDetailDto | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && recordId) {
            fetchRecordDetail();
        }
    }, [isOpen, recordId]);

    const fetchRecordDetail = async () => {
        if (!recordId) return;

        try {
            setLoading(true);
            const response = await getMedicalRecordDetail(recordId);
            console.log('=== MEDICAL RECORD DETAIL RESPONSE ===');
            console.log('Full response:', response);
            console.log('Response data:', response?.data);
            console.log('Attachments:', response?.data?.attachments);
            if (response?.data) {
                setRecord(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch record detail:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadAttachment = async (
        attachmentId: string,
        fileName: string
    ) => {
        if (!recordId) return;

        try {
            const response = await downloadMedicalRecordAttachment(
                recordId,
                attachmentId
            );

            // Create blob and download
            const blob = new Blob([response.data]);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to download attachment:', error);
            alert('Không thể tải file. Vui lòng thử lại.');
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const formatDate = (isoDate: string) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {loading ? (
                    <div className="text-center py-8">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#2563EB] border-r-transparent mb-4" />
                        <p className="text-sm text-slate-600">Đang tải...</p>
                    </div>
                ) : record ? (
                    <>
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                            <h2 className="text-xl font-semibold text-slate-900">
                                {record.title}
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <FiX className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-slate-700">
                                    Bác sĩ
                                </p>
                                <p className="text-sm text-slate-900 mt-1">
                                    {record.doctor}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-slate-700">
                                    Ngày khám
                                </p>
                                <p className="text-sm text-slate-900 mt-1">
                                    {formatDate(record.recordDate)}
                                </p>
                            </div>

                            {record.diagnosis && (
                                <div>
                                    <p className="text-sm font-medium text-slate-700">
                                        Chẩn đoán
                                    </p>
                                    <p className="text-sm text-slate-900 mt-1">
                                        {record.diagnosis}
                                    </p>
                                </div>
                            )}

                            {record.treatment && (
                                <div>
                                    <p className="text-sm font-medium text-slate-700">
                                        Điều tri
                                    </p>
                                    <p className="text-sm text-slate-900 mt-1">
                                        {record.treatment}
                                    </p>
                                </div>
                            )}

                            {record.prescription &&
                                (() => {
                                    try {
                                        const prescription =
                                            typeof record.prescription ===
                                            'string'
                                                ? JSON.parse(
                                                      record.prescription
                                                  )
                                                : record.prescription;

                                        const medicines =
                                            prescription.Medicines ||
                                            prescription.medicines ||
                                            [];
                                        const notes =
                                            prescription.Notes ||
                                            prescription.notes ||
                                            '';

                                        return (
                                            <div>
                                                <p className="text-sm font-medium text-slate-700 mb-2">
                                                    Đơn thuốc
                                                </p>

                                                {medicines.length > 0 && (
                                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
                                                        <div className="space-y-3">
                                                            {medicines.map(
                                                                (
                                                                    med: any,
                                                                    idx: number
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            idx
                                                                        }
                                                                        className="bg-white rounded-lg p-3 border border-blue-100"
                                                                    >
                                                                        <p className="text-sm font-semibold text-slate-900 mb-1">
                                                                            {med.Name ||
                                                                                med.name}
                                                                        </p>
                                                                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                                                                            <div>
                                                                                <span className="font-medium">
                                                                                    Liều
                                                                                    lượng:
                                                                                </span>{' '}
                                                                                {med.Dosage ||
                                                                                    med.dosage}
                                                                            </div>
                                                                            <div>
                                                                                <span className="font-medium">
                                                                                    Số
                                                                                    lượng:
                                                                                </span>{' '}
                                                                                {med.Quantity ||
                                                                                    med.quantity}
                                                                            </div>
                                                                        </div>
                                                                        {(med.Instructions ||
                                                                            med.instructions) && (
                                                                            <p className="text-xs text-slate-600 mt-2">
                                                                                <span className="font-medium">
                                                                                    Cách
                                                                                    dùng:
                                                                                </span>{' '}
                                                                                {med.Instructions ||
                                                                                    med.instructions}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {notes && (
                                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                                        <p className="text-xs font-medium text-amber-900 mb-1">
                                                            Lưu ý:
                                                        </p>
                                                        <p className="text-xs text-amber-800">
                                                            {notes}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    } catch (error) {
                                        // Fallback if not JSON
                                        return (
                                            <div>
                                                <p className="text-sm font-medium text-slate-700">
                                                    Đơn thuốc
                                                </p>
                                                <p className="text-sm text-slate-900 mt-1 whitespace-pre-wrap">
                                                    {record.prescription}
                                                </p>
                                            </div>
                                        );
                                    }
                                })()}

                            {record.notes &&
                                (() => {
                                    try {
                                        let parsed = record.notes;

                                        // Check if notes has format: [ToothStatus]: {"T26":"normal"}
                                        if (
                                            typeof record.notes === 'string' &&
                                            record.notes.includes(
                                                '[ToothStatus]:'
                                            )
                                        ) {
                                            const jsonPart = record.notes
                                                .split('[ToothStatus]:')[1]
                                                ?.trim();
                                            if (jsonPart) {
                                                parsed = JSON.parse(jsonPart);
                                            }
                                        } else if (
                                            typeof record.notes === 'string'
                                        ) {
                                            parsed = JSON.parse(record.notes);
                                        }

                                        // Check if it's an array directly
                                        if (Array.isArray(parsed)) {
                                            return (
                                                <div>
                                                    <p className="text-sm font-medium text-slate-700 mb-2">
                                                        Ghi chú
                                                    </p>
                                                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                                                        <p className="text-xs font-medium text-slate-700 mb-2">
                                                            Tình trạng răng:
                                                        </p>
                                                        <div className="grid grid-cols-4 gap-2">
                                                            {parsed.map(
                                                                (
                                                                    tooth: any,
                                                                    idx: number
                                                                ) => {
                                                                    const toothNum =
                                                                        Object.keys(
                                                                            tooth
                                                                        )[0];
                                                                    const status =
                                                                        tooth[
                                                                            toothNum
                                                                        ];
                                                                    return (
                                                                        <div
                                                                            key={
                                                                                idx
                                                                            }
                                                                            className="text-xs text-slate-600"
                                                                        >
                                                                            <span className="font-medium">
                                                                                #
                                                                                {
                                                                                    toothNum
                                                                                }

                                                                                :
                                                                            </span>{' '}
                                                                            {status ===
                                                                            'normal'
                                                                                ? '✓'
                                                                                : status}
                                                                        </div>
                                                                    );
                                                                }
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        // Check if object has tooth keys like T26, T27 directly
                                        const keys = Object.keys(parsed);
                                        const hasToothKeys = keys.some((k) =>
                                            /^T\d+$/i.test(k)
                                        );

                                        if (hasToothKeys) {
                                            return (
                                                <div>
                                                    <p className="text-sm font-medium text-slate-700 mb-2">
                                                        Ghi chú
                                                    </p>
                                                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                                                        <p className="text-xs font-medium text-slate-700 mb-2">
                                                            Tình trạng răng:
                                                        </p>
                                                        <div className="grid grid-cols-4 gap-2">
                                                            {keys
                                                                .filter((k) =>
                                                                    /^T\d+$/i.test(
                                                                        k
                                                                    )
                                                                )
                                                                .map(
                                                                    (
                                                                        toothNum,
                                                                        idx
                                                                    ) => {
                                                                        const status =
                                                                            (
                                                                                parsed as any
                                                                            )[
                                                                                toothNum
                                                                            ];
                                                                        return (
                                                                            <div
                                                                                key={
                                                                                    idx
                                                                                }
                                                                                className="text-xs text-slate-600"
                                                                            >
                                                                                <span className="font-medium">
                                                                                    #
                                                                                    {
                                                                                        toothNum
                                                                                    }

                                                                                    :
                                                                                </span>{' '}
                                                                                {status ===
                                                                                'normal'
                                                                                    ? '✓'
                                                                                    : status}
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        // If it has ToothStatus array, format it nicely
                                        if (
                                            (parsed as any).ToothStatus ||
                                            (parsed as any).toothStatus
                                        ) {
                                            const toothStatus =
                                                (parsed as any).ToothStatus ||
                                                (parsed as any).toothStatus ||
                                                [];
                                            return (
                                                <div>
                                                    <p className="text-sm font-medium text-slate-700 mb-2">
                                                        Ghi chú
                                                    </p>
                                                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                                                        <p className="text-xs font-medium text-slate-700 mb-2">
                                                            Tình trạng răng:
                                                        </p>
                                                        <div className="grid grid-cols-4 gap-2">
                                                            {toothStatus.map(
                                                                (
                                                                    tooth: any,
                                                                    idx: number
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            idx
                                                                        }
                                                                        className="text-xs text-slate-600"
                                                                    >
                                                                        <span className="font-medium">
                                                                            #
                                                                            {tooth.T26 ||
                                                                                tooth.t26}
                                                                            :
                                                                        </span>{' '}
                                                                        {tooth.T26 ===
                                                                            'normal' ||
                                                                        tooth.t26 ===
                                                                            'normal'
                                                                            ? '✓'
                                                                            : tooth.T26 ||
                                                                              tooth.t26}
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        // If it's just a string in the parsed object
                                        return (
                                            <div>
                                                <p className="text-sm font-medium text-slate-700">
                                                    Ghi chú
                                                </p>
                                                <p className="text-sm text-slate-900 mt-1 whitespace-pre-wrap">
                                                    {JSON.stringify(
                                                        parsed,
                                                        null,
                                                        2
                                                    )}
                                                </p>
                                            </div>
                                        );
                                    } catch (error) {
                                        // Not JSON, display as-is
                                        return (
                                            <div>
                                                <p className="text-sm font-medium text-slate-700">
                                                    Ghi chú
                                                </p>
                                                <p className="text-sm text-slate-900 mt-1 whitespace-pre-wrap">
                                                    {record.notes}
                                                </p>
                                            </div>
                                        );
                                    }
                                })()}

                            {/* Attachments */}
                            {record.attachments.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-slate-700 mb-2">
                                        Tệp đính kèm (
                                        {record.attachments.length})
                                    </h3>
                                    <div className="space-y-2">
                                        {record.attachments.map(
                                            (attachment) => (
                                                <div
                                                    key={attachment.id}
                                                    className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-[#2563EB] transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <FiFileText className="w-5 h-5 text-slate-400" />
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-900">
                                                                {
                                                                    attachment.fileName
                                                                }
                                                            </p>
                                                            <p className="text-xs text-slate-500">
                                                                {formatFileSize(
                                                                    attachment.fileSize
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() =>
                                                            handleDownloadAttachment(
                                                                attachment.id,
                                                                attachment.fileName
                                                            )
                                                        }
                                                        className="flex items-center gap-2 px-3 py-2 bg-[#2563EB] text-white text-sm rounded-lg hover:bg-[#1D4ED8] transition-colors"
                                                    >
                                                        <FiDownload className="w-4 h-4" />
                                                        Tải về
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="mt-6 pt-6 border-t border-slate-200">
                            <button
                                onClick={onClose}
                                className="w-full px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                            >
                                Đóng
                            </button>
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
};
