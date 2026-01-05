// src/pages/staff/StaffQueuePage.tsx
import React, { useMemo, useState } from "react";
import {
  FiSearch,
  FiEye,
  FiEdit2,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
} from "react-icons/fi";

type QueueStatus = "Visited" | "Scheduled" | "Waiting";

type QueueItem = {
  id: number;
  time: string;
  patient: string;
  dentist: string;
  service: string;
  phone: string;
  status: QueueStatus;
  timer?: string;
};

const QUEUE_DATA: QueueItem[] = [
  {
    id: 1,
    time: "7:00 - 7:10",
    patient: "Risha Narman Roth",
    dentist: "BS. Mazzi",
    service: "Khám tổng quát",
    phone: "0123456789",
    status: "Visited",
  },
  {
    id: 2,
    time: "7:20 - 7:30",
    patient: "Jordan Dekkle",
    dentist: "BS. Helfdass",
    service: "Trám răng",
    phone: "0987654321",
    status: "Visited",
  },
  {
    id: 3,
    time: "7:30 - 7:40",
    patient: "Aspen Passquindici Alvand",
    dentist: "BS. Mazzi",
    service: "Nhổ răng khôn",
    phone: "0912345678",
    status: "Visited",
  },
  {
    id: 4,
    time: "8:00 - 8:10",
    patient: "Carter Bothos",
    dentist: "Private",
    service: "Tẩy trắng răng",
    phone: "0909876543",
    status: "Scheduled",
  },
  {
    id: 5,
    time: "8:20 - 8:30",
    patient: "Carter Smith",
    dentist: "BS. Mazzi",
    service: "Niềng răng",
    phone: "0989765432",
    status: "Waiting",
    timer: "05:54",
  },
  {
    id: 6,
    time: "8:40 - 8:50",
    patient: "Aaliyah Bothos",
    dentist: "Clinic",
    service: "Khám định kỳ",
    phone: "0887654321",
    status: "Scheduled",
  },
  {
    id: 7,
    time: "9:20 - 9:30",
    patient: "Talan Sjphimas",
    dentist: "BS. Mazzi",
    service: "Cấy ghép Implant",
    phone: "0876543210",
    status: "Scheduled",
  },
  {
    id: 8,
    time: "9:40 - 10:00",
    patient: "Alfonzo Franci",
    dentist: "Private",
    service: "Bọc răng sứ",
    phone: "0865432109",
    status: "Scheduled",
  },
];

const StaffQueuePage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [hideVisited, setHideVisited] = useState(false);
  const [showEmpty, setShowEmpty] = useState(true);

  const todayLabel = useMemo(() => {
    const d = new Date("2022-06-01"); // mock giống screenshot
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  const filteredData = useMemo(() => {
    return QUEUE_DATA.filter((item) => {
      if (hideVisited && item.status === "Visited") return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const combined =
          `${item.patient} ${item.dentist} ${item.service} ${item.phone}`.toLowerCase();
        if (!combined.includes(q)) return false;
      }

      return true;
    });
  }, [search, hideVisited]);

  const renderStatus = (status: QueueStatus) => {
    if (status === "Visited") {
      return (
        <span className="text-xs font-medium text-emerald-600">Visited</span>
      );
    }
    if (status === "Scheduled") {
      return (
        <span className="text-xs font-medium text-blue-600">Scheduled</span>
      );
    }
    return <span className="text-xs font-medium text-amber-500">Waiting</span>;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
      {/* Title row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <span className="font-medium">Hàng đợi bệnh nhân</span>
          <FiCalendar className="w-4 h-4 text-slate-400" />
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 text-white text-xs sm:text-sm px-4 py-2 shadow-sm hover:bg-blue-700"
        >
          + Patient Check-in
        </button>
      </div>

      {/* Filter + table container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        {/* Filter area */}
        <div className="px-4 py-4 space-y-3">
          {/* Search bar */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search waiting..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-9 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Quick filters row */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
            <input
              type="text"
              placeholder="Dentist"
              className="h-8 w-32 rounded-md border border-slate-200 bg-slate-50 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Service"
              className="h-8 w-40 rounded-md border border-slate-200 bg-slate-50 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Status"
              className="h-8 w-32 rounded-md border border-slate-200 bg-slate-50 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Phone"
              className="h-8 w-32 rounded-md border border-slate-200 bg-slate-50 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            <div className="flex-1" />

            {/* toggles */}
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hideVisited}
                onChange={() => setHideVisited((v) => !v)}
                className="h-3 w-3 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-500">Hide visited</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showEmpty}
                onChange={() => setShowEmpty((v) => !v)}
                className="h-3 w-3 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-500">Show empty</span>
            </label>
          </div>

          {/* Date range row */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
            <span>From</span>
            <input
              type="text"
              className="h-8 w-32 rounded-md border border-slate-200 bg-slate-50 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span>To</span>
            <input
              type="text"
              className="h-8 w-32 rounded-md border border-slate-200 bg-slate-50 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="flex-1" />
            <span className="text-xs text-slate-500">{todayLabel}</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border-t border-slate-100">
          <table className="min-w-full text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500">
                <th className="px-4 py-3 text-left font-medium">Time</th>
                <th className="px-4 py-3 text-left font-medium">Patient</th>
                <th className="px-4 py-3 text-left font-medium">Dentist</th>
                <th className="px-4 py-3 text-left font-medium">Service</th>
                <th className="px-4 py-3 text-left font-medium">Phone</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Timer</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, idx) => (
                <tr
                  key={row.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"}
                >
                  <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                    {row.time}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{row.patient}</td>
                  <td className="px-4 py-3 text-slate-600">{row.dentist}</td>
                  <td className="px-4 py-3 text-slate-600">{row.service}</td>
                  <td className="px-4 py-3 text-slate-600">{row.phone}</td>
                  <td className="px-4 py-3">{renderStatus(row.status)}</td>
                  <td className="px-4 py-3">
                    {row.timer ? (
                      <span className="text-xs font-semibold text-orange-500">
                        {row.timer}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 text-slate-500">
                      <button
                        type="button"
                        className="hover:text-slate-700"
                        aria-label="View"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="hover:text-slate-700"
                        aria-label="Edit"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredData.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-6 text-center text-xs text-slate-400"
                  >
                    Không có bệnh nhân trong hàng đợi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Show on page</span>
            <select className="h-7 rounded-md border border-slate-200 bg-white px-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="p-1 rounded-full hover:bg-slate-100"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <span>Page 1 of 6</span>
            <button
              type="button"
              className="p-1 rounded-full hover:bg-slate-100"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffQueuePage;
