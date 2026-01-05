import React from "react";
import { FiSearch, FiClock, FiUser, FiCheck, FiPlay } from "react-icons/fi";

type QueueItem = {
    id: number;
    number: number;
    name: string;
    service: string;
    time: string;
    status: "waiting" | "in-progress" | "completed";
};

const QUEUE: QueueItem[] = [
    { id: 1, number: 1, name: "Nguyễn Văn A", service: "Khám tổng quát", time: "08:30", status: "completed" },
    { id: 2, number: 2, name: "Trần Thị B", service: "Trám răng", time: "09:00", status: "in-progress" },
    { id: 3, number: 3, name: "Lê Văn C", service: "Nhổ răng khôn", time: "09:30", status: "waiting" },
    { id: 4, number: 4, name: "Phạm Thị D", service: "Tẩy trắng răng", time: "10:00", status: "waiting" },
    { id: 5, number: 5, name: "Hoàng Văn E", service: "Khám định kỳ", time: "10:30", status: "waiting" },
];

const statusConfig = {
    waiting: { label: "Đang chờ", bg: "bg-amber-100", text: "text-amber-700" },
    "in-progress": { label: "Đang khám", bg: "bg-blue-100", text: "text-blue-700" },
    completed: { label: "Hoàn thành", bg: "bg-emerald-100", text: "text-emerald-700" },
};

const DoctorQueue: React.FC = () => {
    const [search, setSearch] = React.useState("");

    const filtered = QUEUE.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="px-6 py-8 lg:px-10">
            <div className="max-w-[1200px] mx-auto space-y-6">
                {/* Header */}
                <div>
                    <span className="inline-flex items-center rounded-full bg-[#E0ECFF] text-[#2563EB] text-[11px] font-semibold px-4 py-1.5 tracking-wide uppercase mb-3">
                        PATIENT QUEUE
                    </span>
                    <h1 className="text-xl font-semibold text-slate-900">Hàng đợi bệnh nhân</h1>
                    <p className="text-sm text-slate-500 mt-1">Quản lý hàng chờ khám bệnh</p>
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
                                                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2563EB] text-white text-xs font-medium rounded-lg hover:bg-[#1D4ED8]">
                                                    <FiPlay className="w-3.5 h-3.5" />
                                                    Bắt đầu khám
                                                </button>
                                            )}
                                            {item.status === "in-progress" && (
                                                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white text-xs font-medium rounded-lg hover:bg-emerald-600">
                                                    <FiCheck className="w-3.5 h-3.5" />
                                                    Hoàn thành
                                                </button>
                                            )}
                                            {item.status === "completed" && (
                                                <span className="text-xs text-slate-400">Đã hoàn thành</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DoctorQueue;
