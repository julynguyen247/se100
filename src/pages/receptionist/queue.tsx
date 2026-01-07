import React, { useEffect, useState } from "react";
import { FiSearch, FiClock, FiUser, FiCheck, FiArrowRight } from "react-icons/fi";
import { getQueue, checkinAppointment, callPatient, type QueueItem } from "@/services/apiReceptionist";
import { toast } from "sonner";

const statusConfig: Record<QueueItem['status'], { label: string; bg: string; text: string }> = {
    waiting: { label: "Chờ check-in", bg: "bg-slate-100", text: "text-slate-600" },
    "checked-in": { label: "Đã check-in", bg: "bg-amber-100", text: "text-amber-700" },
    "in-progress": { label: "Đang khám", bg: "bg-blue-100", text: "text-blue-700" },
    completed: { label: "Hoàn thành", bg: "bg-emerald-100", text: "text-emerald-700" },
};

const ReceptionistQueue: React.FC = () => {
    const [search, setSearch] = useState("");
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchQueue();
    }, []);

    const fetchQueue = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch queue (backend uses DD-MM-YYYY format, undefined = today)
            const result = await getQueue(undefined, undefined, undefined);

            if (result.isSuccess && result.data) {
                setQueue(result.data);
            } else {
                setError(result.message || 'Có lỗi xảy ra khi tải danh sách hàng đợi');
            }
        } catch (err: any) {
            console.error('Error fetching queue:', err);
            setError('Có lỗi xảy ra khi tải danh sách hàng đợi');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckin = async (id: string) => {
        try {
            setActionLoading(id);
            const result = await checkinAppointment(id);

            if (result.isSuccess) {
                toast.success("Đã check-in bệnh nhân thành công");
                await fetchQueue(); // Refresh queue
            } else {
                toast.error(result.message || "Không thể check-in bệnh nhân");
            }
        } catch (err: any) {
            console.error('Error checking in patient:', err);
            toast.error("Có lỗi xảy ra khi check-in bệnh nhân");
        } finally {
            setActionLoading(null);
        }
    };

    const handleCallPatient = async (id: string) => {
        try {
            setActionLoading(id);
            const result = await callPatient(id);

            if (result.isSuccess) {
                toast.success("Đã gọi bệnh nhân vào khám");
                await fetchQueue(); // Refresh queue
            } else {
                toast.error(result.message || "Không thể gọi bệnh nhân");
            }
        } catch (err: any) {
            console.error('Error calling patient:', err);
            toast.error("Có lỗi xảy ra khi gọi bệnh nhân");
        } finally {
            setActionLoading(null);
        }
    };

    const filtered = queue.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="px-6 py-8 lg:px-10">
                <div className="max-w-[1200px] mx-auto flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mb-4"></div>
                        <p className="text-slate-600">Đang tải danh sách hàng đợi...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-6 py-8 lg:px-10">
                <div className="max-w-[1200px] mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                        <p className="text-red-700 font-semibold mb-2">Lỗi tải dữ liệu</p>
                        <p className="text-red-600 text-sm">{error}</p>
                        <button
                            onClick={fetchQueue}
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
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
                <div>
                    <span className="inline-flex items-center rounded-full bg-[#E0ECFF] text-[#2563EB] text-[11px] font-semibold px-4 py-1.5 tracking-wide uppercase mb-3">
                        PATIENT QUEUE
                    </span>
                    <h1 className="text-xl font-semibold text-slate-900">Hàng đợi bệnh nhân</h1>
                    <p className="text-sm text-slate-500 mt-1">Quản lý check-in và hàng chờ khám</p>
                </div>

                {/* Search & Refresh */}
                <div className="flex gap-4 items-center">
                    <div className="relative flex-1 max-w-md">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm bệnh nhân..."
                            className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#2563EB]"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={fetchQueue}
                        className="px-4 py-2.5 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-[#1D4ED8]"
                    >
                        Làm mới
                    </button>
                </div>

                {/* Queue List */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {filtered.length === 0 ? (
                        <div className="text-center py-12">
                            <FiUser className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-sm text-slate-500">
                                {search ? 'Không tìm thấy bệnh nhân phù hợp' : 'Không có bệnh nhân trong hàng đợi'}
                            </p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="text-left text-xs font-semibold text-slate-600 px-6 py-4">STT</th>
                                    <th className="text-left text-xs font-semibold text-slate-600 px-6 py-4">Bệnh nhân</th>
                                    <th className="text-left text-xs font-semibold text-slate-600 px-6 py-4">Dịch vụ</th>
                                    <th className="text-left text-xs font-semibold text-slate-600 px-6 py-4">Giờ hẹn</th>
                                    <th className="text-left text-xs font-semibold text-slate-600 px-6 py-4">Trạng thái</th>
                                    <th className="text-left text-xs font-semibold text-slate-600 px-6 py-4">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((item) => {
                                    const status = statusConfig[item.status];
                                    const isLoading = actionLoading === item.id;

                                    return (
                                        <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50">
                                            <td className="px-6 py-4">
                                                <div className="w-8 h-8 bg-[#E0ECFF] rounded-full flex items-center justify-center text-[#2563EB] font-semibold text-sm">
                                                    {item.number}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center">
                                                        <FiUser className="w-4 h-4 text-slate-500" />
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-900">{item.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{item.service}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                                    <FiClock className="w-4 h-4" />
                                                    {item.time}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.status === "waiting" && (
                                                    <button
                                                        onClick={() => handleCheckin(item.id)}
                                                        disabled={isLoading}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2563EB] text-white text-xs font-medium rounded-lg hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <FiCheck className="w-3.5 h-3.5" />
                                                        {isLoading ? 'Đang xử lý...' : 'Check-in'}
                                                    </button>
                                                )}
                                                {item.status === "checked-in" && (
                                                    <button
                                                        onClick={() => handleCallPatient(item.id)}
                                                        disabled={isLoading}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-white text-xs font-medium rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <FiArrowRight className="w-3.5 h-3.5" />
                                                        {isLoading ? 'Đang xử lý...' : 'Gọi khám'}
                                                    </button>
                                                )}
                                                {(item.status === "in-progress" || item.status === "completed") && (
                                                    <span className="text-xs text-slate-400">--</span>
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

export default ReceptionistQueue;
