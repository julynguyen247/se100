import React from "react";
import { FiBarChart2, FiTrendingUp, FiUsers, FiDownload } from "react-icons/fi";

const AdminReportsPage: React.FC = () => {
  const summaryCards = [
    {
      id: 1,
      title: "Doanh thu",
      value: "450,000,000 VND",
      subtitle: "",
      change: "+18% so với tháng trước",
      changeColor: "text-emerald-600",
      buttonLabel: "Xuất báo cáo",
      icon: FiBarChart2,
      accentClass: "text-indigo-500",
      buttonBg: "bg-[#EEF2FF] text-[#2563EB]",
    },
    {
      id: 2,
      title: "Lượt khám",
      value: "1,234 lượt",
      subtitle: "",
      change: "+12% so với tháng trước",
      changeColor: "text-emerald-600",
      buttonLabel: "Xuất báo cáo",
      icon: FiTrendingUp,
      accentClass: "text-green-500",
      buttonBg: "bg-[#DCFCE7] text-[#15803D]",
    },
    {
      id: 3,
      title: "Bệnh nhân mới",
      value: "156 bệnh nhân",
      subtitle: "",
      change: "+24% so với tháng trước",
      changeColor: "text-emerald-600",
      buttonLabel: "Xuất báo cáo",
      icon: FiUsers,
      accentClass: "text-purple-500",
      buttonBg: "bg-[#F5F3FF] text-[#7C3AED]",
    },
  ];

  const detailReports = [
    {
      id: 1,
      title: "Báo cáo doanh thu tháng 12/2024",
      description: "Chi tiết doanh thu theo dịch vụ",
    },
    {
      id: 2,
      title: "Báo cáo hoạt động bác sĩ",
      description: "Thống kê số lượt khám của từng bác sĩ",
    },
    {
      id: 3,
      title: "Báo cáo bệnh nhân",
      description: "Thống kê bệnh nhân mới và bệnh nhân tái khám",
    },
  ];

  const handleExportSummary = (id: number) => {
    console.log("Export summary report", id);
  };

  const handleDownloadDetail = (id: number) => {
    console.log("Download detailed report", id);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F5F7FB] px-6 py-8 sm:px-10 lg:px-16">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
            Báo cáo & Thống kê
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Xem báo cáo chi tiết về hoạt động phòng khám
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {summaryCards.map((card) => (
            <SummaryCard
              key={card.id}
              {...card}
              onExport={() => handleExportSummary(card.id)}
            />
          ))}
        </div>

        {/* Detailed reports list */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900">
              Báo cáo chi tiết
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            {detailReports.map((report) => (
              <div
                key={report.id}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {report.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {report.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownloadDetail(report.id)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-[#1D4ED8]"
                >
                  <FiDownload className="w-4 h-4" />
                  <span>Tải xuống</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReportsPage;

/* ====== Sub components ====== */

type SummaryCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  change: string;
  changeColor: string;
  buttonLabel: string;
  icon: React.ElementType;
  accentClass: string;
  buttonBg: string;
  onExport: () => void;
};

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  subtitle,
  change,
  changeColor,
  buttonLabel,
  icon,
  accentClass,
  buttonBg,
  onExport,
}) => {
  const Icon = icon;
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-5 py-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-slate-500">{title}</p>
          <p className="mt-1 text-sm sm:text-base font-semibold text-slate-900">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        <div
          className={`w-8 h-8 rounded-full bg-[#EEF2FF] flex items-center justify-center ${accentClass}`}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <p className={`text-[11px] ${changeColor}`}>{change}</p>

      <button
        type="button"
        onClick={onExport}
        className={`mt-auto inline-flex items-center justify-center rounded-full px-3 py-1.5 text-[11px] font-semibold ${buttonBg}`}
      >
        {buttonLabel}
      </button>
    </div>
  );
};
