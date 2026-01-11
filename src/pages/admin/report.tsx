import React, { useEffect, useState, useMemo } from "react";
import { FiBarChart2, FiTrendingUp, FiUsers, FiDownload, FiArrowLeft } from "react-icons/fi";
import {
  getBills,
  getAppointments,
  type BillListItem,
  type ReceptionistAppointment,
  BillStatus,
} from "@/services/apiReceptionist";
import { getPatients, type PatientItem } from "@/services/apiAdmin";

interface SummaryCardData {
  id: number;
  title: string;
  value: string;
  change: string;
  changeColor: string;
  icon: React.ElementType;
  accentClass: string;
  buttonBg: string;
  loading?: boolean;
}

const AdminReportsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Current month data
  const [currentMonthRevenue, setCurrentMonthRevenue] = useState<number>(0);
  const [currentMonthVisits, setCurrentMonthVisits] = useState<number>(0);
  const [currentMonthNewPatients, setCurrentMonthNewPatients] = useState<number>(0);

  // Previous month data
  const [previousMonthRevenue, setPreviousMonthRevenue] = useState<number>(0);
  const [previousMonthVisits, setPreviousMonthVisits] = useState<number>(0);
  const [previousMonthNewPatients, setPreviousMonthNewPatients] = useState<number>(0);

  // Bills table state
  const [showBillsTable, setShowBillsTable] = useState(false);
  const [bills, setBills] = useState<BillListItem[]>([]);
  const [loadingBills, setLoadingBills] = useState(false);
  const [errorBills, setErrorBills] = useState<string | null>(null);

  // Appointments table state
  const [showAppointmentsTable, setShowAppointmentsTable] = useState(false);
  const [appointments, setAppointments] = useState<ReceptionistAppointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [errorAppointments, setErrorAppointments] = useState<string | null>(null);

  // Patients table state
  const [showPatientsTable, setShowPatientsTable] = useState(false);
  const [patients, setPatients] = useState<PatientItem[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [errorPatients, setErrorPatients] = useState<string | null>(null);

  // Get current and previous month in YYYY-MM format
  const getCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  const getPreviousMonth = () => {
    const now = new Date();
    now.setMonth(now.getMonth() - 1);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  // Get date range for a month
  const getMonthDateRange = (yearMonth: string) => {
    const [year, month] = yearMonth.split("-").map(Number);
    const firstDay = `${year}-${String(month).padStart(2, "0")}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const lastDayStr = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
    return { fromDate: firstDay, toDate: lastDayStr };
  };

  // Get all days in a month as YYYY-MM-DD array
  const getDaysInMonth = (firstDayOfMonth: string) => {
    const [year, month] = firstDayOfMonth.split("-").map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const days: string[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
    }
    return days;
  };

  // Format number with VND
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(amount)
      .replace("₫", "VND");
  };

  // Calculate percentage change
  const calculatePercentageChange = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  // Format percentage change string
  const formatPercentageChange = (current: number, previous: number): string => {
    const change = calculatePercentageChange(current, previous);
    const sign = change >= 0 ? "+" : "";
    return `${sign}${change.toFixed(0)}% so với tháng trước`;
  };

  // Load all report data
  const loadReportData = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentMonth = getCurrentMonth();
      const previousMonth = getPreviousMonth();
      const currentRange = getMonthDateRange(currentMonth);
      const previousRange = getMonthDateRange(previousMonth);

      // Fetch all data in parallel
      // Note: Using getAppointments with single date since fromDate/toDate is not supported
      const [
        allBillsRes,
        allPatientsRes,
      ] = await Promise.all([
        getBills(), // Get all bills
        getPatients(),
      ]);

      // Get appointments for all days in current and previous month
      // Since API only supports single date, we need to fetch for multiple days
      const currentMonthDays = getDaysInMonth(currentRange.fromDate);
      const previousMonthDays = getDaysInMonth(previousRange.fromDate);
      
      // Fetch appointments for all days in both months
      const currentMonthAppointmentsPromises = currentMonthDays.map(day =>
        getAppointments({
          date: day,
          status: "completed",
        }).catch(() => ({ isSuccess: false, data: [] }))
      );
      
      const previousMonthAppointmentsPromises = previousMonthDays.map(day =>
        getAppointments({
          date: day,
          status: "completed",
        }).catch(() => ({ isSuccess: false, data: [] }))
      );
      
      const [currentMonthAppointmentsResults, previousMonthAppointmentsResults] = await Promise.all([
        Promise.all(currentMonthAppointmentsPromises),
        Promise.all(previousMonthAppointmentsPromises),
      ]);
      
      // Combine all appointments from all days
      const currentMonthAppointments = currentMonthAppointmentsResults
        .filter(res => res.isSuccess && res.data)
        .flatMap(res => res.data || []);
      
      const previousMonthAppointments = previousMonthAppointmentsResults
        .filter(res => res.isSuccess && res.data)
        .flatMap(res => res.data || []);

      // Calculate revenue from bills - simply sum all paid bills
      if (allBillsRes.isSuccess && allBillsRes.data) {
        // Filter paid bills for current month (by createdAt)
        const currentRangeStart = new Date(currentRange.fromDate);
        currentRangeStart.setHours(0, 0, 0, 0);
        const currentRangeEnd = new Date(currentRange.toDate);
        currentRangeEnd.setHours(23, 59, 59, 999);

        const previousRangeStart = new Date(previousRange.fromDate);
        previousRangeStart.setHours(0, 0, 0, 0);
        const previousRangeEnd = new Date(previousRange.toDate);
        previousRangeEnd.setHours(23, 59, 59, 999);

        // Get all paid bills
        const paidBills = allBillsRes.data.filter(
          (bill) => bill.status === BillStatus.Paid
        );

        // Filter by month using createdAt
        const currentMonthBills = paidBills.filter((bill) => {
          if (!bill.createdAt) return false;
          const billDate = new Date(bill.createdAt);
          return billDate >= currentRangeStart && billDate <= currentRangeEnd;
        });

        const previousMonthBills = paidBills.filter((bill) => {
          if (!bill.createdAt) return false;
          const billDate = new Date(bill.createdAt);
          return billDate >= previousRangeStart && billDate <= previousRangeEnd;
        });

        // Calculate total revenue
        const currentRevenue = currentMonthBills.reduce(
          (sum, bill) => sum + bill.totalAmount,
          0
        );
        const previousRevenue = previousMonthBills.reduce(
          (sum, bill) => sum + bill.totalAmount,
          0
        );

        setCurrentMonthRevenue(currentRevenue);
        setPreviousMonthRevenue(previousRevenue);

        console.log("Revenue calculation:", {
          totalBills: allBillsRes.data.length,
          paidBills: paidBills.length,
          currentMonthBills: currentMonthBills.length,
          previousMonthBills: previousMonthBills.length,
          currentRevenue,
          previousRevenue,
        });
      }

      // Set visits data - appointments already filtered by month from API calls
      setCurrentMonthVisits(currentMonthAppointments.length);
      setPreviousMonthVisits(previousMonthAppointments.length);

      // Calculate new patients for current month
      if (allPatientsRes.isSuccess && allPatientsRes.data) {
        const currentRangeStart = new Date(currentRange.fromDate);
        const currentRangeEnd = new Date(currentRange.toDate);
        currentRangeEnd.setHours(23, 59, 59, 999);

        const previousRangeStart = new Date(previousRange.fromDate);
        const previousRangeEnd = new Date(previousRange.toDate);
        previousRangeEnd.setHours(23, 59, 59, 999);

        const currentNewPatients = allPatientsRes.data.filter((patient) => {
          // Use createdAt if available, otherwise skip (can't determine new patients without creation date)
          if (!patient.createdAt) return false;
          const patientDate = new Date(patient.createdAt);
          return patientDate >= currentRangeStart && patientDate <= currentRangeEnd;
        }).length;

        const previousNewPatients = allPatientsRes.data.filter((patient) => {
          if (!patient.createdAt) return false;
          const patientDate = new Date(patient.createdAt);
          return patientDate >= previousRangeStart && patientDate <= previousRangeEnd;
        }).length;

        setCurrentMonthNewPatients(currentNewPatients);
        setPreviousMonthNewPatients(previousNewPatients);
      }
    } catch (err) {
      console.error("Failed to load report data:", err);
      setError(
        err instanceof Error ? err.message : "Không thể tải dữ liệu báo cáo"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, []);

  // Prepare summary cards data
  const summaryCards: SummaryCardData[] = useMemo(() => {
    const revenueValue = currentMonthRevenue;
    const revenueChange = formatPercentageChange(
      revenueValue,
      previousMonthRevenue
    );
    const revenueChangeNum = calculatePercentageChange(
      revenueValue,
      previousMonthRevenue
    );

    const visitsChange = formatPercentageChange(
      currentMonthVisits,
      previousMonthVisits
    );
    const visitsChangeNum = calculatePercentageChange(
      currentMonthVisits,
      previousMonthVisits
    );

    const patientsChange = formatPercentageChange(
      currentMonthNewPatients,
      previousMonthNewPatients
    );
    const patientsChangeNum = calculatePercentageChange(
      currentMonthNewPatients,
      previousMonthNewPatients
    );

    return [
      {
        id: 1,
        title: "Doanh thu",
        value: loading ? "Đang tải..." : formatCurrency(revenueValue),
        change: loading ? "..." : revenueChange,
        changeColor:
          revenueChangeNum >= 0 ? "text-emerald-600" : "text-red-600",
        icon: FiBarChart2,
        accentClass: "text-indigo-500",
        buttonBg: "bg-[#EEF2FF] text-[#2563EB]",
        loading,
      },
      {
        id: 2,
        title: "Lượt khám",
        value: loading
          ? "Đang tải..."
          : `${currentMonthVisits.toLocaleString("vi-VN")} lượt`,
        change: loading ? "..." : visitsChange,
        changeColor:
          visitsChangeNum >= 0 ? "text-emerald-600" : "text-red-600",
        icon: FiTrendingUp,
        accentClass: "text-green-500",
        buttonBg: "bg-[#DCFCE7] text-[#15803D]",
        loading,
      },
      {
        id: 3,
        title: "Bệnh nhân mới",
        value: loading
          ? "Đang tải..."
          : `${currentMonthNewPatients.toLocaleString("vi-VN")} bệnh nhân`,
        change: loading ? "..." : patientsChange,
        changeColor:
          patientsChangeNum >= 0 ? "text-emerald-600" : "text-red-600",
        icon: FiUsers,
        accentClass: "text-purple-500",
        buttonBg: "bg-[#F5F3FF] text-[#7C3AED]",
        loading,
      },
    ];
  }, [
    loading,
    currentMonthRevenue,
    previousMonthRevenue,
    currentMonthVisits,
    previousMonthVisits,
    currentMonthNewPatients,
    previousMonthNewPatients,
  ]);

  const detailReports = [
    {
      id: 1,
      title: `Báo cáo doanh thu tháng ${getCurrentMonth().split("-")[1]}/${getCurrentMonth().split("-")[0]}`,
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

  const handleExportSummary = async (id: number) => {
    try {
      // If clicking on "Doanh thu" card (id: 1), show bills table
      if (id === 1) {
        await loadBills();
        setShowBillsTable(true);
        setShowAppointmentsTable(false);
        setShowPatientsTable(false);
      } else if (id === 2) {
        // If clicking on "Lượt khám" card (id: 2), show appointments table
        await loadAppointments();
        setShowAppointmentsTable(true);
        setShowBillsTable(false);
        setShowPatientsTable(false);
      } else if (id === 3) {
        // If clicking on "Bệnh nhân mới" card (id: 3), show patients table
        await loadPatients();
        setShowPatientsTable(true);
        setShowBillsTable(false);
        setShowAppointmentsTable(false);
      }
    } catch (err) {
      console.error("Failed to export report:", err);
    }
  };

  const loadBills = async () => {
    try {
      setLoadingBills(true);
      setErrorBills(null);
      const result = await getBills();
      if (result.isSuccess && result.data) {
        // Filter only paid bills and sort by createdAt descending
        const paidBills = result.data
          .filter((bill) => bill.status === BillStatus.Paid)
          .sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA; // Newest first
          });
        setBills(paidBills);
      } else {
        setErrorBills("Không thể tải danh sách hóa đơn");
      }
    } catch (err) {
      console.error("Failed to load bills:", err);
      setErrorBills(
        err instanceof Error ? err.message : "Không thể tải danh sách hóa đơn"
      );
    } finally {
      setLoadingBills(false);
    }
  };

  const handleBackToReports = () => {
    setShowBillsTable(false);
    setShowAppointmentsTable(false);
    setShowPatientsTable(false);
  };

  const loadAppointments = async () => {
    try {
      setLoadingAppointments(true);
      setErrorAppointments(null);
      
      const currentMonth = getCurrentMonth();
      const currentRange = getMonthDateRange(currentMonth);
      const days = getDaysInMonth(currentRange.fromDate);
      
      // Fetch appointments for all days in current month
      const appointmentsPromises = days.map(day =>
        getAppointments({
          date: day,
          status: "completed",
        }).catch(() => ({ isSuccess: false, data: [] }))
      );
      
      const results = await Promise.all(appointmentsPromises);
      const allAppointments = results
        .filter(res => res.isSuccess && res.data)
        .flatMap(res => res.data || []);
      
      // Sort by date descending
      const sortedAppointments = allAppointments.sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA; // Newest first
      });
      
      setAppointments(sortedAppointments);
    } catch (err) {
      console.error("Failed to load appointments:", err);
      setErrorAppointments(
        err instanceof Error ? err.message : "Không thể tải danh sách lượt khám"
      );
    } finally {
      setLoadingAppointments(false);
    }
  };

  const loadPatients = async () => {
    try {
      setLoadingPatients(true);
      setErrorPatients(null);
      
      const currentMonth = getCurrentMonth();
      const currentRange = getMonthDateRange(currentMonth);
      const currentRangeStart = new Date(currentRange.fromDate);
      currentRangeStart.setHours(0, 0, 0, 0);
      const currentRangeEnd = new Date(currentRange.toDate);
      currentRangeEnd.setHours(23, 59, 59, 999);
      
      const result = await getPatients();
      if (result.isSuccess && result.data) {
        // Filter patients created in current month and sort by createdAt descending
        const newPatients = result.data
          .filter((patient) => {
            if (!patient.createdAt) return false;
            const patientDate = new Date(patient.createdAt);
            return patientDate >= currentRangeStart && patientDate <= currentRangeEnd;
          })
          .sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA; // Newest first
          });
        
        setPatients(newPatients);
      } else {
        setErrorPatients("Không thể tải danh sách bệnh nhân");
      }
    } catch (err) {
      console.error("Failed to load patients:", err);
      setErrorPatients(
        err instanceof Error ? err.message : "Không thể tải danh sách bệnh nhân"
      );
    } finally {
      setLoadingPatients(false);
    }
  };

  // Format date to DD/MM/YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Format status
  const formatStatus = (status: BillStatus) => {
    switch (status) {
      case BillStatus.Paid:
        return "Đã thanh toán";
      case BillStatus.Pending:
        return "Chờ thanh toán";
      case BillStatus.Cancelled:
        return "Đã hủy";
      case BillStatus.Refunded:
        return "Đã hoàn tiền";
      default:
        return "—";
    }
  };

  const handleDownloadDetail = async (id: number) => {
    try {
      // TODO: Implement detailed report export
      console.log("Download detailed report", id);
    } catch (err) {
      console.error("Failed to download report:", err);
    }
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

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {summaryCards.map((card) => (
            <SummaryCard
              key={card.id}
              {...card}
              onClick={() => handleExportSummary(card.id)}
              onExport={() => handleExportSummary(card.id)}
            />
          ))}
        </div>

        {/* Tables or Detailed reports list */}
        {showBillsTable ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiBarChart2 className="w-4 h-4 text-[#2563EB]" />
                <h2 className="text-sm font-semibold text-slate-900">
                  Danh sách hóa đơn đã thanh toán
                </h2>
              </div>
              <button
                onClick={handleBackToReports}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-[#2563EB] transition-colors"
              >
                <FiArrowLeft className="w-3.5 h-3.5" />
                Trở lại
              </button>
            </div>

            <div className="p-6">
              {errorBills ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-red-700">{errorBills}</p>
                  <button
                    onClick={loadBills}
                    className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                  >
                    Thử lại
                  </button>
                </div>
              ) : loadingBills ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="w-12 h-12 bg-slate-200 rounded animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded animate-pulse w-32" />
                        <div className="h-3 bg-slate-200 rounded animate-pulse w-48" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="max-h-[280px] overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-[#F9FAFB] z-10">
                        <tr className="text-xs text-slate-500 border-b border-slate-200">
                          <th className="text-left font-medium px-3 py-2">Ngày tạo</th>
                          <th className="text-left font-medium px-3 py-2">Bệnh nhân</th>
                          <th className="text-left font-medium px-3 py-2">SĐT</th>
                          <th className="text-left font-medium px-3 py-2">Dịch vụ</th>
                          <th className="text-left font-medium px-3 py-2">Tổng tiền</th>
                          <th className="text-left font-medium px-3 py-2">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bills.length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
                              className="px-3 py-6 text-center text-sm text-slate-400"
                            >
                              Không có hóa đơn nào
                            </td>
                          </tr>
                        ) : (
                          bills.map((bill, idx) => (
                            <tr
                              key={bill.id}
                              className={`border-b border-slate-100 ${
                                idx % 2 === 1 ? "bg-[#FCFCFD]" : "bg-white"
                              }`}
                            >
                              <td className="px-3 py-2.5 text-slate-800">
                                {formatDate(bill.createdAt)}
                              </td>
                              <td className="px-3 py-2.5 text-slate-800 font-medium">
                                {bill.patientName}
                              </td>
                              <td className="px-3 py-2.5 text-slate-600">
                                {bill.phone || "—"}
                              </td>
                              <td className="px-3 py-2.5 text-slate-600 text-xs">
                                {bill.services.length > 0
                                  ? bill.services.join(", ")
                                  : "—"}
                              </td>
                              <td className="px-3 py-2.5 text-slate-800 font-medium">
                                {formatCurrency(bill.totalAmount)}
                              </td>
                              <td className="px-3 py-2.5">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700">
                                  {formatStatus(bill.status)}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : showAppointmentsTable ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiTrendingUp className="w-4 h-4 text-[#2563EB]" />
                <h2 className="text-sm font-semibold text-slate-900">
                  Danh sách lượt khám trong tháng
                </h2>
              </div>
              <button
                onClick={handleBackToReports}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-[#2563EB] transition-colors"
              >
                <FiArrowLeft className="w-3.5 h-3.5" />
                Trở lại
              </button>
            </div>

            <div className="p-6">
              {errorAppointments ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-red-700">{errorAppointments}</p>
                  <button
                    onClick={loadAppointments}
                    className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                  >
                    Thử lại
                  </button>
                </div>
              ) : loadingAppointments ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="w-12 h-12 bg-slate-200 rounded animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded animate-pulse w-32" />
                        <div className="h-3 bg-slate-200 rounded animate-pulse w-48" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="max-h-[280px] overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-[#F9FAFB] z-10">
                        <tr className="text-xs text-slate-500 border-b border-slate-200">
                          <th className="text-left font-medium px-3 py-2">Ngày khám</th>
                          <th className="text-left font-medium px-3 py-2">Bệnh nhân</th>
                          <th className="text-left font-medium px-3 py-2">SĐT</th>
                          <th className="text-left font-medium px-3 py-2">Dịch vụ</th>
                          <th className="text-left font-medium px-3 py-2">Bác sĩ</th>
                          <th className="text-left font-medium px-3 py-2">Thời gian</th>
                          <th className="text-left font-medium px-3 py-2">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.length === 0 ? (
                          <tr>
                            <td
                              colSpan={7}
                              className="px-3 py-6 text-center text-sm text-slate-400"
                            >
                              Không có lượt khám nào
                            </td>
                          </tr>
                        ) : (
                          appointments.map((apt, idx) => (
                            <tr
                              key={apt.id}
                              className={`border-b border-slate-100 ${
                                idx % 2 === 1 ? "bg-[#FCFCFD]" : "bg-white"
                              }`}
                            >
                              <td className="px-3 py-2.5 text-slate-800">
                                {apt.date ? formatDate(apt.date) : "—"}
                              </td>
                              <td className="px-3 py-2.5 text-slate-800 font-medium">
                                {apt.patientName}
                              </td>
                              <td className="px-3 py-2.5 text-slate-600">
                                {apt.phone || "—"}
                              </td>
                              <td className="px-3 py-2.5 text-slate-600 text-xs">
                                {apt.service || "—"}
                              </td>
                              <td className="px-3 py-2.5 text-slate-600">
                                {apt.doctor || "—"}
                              </td>
                              <td className="px-3 py-2.5 text-slate-600">
                                {apt.time || "—"}
                              </td>
                              <td className="px-3 py-2.5">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700">
                                  Hoàn thành
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : showPatientsTable ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiUsers className="w-4 h-4 text-[#2563EB]" />
                <h2 className="text-sm font-semibold text-slate-900">
                  Danh sách bệnh nhân mới trong tháng
                </h2>
              </div>
              <button
                onClick={handleBackToReports}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-[#2563EB] transition-colors"
              >
                <FiArrowLeft className="w-3.5 h-3.5" />
                Trở lại
              </button>
            </div>

            <div className="p-6">
              {errorPatients ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-red-700">{errorPatients}</p>
                  <button
                    onClick={loadPatients}
                    className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                  >
                    Thử lại
                  </button>
                </div>
              ) : loadingPatients ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="w-12 h-12 bg-slate-200 rounded animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded animate-pulse w-32" />
                        <div className="h-3 bg-slate-200 rounded animate-pulse w-48" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="max-h-[280px] overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-[#F9FAFB] z-10">
                        <tr className="text-xs text-slate-500 border-b border-slate-200">
                          <th className="text-left font-medium px-3 py-2">Ngày tạo</th>
                          <th className="text-left font-medium px-3 py-2">Mã BN</th>
                          <th className="text-left font-medium px-3 py-2">Họ tên</th>
                          <th className="text-left font-medium px-3 py-2">SĐT</th>
                          <th className="text-left font-medium px-3 py-2">Email</th>
                          <th className="text-left font-medium px-3 py-2">Phòng khám</th>
                        </tr>
                      </thead>
                      <tbody>
                        {patients.length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
                              className="px-3 py-6 text-center text-sm text-slate-400"
                            >
                              Không có bệnh nhân mới nào
                            </td>
                          </tr>
                        ) : (
                          patients.map((patient, idx) => (
                            <tr
                              key={patient.patientId}
                              className={`border-b border-slate-100 ${
                                idx % 2 === 1 ? "bg-[#FCFCFD]" : "bg-white"
                              }`}
                            >
                              <td className="px-3 py-2.5 text-slate-800">
                                {patient.createdAt ? formatDate(patient.createdAt) : "—"}
                              </td>
                              <td className="px-3 py-2.5 text-slate-800 font-medium">
                                {patient.patientCode}
                              </td>
                              <td className="px-3 py-2.5 text-slate-800">
                                {patient.fullName}
                              </td>
                              <td className="px-3 py-2.5 text-slate-600">
                                {patient.primaryPhone || "—"}
                              </td>
                              <td className="px-3 py-2.5 text-slate-600 text-xs">
                                {patient.email || "—"}
                              </td>
                              <td className="px-3 py-2.5 text-slate-600 text-xs">
                                {patient.clinic?.name || "—"}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default AdminReportsPage;

/* ====== Sub components ====== */

type SummaryCardProps = {
  title: string;
  value: string;
  change: string;
  changeColor: string;
  icon: React.ElementType;
  accentClass: string;
  buttonBg: string;
  onClick?: () => void;
  onExport: () => void;
  loading?: boolean;
};

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  change,
  changeColor,
  icon,
  accentClass,
  buttonBg,
  onClick,
  onExport,
  loading,
}) => {
  const Icon = icon;
  return (
    <div 
      className={`bg-white rounded-2xl shadow-sm border border-slate-100 px-5 py-4 flex flex-col gap-3 ${
        onClick && !loading ? "cursor-pointer hover:shadow-md hover:border-[#2563EB] transition-all" : ""
      }`}
      onClick={onClick && !loading ? onClick : undefined}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-slate-500">{title}</p>
          <p className="mt-1 text-sm sm:text-base font-semibold text-slate-900">
            {value}
          </p>
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
        onClick={(e) => {
          e.stopPropagation();
          onExport();
        }}
        disabled={loading}
        className={`mt-auto inline-flex items-center justify-center rounded-full px-3 py-1.5 text-[11px] font-semibold ${buttonBg} ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Xuất báo cáo
      </button>
    </div>
  );
};
