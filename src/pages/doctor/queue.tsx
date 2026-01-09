import React, { useEffect, useState } from 'react';
import {
    FiSearch,
    FiClock,
    FiUser,
    FiCheck,
    FiPlay,
    FiRefreshCw,
} from 'react-icons/fi';
import {
    getQueue,
    startExam,
    completeExam,
    DoctorQueueDetail,
} from '@/services/apiDoctor';

const statusConfig: Record<
    string,
    { label: string; bg: string; text: string }
> = {
    pending: {
        label: 'Chờ xác nhận',
        bg: 'bg-gray-100',
        text: 'text-gray-700',
    },
    confirmed: {
        label: 'Đã xác nhận',
        bg: 'bg-blue-100',
        text: 'text-blue-700',
    },
    checkedin: {
        label: 'Đã check-in',
        bg: 'bg-amber-100',
        text: 'text-amber-700',
    },
    inprogress: {
        label: 'Đang khám',
        bg: 'bg-purple-100',
        text: 'text-purple-700',
    },
    completed: {
        label: 'Hoàn thành',
        bg: 'bg-emerald-100',
        text: 'text-emerald-700',
    },
};

const DoctorQueue: React.FC = () => {
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [queue, setQueue] = useState<DoctorQueueDetail[]>([]);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchQueue = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getQueue();
            if (response.isSuccess && response.data) {
                setQueue(response.data);
            } else {
                setError(response.message || 'Không thể tải hàng đợi');
            }
        } catch (err) {
            console.error('Error fetching queue:', err);
            setError('Lỗi kết nối server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueue();
    }, []);

    const handleStartExam = async (appointmentId: string) => {
        try {
            setActionLoading(appointmentId);
            const response = await startExam(appointmentId);
            if (response.isSuccess) {
                // Refresh queue after action
                await fetchQueue();
            } else {
                alert(response.message || 'Không thể bắt đầu khám');
            }
        } catch (err) {
            console.error('Error starting exam:', err);
            alert('Lỗi kết nối server');
        } finally {
            setActionLoading(null);
        }
    };

    const handleCompleteExam = async (appointmentId: string) => {
        try {
            setActionLoading(appointmentId);
            const response = await completeExam(appointmentId);
            if (response.isSuccess) {
                await fetchQueue();
            } else {
                alert(response.message || 'Không thể hoàn thành khám');
            }
        } catch (err) {
            console.error('Error completing exam:', err);
            alert('Lỗi kết nối server');
        } finally {
            setActionLoading(null);
        }
    };

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const filtered = queue.filter(
        (item) =>
            item.patientName.toLowerCase().includes(search.toLowerCase()) ||
            item.patientPhone.includes(search)
    );

    if (loading) {
        return (
            <div className="px-6 py-8 lg:px-10">
                <div className="max-w-[1200px] mx-auto flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
                        <p className="mt-4 text-slate-500">
                            Đang tải hàng đợi...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-6 py-8 lg:px-10">
                <div className="max-w-[1200px] mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <p className="text-red-600">{error}</p>
                        <button
                            onClick={fetchQueue}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="px-6 py-8 lg:px-10">
            <div className="max-w-[1200px] mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <span className="inline-flex items-center rounded-full bg-[#E0ECFF] text-[#2563EB] text-[11px] font-semibold px-4 py-1.5 tracking-wide uppercase mb-3">
                            PATIENT QUEUE
                        </span>
                        <h1 className="text-xl font-semibold text-slate-900">
                            Hàng đợi bệnh nhân
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Quản lý hàng chờ khám bệnh
                        </p>
                    </div>
                    <button
                        onClick={fetchQueue}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[#2563EB] hover:bg-blue-50 rounded-lg transition"
                    >
                        <FiRefreshCw className="w-4 h-4" />
                        Làm mới
                    </button>
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm bệnh nhân..."
                        className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#2563EB]"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Queue List */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {filtered.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                            <FiUser className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>Không có bệnh nhân trong hàng đợi</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="text-left text-xs font-semibold text-slate-600 px-6 py-4">
                                        STT
                                    </th>
                                    <th className="text-left text-xs font-semibold text-slate-600 px-6 py-4">
                                        Bệnh nhân
                                    </th>
                                    <th className="text-left text-xs font-semibold text-slate-600 px-6 py-4">
                                        Dịch vụ
                                    </th>
                                    <th className="text-left text-xs font-semibold text-slate-600 px-6 py-4">
                                        Giờ hẹn
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
                                {filtered.map((item) => {
                                    const status = statusConfig[
                                        item.status
                                    ] || {
                                        label: item.status,
                                        bg: 'bg-gray-100',
                                        text: 'text-gray-700',
                                    };
                                    const isActionDisabled =
                                        actionLoading === item.appointmentId;

                                    return (
                                        <tr
                                            key={item.id}
                                            className="border-b border-slate-50 hover:bg-slate-50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="w-8 h-8 bg-[#E0ECFF] rounded-full flex items-center justify-center text-[#2563EB] font-semibold text-sm">
                                                    {item.queueNumber}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center">
                                                        <FiUser className="w-4 h-4 text-slate-500" />
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-medium text-slate-900">
                                                            {item.patientName}
                                                        </span>
                                                        <p className="text-xs text-slate-400">
                                                            {item.patientPhone}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {item.service}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                                    <FiClock className="w-4 h-4" />
                                                    {formatTime(
                                                        item.scheduledTime
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}
                                                >
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {(item.status === 'confirmed' ||
                                                    item.status ===
                                                        'checkedin') && (
                                                    <button
                                                        onClick={() =>
                                                            handleStartExam(
                                                                item.appointmentId
                                                            )
                                                        }
                                                        disabled={
                                                            isActionDisabled
                                                        }
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2563EB] text-white text-xs font-medium rounded-lg hover:bg-[#1D4ED8] disabled:opacity-50"
                                                    >
                                                        {isActionDisabled ? (
                                                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            <FiPlay className="w-3.5 h-3.5" />
                                                        )}
                                                        Bắt đầu khám
                                                    </button>
                                                )}
                                                {item.status ===
                                                    'inprogress' && (
                                                    <button
                                                        onClick={() =>
                                                            handleCompleteExam(
                                                                item.appointmentId
                                                            )
                                                        }
                                                        disabled={
                                                            isActionDisabled
                                                        }
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white text-xs font-medium rounded-lg hover:bg-emerald-600 disabled:opacity-50"
                                                    >
                                                        {isActionDisabled ? (
                                                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            <FiCheck className="w-3.5 h-3.5" />
                                                        )}
                                                        Hoàn thành
                                                    </button>
                                                )}
                                                {item.status ===
                                                    'completed' && (
                                                    <span className="text-xs text-slate-400">
                                                        Đã hoàn thành
                                                    </span>
                                                )}
                                                {item.status === 'pending' && (
                                                    <span className="text-xs text-slate-400">
                                                        Chờ xác nhận
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorQueue;
