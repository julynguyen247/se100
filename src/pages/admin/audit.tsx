import React, { useState, useEffect } from 'react';
import {
    FiSearch,
    FiFilter,
    FiRefreshCw,
    FiChevronLeft,
    FiChevronRight,
    FiX,
    FiClock,
    FiUser,
    FiFileText,
} from 'react-icons/fi';
import {
    getAuditLogs,
    getAuditLogDetail,
    AuditLogDto,
    AuditLogDetailDto,
    AuditLogPagedResponse,
    AuditActionLabels,
    AuditActionColors,
    AuditEntityType,
    AuditEntityTypeLabels,
    AuditEntityTypeIcons,
    formatAuditDate,
    parseAuditValues,
} from '@/services/apiAudit';

const AdminAuditPage: React.FC = () => {
    // State
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [auditData, setAuditData] = useState<AuditLogPagedResponse | null>(
        null
    );

    // Filters
    const [filters, setFilters] = useState({
        entityType: undefined as AuditEntityType | undefined,
        fromDate: '',
        toDate: '',
        page: 1,
        pageSize: 20,
    });
    const [showFilters, setShowFilters] = useState(false);

    // Detail modal
    const [selectedLog, setSelectedLog] = useState<AuditLogDetailDto | null>(
        null
    );
    const [loadingDetail, setLoadingDetail] = useState(false);

    // Fetch audit logs
    const fetchAuditLogs = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAuditLogs({
                entityType: filters.entityType,
                fromDate: filters.fromDate || undefined,
                toDate: filters.toDate || undefined,
                page: filters.page,
                pageSize: filters.pageSize,
            });
            setAuditData(data);
        } catch (err) {
            console.error('Error fetching audit logs:', err);
            setError(
                err instanceof Error
                    ? err.message
                    : 'Không thể tải nhật ký hệ thống'
            );
        } finally {
            setLoading(false);
        }
    };

    // Fetch on mount and when filters change
    useEffect(() => {
        fetchAuditLogs();
    }, [filters.page, filters.pageSize]);

    // Handle filter submit
    const handleApplyFilters = () => {
        setFilters((prev) => ({ ...prev, page: 1 }));
        fetchAuditLogs();
        setShowFilters(false);
    };

    // Handle clear filters
    const handleClearFilters = () => {
        setFilters({
            entityType: undefined,
            fromDate: '',
            toDate: '',
            page: 1,
            pageSize: 20,
        });
        setTimeout(fetchAuditLogs, 0);
    };

    // Handle view detail
    const handleViewDetail = async (log: AuditLogDto) => {
        try {
            setLoadingDetail(true);
            const detail = await getAuditLogDetail(log.auditLogId);
            setSelectedLog(detail);
        } catch (err) {
            console.error('Error fetching audit log detail:', err);
        } finally {
            setLoadingDetail(false);
        }
    };

    // Handle pagination
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && (!auditData || newPage <= auditData.totalPages)) {
            setFilters((prev) => ({ ...prev, page: newPage }));
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#F5F7FB] px-6 py-8 sm:px-10 lg:px-16">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <span className="inline-flex items-center rounded-full bg-[#FEF3C7] text-[#D97706] text-[11px] font-semibold px-4 py-1.5 tracking-wide uppercase mb-2">
                            AUDIT TRAIL
                        </span>
                        <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
                            Nhật ký hệ thống
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Theo dõi lịch sử thay đổi trong hệ thống
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={fetchAuditLogs}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition disabled:opacity-50"
                        >
                            <FiRefreshCw
                                className={`w-4 h-4 ${
                                    loading ? 'animate-spin' : ''
                                }`}
                            />
                            Làm mới
                        </button>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition ${
                                showFilters
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            <FiFilter className="w-4 h-4" />
                            Bộ lọc
                        </button>
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Entity Type */}
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                                    Loại đối tượng
                                </label>
                                <select
                                    value={filters.entityType ?? ''}
                                    onChange={(e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            entityType: e.target.value
                                                ? (Number(
                                                      e.target.value
                                                  ) as AuditEntityType)
                                                : undefined,
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                                >
                                    <option value="">Tất cả</option>
                                    {Object.entries(AuditEntityTypeLabels).map(
                                        ([value, label]) => (
                                            <option key={value} value={value}>
                                                {
                                                    AuditEntityTypeIcons[
                                                        Number(
                                                            value
                                                        ) as AuditEntityType
                                                    ]
                                                }{' '}
                                                {label}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            {/* From Date */}
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                                    Từ ngày
                                </label>
                                <input
                                    type="date"
                                    value={filters.fromDate}
                                    onChange={(e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            fromDate: e.target.value,
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                                />
                            </div>

                            {/* To Date */}
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                                    Đến ngày
                                </label>
                                <input
                                    type="date"
                                    value={filters.toDate}
                                    onChange={(e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            toDate: e.target.value,
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex items-end gap-2">
                                <button
                                    onClick={handleApplyFilters}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                                >
                                    <FiSearch className="w-4 h-4" />
                                    Tìm kiếm
                                </button>
                                <button
                                    onClick={handleClearFilters}
                                    className="px-4 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                        <span className="text-red-600">⚠️</span>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-red-900">
                                Lỗi
                            </p>
                            <p className="text-xs text-red-700 mt-0.5">
                                {error}
                            </p>
                        </div>
                        <button
                            onClick={fetchAuditLogs}
                            className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition"
                        >
                            Thử lại
                        </button>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                        <p className="text-sm text-slate-500">
                            Đang tải nhật ký...
                        </p>
                    </div>
                )}

                {/* Audit Logs Table */}
                {!loading && auditData && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        {auditData.items.length === 0 ? (
                            <div className="p-12 flex flex-col items-center justify-center">
                                <FiFileText className="w-16 h-16 text-slate-300 mb-4" />
                                <p className="text-sm font-medium text-slate-900">
                                    Không có nhật ký nào
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    Thử thay đổi bộ lọc hoặc làm mới dữ liệu
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-slate-50 border-b border-slate-200">
                                            <tr>
                                                <th className="text-left text-xs font-semibold text-slate-600 px-4 py-3">
                                                    Thời gian
                                                </th>
                                                <th className="text-left text-xs font-semibold text-slate-600 px-4 py-3">
                                                    Đối tượng
                                                </th>
                                                <th className="text-left text-xs font-semibold text-slate-600 px-4 py-3">
                                                    Hành động
                                                </th>
                                                <th className="text-left text-xs font-semibold text-slate-600 px-4 py-3">
                                                    Người thực hiện
                                                </th>
                                                <th className="text-left text-xs font-semibold text-slate-600 px-4 py-3">
                                                    Mô tả
                                                </th>
                                                <th className="w-20"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {auditData.items.map((log) => (
                                                <tr
                                                    key={log.auditLogId}
                                                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                                                >
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2 text-xs text-slate-600">
                                                            <FiClock className="w-3.5 h-3.5" />
                                                            {formatAuditDate(
                                                                log.createdAt
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-lg">
                                                                {
                                                                    AuditEntityTypeIcons[
                                                                        log
                                                                            .entityType
                                                                    ]
                                                                }
                                                            </span>
                                                            <div>
                                                                <p className="text-sm font-medium text-slate-900">
                                                                    {
                                                                        log.entityTypeName
                                                                    }
                                                                </p>
                                                                <p className="text-[10px] text-slate-400 font-mono">
                                                                    {log.entityId.slice(
                                                                        0,
                                                                        8
                                                                    )}
                                                                    ...
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span
                                                            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                                                AuditActionColors[
                                                                    log.action
                                                                ]
                                                            }`}
                                                        >
                                                            {log.actionName ||
                                                                AuditActionLabels[
                                                                    log.action
                                                                ]}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
                                                                <FiUser className="w-3 h-3 text-slate-500" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-slate-900">
                                                                    {log.userName ||
                                                                        'Hệ thống'}
                                                                </p>
                                                                <p className="text-[10px] text-slate-400">
                                                                    {log.userRole ||
                                                                        'System'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <p className="text-xs text-slate-600 line-clamp-2 max-w-xs">
                                                            {log.changesSummary ||
                                                                '—'}
                                                        </p>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <button
                                                            onClick={() =>
                                                                handleViewDetail(
                                                                    log
                                                                )
                                                            }
                                                            className="px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                        >
                                                            Chi tiết
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between">
                                    <p className="text-xs text-slate-500">
                                        Hiển thị{' '}
                                        {(auditData.page - 1) *
                                            auditData.pageSize +
                                            1}{' '}
                                        -{' '}
                                        {Math.min(
                                            auditData.page * auditData.pageSize,
                                            auditData.totalCount
                                        )}{' '}
                                        / {auditData.totalCount} kết quả
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                handlePageChange(
                                                    filters.page - 1
                                                )
                                            }
                                            disabled={filters.page <= 1}
                                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FiChevronLeft className="w-4 h-4" />
                                        </button>
                                        <span className="text-xs text-slate-600">
                                            Trang {auditData.page} /{' '}
                                            {auditData.totalPages}
                                        </span>
                                        <button
                                            onClick={() =>
                                                handlePageChange(
                                                    filters.page + 1
                                                )
                                            }
                                            disabled={
                                                filters.page >=
                                                auditData.totalPages
                                            }
                                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FiChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Detail Modal */}
                {selectedLog && (
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedLog(null)}
                    >
                        <div
                            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">
                                        {
                                            AuditEntityTypeIcons[
                                                selectedLog.entityType
                                            ]
                                        }
                                    </span>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900">
                                            Chi tiết nhật ký
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            {selectedLog.entityTypeName} •{' '}
                                            {formatAuditDate(
                                                selectedLog.createdAt
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedLog(null)}
                                    className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
                                >
                                    <FiX className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="px-6 py-4 overflow-y-auto max-h-[calc(80vh-120px)] space-y-4">
                                {loadingDetail ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
                                    </div>
                                ) : (
                                    <>
                                        {/* Info Grid */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-slate-50 rounded-lg p-3">
                                                <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">
                                                    Hành động
                                                </p>
                                                <span
                                                    className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                                        AuditActionColors[
                                                            selectedLog.action
                                                        ]
                                                    }`}
                                                >
                                                    {selectedLog.actionName ||
                                                        AuditActionLabels[
                                                            selectedLog.action
                                                        ]}
                                                </span>
                                            </div>
                                            <div className="bg-slate-50 rounded-lg p-3">
                                                <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">
                                                    Người thực hiện
                                                </p>
                                                <p className="text-sm font-medium text-slate-900">
                                                    {selectedLog.userName ||
                                                        'Hệ thống'}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {selectedLog.userRole}
                                                </p>
                                            </div>
                                            <div className="bg-slate-50 rounded-lg p-3">
                                                <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">
                                                    ID đối tượng
                                                </p>
                                                <p className="text-xs font-mono text-slate-700 break-all">
                                                    {selectedLog.entityId}
                                                </p>
                                            </div>
                                            <div className="bg-slate-50 rounded-lg p-3">
                                                <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">
                                                    IP Address
                                                </p>
                                                <p className="text-sm font-mono text-slate-700">
                                                    {selectedLog.ipAddress ||
                                                        '—'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Changes Summary */}
                                        {selectedLog.changesSummary && (
                                            <div className="bg-blue-50 rounded-lg p-4">
                                                <p className="text-[10px] text-blue-600 uppercase tracking-wide mb-2">
                                                    Mô tả thay đổi
                                                </p>
                                                <p className="text-sm text-slate-700">
                                                    {selectedLog.changesSummary}
                                                </p>
                                            </div>
                                        )}

                                        {/* Old/New Values */}
                                        {(selectedLog.oldValues ||
                                            selectedLog.newValues) && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {selectedLog.oldValues && (
                                                    <div className="bg-red-50 rounded-lg p-4">
                                                        <p className="text-[10px] text-red-600 uppercase tracking-wide mb-2">
                                                            Giá trị cũ
                                                        </p>
                                                        <pre className="text-xs text-slate-700 overflow-x-auto whitespace-pre-wrap font-mono bg-white rounded p-2">
                                                            {JSON.stringify(
                                                                parseAuditValues(
                                                                    selectedLog.oldValues
                                                                ),
                                                                null,
                                                                2
                                                            )}
                                                        </pre>
                                                    </div>
                                                )}
                                                {selectedLog.newValues && (
                                                    <div className="bg-green-50 rounded-lg p-4">
                                                        <p className="text-[10px] text-green-600 uppercase tracking-wide mb-2">
                                                            Giá trị mới
                                                        </p>
                                                        <pre className="text-xs text-slate-700 overflow-x-auto whitespace-pre-wrap font-mono bg-white rounded p-2">
                                                            {JSON.stringify(
                                                                parseAuditValues(
                                                                    selectedLog.newValues
                                                                ),
                                                                null,
                                                                2
                                                            )}
                                                        </pre>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminAuditPage;
