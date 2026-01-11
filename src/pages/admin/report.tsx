import React, { useEffect, useState, useMemo } from "react";
import { FiBarChart2, FiTrendingUp, FiUsers, FiDownload, FiArrowLeft } from "react-icons/fi";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  getBills,
  getAppointments,
  type BillListItem,
  type ReceptionistAppointment,
  BillStatus,
} from "@/services/apiReceptionist";
import {
  getPatients,
  getHistoricalStats,
  type PatientItem,
} from "@/services/apiAdmin";
import * as XLSX from "xlsx";

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

  // View mode: 'overview' | 'revenue' | 'visits' | 'patients'
  type ViewMode = 'overview' | 'revenue' | 'visits' | 'patients';
  const [viewMode, setViewMode] = useState<ViewMode>('overview');

  // Current month data
  const [currentMonthRevenue, setCurrentMonthRevenue] = useState<number>(0);
  const [currentMonthVisits, setCurrentMonthVisits] = useState<number>(0);
  const [currentMonthNewPatients, setCurrentMonthNewPatients] = useState<number>(0);

  // Previous month data
  const [previousMonthRevenue, setPreviousMonthRevenue] = useState<number>(0);
  const [previousMonthVisits, setPreviousMonthVisits] = useState<number>(0);
  const [previousMonthNewPatients, setPreviousMonthNewPatients] = useState<number>(0);

  // Bills table state
  const [bills, setBills] = useState<BillListItem[]>([]);

  // Appointments table state
  const [appointments, setAppointments] = useState<ReceptionistAppointment[]>([]);

  // Patients table state
  const [patients, setPatients] = useState<PatientItem[]>([]);

  // Store historical stats for charts
  const [historicalStats, setHistoricalStats] = useState<Array<{
    period: string;
    periodStart: string;
    periodEnd: string;
    revenue: number;
    totalVisits: number;
    newPatients: number;
    completedAppointments: number;
    cancelledAppointments: number;
  }>>([]);

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

  // Load all report data using Historical Stats API
  const loadReportData = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentMonth = getCurrentMonth();
      const previousMonth = getPreviousMonth();

      // Use Historical Stats API instead of manual calculations
      // This reduces from 31+ API calls to just 1!
      const historicalData = await getHistoricalStats();

      // Store for charts
      setHistoricalStats(historicalData);

      // Find current and previous month data
      const currentStats = historicalData.find(h => h.period === currentMonth);
      const previousStats = historicalData.find(h => h.period === previousMonth);

      // Set current month data
      if (currentStats) {
        setCurrentMonthRevenue(currentStats.revenue);
        setCurrentMonthVisits(currentStats.completedAppointments);
        setCurrentMonthNewPatients(currentStats.newPatients);
      } else {
        // Fallback if current month not found
        setCurrentMonthRevenue(0);
        setCurrentMonthVisits(0);
        setCurrentMonthNewPatients(0);
      }

      // Set previous month data
      if (previousStats) {
        setPreviousMonthRevenue(previousStats.revenue);
        setPreviousMonthVisits(previousStats.completedAppointments);
        setPreviousMonthNewPatients(previousStats.newPatients);
      } else {
        // Fallback if previous month not found
        setPreviousMonthRevenue(0);
        setPreviousMonthVisits(0);
        setPreviousMonthNewPatients(0);
      }

      console.log("Historical stats loaded:", {
        currentMonth,
        previousMonth,
        currentStats,
        previousStats,
        totalMonths: historicalData.length,
      });
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

  // Prepare chart data for last 6 months using historical stats
  const revenueChartData = useMemo(() => {
    if (historicalStats.length === 0) {
      // Return empty data if no historical stats yet
      return [];
    }

    // Get last 6 months from historical data
    const last6Months = historicalStats.slice(-6);

    return last6Months.map(stat => {
      const date = new Date(stat.periodStart);
      const monthStr = `Tháng ${date.getMonth() + 1}`;

      return {
        month: monthStr,
        revenue: stat.revenue,
        visits: stat.completedAppointments,
        patients: stat.newPatients,
      };
    });
  }, [historicalStats]);

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

  // Scroll to export reports section
  const scrollToExportSection = () => {
    const exportSection = document.getElementById('export-reports-section');
    if (exportSection) {
      exportSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleExportSummary = async (id: number) => {
    try {
      // id: 1 = Revenue, 2 = Visits, 3 = Patients
      // Change view mode to show chart for specific metric
      if (id === 1) {
        setViewMode('revenue');
      } else if (id === 2) {
        setViewMode('visits');
      } else if (id === 3) {
        setViewMode('patients');
      }
    } catch (err) {
      console.error("Failed to load detail data:", err);
    }
  };



  const handleBackToOverview = () => {
    setViewMode('overview');
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

  // Export helpers for beautiful Excel files
  const downloadExcel = (workbook: XLSX.WorkBook, filename: string) => {
    XLSX.writeFile(workbook, filename);
  };

  const handleDownloadDetail = async (id: number) => {
    try {
      const currentMonth = getCurrentMonth();
      const [year, month] = currentMonth.split("-");
      const monthName = `${month}_${year}`;

      // id: 1 = Revenue, 2 = Visits, 3 = Patients
      if (id === 1) {
        // Export Revenue (Bills) Report
        await exportRevenueReport(monthName);
      } else if (id === 2) {
        // Export Visits (Appointments) Report
        await exportVisitsReport(monthName);
      } else if (id === 3) {
        // Export Patients Report
        await exportPatientsReport(monthName);
      }
    } catch (err) {
      console.error("Failed to download report:", err);
      alert("Không thể tải báo cáo. Vui lòng thử lại.");
    }
  };

  const exportRevenueReport = async (monthName: string) => {
    try {
      // Load bills if not already loaded
      let billsToExport = bills;
      if (billsToExport.length === 0) {
        const result = await getBills();
        if (result.isSuccess && result.data) {
          billsToExport = result.data
            .filter((bill) => bill.status === BillStatus.Paid)
            .sort((a, b) => {
              const dateA = new Date(a.createdAt).getTime();
              const dateB = new Date(b.createdAt).getTime();
              return dateB - dateA;
            });
        }
      }

      // Filter for current month only
      const currentRange = getMonthDateRange(getCurrentMonth());
      const currentRangeStart = new Date(currentRange.fromDate);
      currentRangeStart.setHours(0, 0, 0, 0);
      const currentRangeEnd = new Date(currentRange.toDate);
      currentRangeEnd.setHours(23, 59, 59, 999);

      const monthlyBills = billsToExport.filter((bill) => {
        if (!bill.createdAt) return false;
        const billDate = new Date(bill.createdAt);
        return billDate >= currentRangeStart && billDate <= currentRangeEnd;
      });

      // Calculate total revenue
      const totalRevenue = monthlyBills.reduce(
        (sum, bill) => sum + bill.totalAmount,
        0
      );

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();

      // Prepare data rows
      const data: any[][] = [
        [`BÁO CÁO DOANH THU CHI TIẾT - THÁNG ${monthName.replace("_", "/")}`],
        [],
        [`Ngày xuất: ${new Date().toLocaleString("vi-VN")}`],
        [`Tổng số hóa đơn: ${monthlyBills.length}`],
        [`Tổng doanh thu: ${totalRevenue.toLocaleString("vi-VN")} VND`],
        [],
        ["STT", "Ngày tạo", "Mã hóa đơn", "Bệnh nhân", "Số điện thoại", "Dịch vụ", "Tổng tiền", "Ngày thanh toán", "Trạng thái"],
      ];

      // Add bill rows
      monthlyBills.forEach((bill, index) => {
        data.push([
          index + 1,
          formatDate(bill.createdAt),
          bill.id,
          bill.patientName,
          bill.phone || "—",
          bill.services.join(", ") || "—",
          bill.totalAmount,
          bill.paidAt ? formatDate(bill.paidAt) : bill.paymentDate ? formatDate(bill.paymentDate) : "—",
          formatStatus(bill.status),
        ]);
      });

      // Add summary
      data.push([]);
      data.push(["", "", "", "", "", "TỔNG DOANH THU:", totalRevenue, "", ""]);

      const ws = XLSX.utils.aoa_to_sheet(data);

      // Set column widths
      ws['!cols'] = [
        { wch: 5 },  // STT
        { wch: 12 }, // Ngày tạo
        { wch: 25 }, // Mã HĐ
        { wch: 25 }, // Bệnh nhân
        { wch: 14 }, // SĐT
        { wch: 35 }, // Dịch vụ
        { wch: 15 }, // Tổng tiền
        { wch: 14 }, // Ngày TT
        { wch: 15 }, // Trạng thái
      ];

      // Apply styles
      const range = XLSX.utils.decode_range(ws['!ref'] || "A1");

      // Style title (row 1)
      if (ws['A1']) {
        ws['A1'].s = {
          font: { bold: true, sz: 16, color: { rgb: "2563EB" } },
          alignment: { horizontal: "center", vertical: "center" }
        };
      }

      // Style info rows (rows 3-5)
      for (let row = 2; row <= 4; row++) {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: 0 });
        if (ws[cellRef]) {
          ws[cellRef].s = {
            font: { sz: 11 },
            alignment: { horizontal: "left" }
          };
        }
      }

      // Style header row (row 7)
      const headerRow = 6;
      for (let col = 0; col <= 8; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: headerRow, c: col });
        if (ws[cellRef]) {
          ws[cellRef].s = {
            font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
            fill: { fgColor: { rgb: "2563EB" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } }
            }
          };
        }
      }

      // Style data rows with alternating colors
      for (let row = headerRow + 1; row < range.e.r - 1; row++) {
        const isEven = (row - headerRow) % 2 === 0;
        for (let col = 0; col <= 8; col++) {
          const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
          if (ws[cellRef]) {
            // Format currency for amount column
            if (col === 6 && typeof ws[cellRef].v === 'number') {
              ws[cellRef].z = '#,##0" VND"';
            }
            ws[cellRef].s = {
              fill: isEven ? { fgColor: { rgb: "F8FAFC" } } : { fgColor: { rgb: "FFFFFF" } },
              alignment: { horizontal: col === 0 ? "center" : col === 6 ? "right" : "left", vertical: "center" },
              border: {
                top: { style: "thin", color: { rgb: "E2E8F0" } },
                bottom: { style: "thin", color: { rgb: "E2E8F0" } },
                left: { style: "thin", color: { rgb: "E2E8F0" } },
                right: { style: "thin", color: { rgb: "E2E8F0" } }
              }
            };
          }
        }
      }

      // Style summary row
      const summaryRow = range.e.r;
      for (let col = 5; col <= 6; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: summaryRow, c: col });
        if (ws[cellRef]) {
          if (col === 6 && typeof ws[cellRef].v === 'number') {
            ws[cellRef].z = '#,##0" VND"';
          }
          ws[cellRef].s = {
            font: { bold: true, sz: 12, color: { rgb: "15803D" } },
            fill: { fgColor: { rgb: "DCFCE7" } },
            alignment: { horizontal: col === 6 ? "right" : "right", vertical: "center" },
            border: {
              top: { style: "medium", color: { rgb: "15803D" } },
              bottom: { style: "medium", color: { rgb: "15803D" } },
              left: { style: "medium", color: { rgb: "15803D" } },
              right: { style: "medium", color: { rgb: "15803D" } }
            }
          };
        }
      }

      // Merge title cell
      ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }
      ];

      XLSX.utils.book_append_sheet(wb, ws, "Doanh thu");
      downloadExcel(wb, `Bao_cao_doanh_thu_${monthName}.xlsx`);
    } catch (err) {
      console.error("Failed to export revenue report:", err);
      throw err;
    }
  };

  const exportVisitsReport = async (monthName: string) => {
    try {
      // Load appointments if not already loaded
      let appointmentsToExport = appointments;
      if (appointmentsToExport.length === 0) {
        const currentRange = getMonthDateRange(getCurrentMonth());
        const days = getDaysInMonth(currentRange.fromDate);

        const appointmentsPromises = days.map((day) =>
          getAppointments({
            date: day,
            status: "completed",
          }).catch(() => ({ isSuccess: false, data: [] }))
        );

        const results = await Promise.all(appointmentsPromises);
        appointmentsToExport = results
          .filter((res) => res.isSuccess && res.data)
          .flatMap((res) => res.data || []);
      }

      // Create workbook
      const wb = XLSX.utils.book_new();

      // Prepare data
      const data: any[][] = [
        [`BÁO CÁO LƯỢT KHÁM CHI TIẾT - THÁNG ${monthName.replace("_", "/")}`],
        [],
        [`Ngày xuất: ${new Date().toLocaleString("vi-VN")}`],
        [`Tổng số lượt khám: ${appointmentsToExport.length}`],
        [],
        ["STT", "Ngày khám", "Giờ bắt đầu", "Giờ kết thúc", "Bệnh nhân", "SĐT", "Bác sĩ", "Dịch vụ", "Thời gian", "Trạng thái", "Ghi chú"],
      ];

      appointmentsToExport.forEach((apt, index) => {
        data.push([
          index + 1,
          apt.date ? formatDate(apt.date) : apt.startAt ? formatDate(apt.startAt) : "—",
          apt.time || (apt.startAt ? new Date(apt.startAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' }) : "—"),
          apt.endAt ? new Date(apt.endAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' }) : "—",
          apt.patientName || "—",
          apt.phone || "—",
          apt.doctor || "—",
          apt.service || "—",
          apt.duration ? `${apt.duration} phút` : "—",
          apt.status || "—",
          apt.notes || "—",
        ]);
      });

      const ws = XLSX.utils.aoa_to_sheet(data);

      // Set column widths
      ws['!cols'] = [
        { wch: 5 },  // STT
        { wch: 12 }, // Ngày
        { wch: 10 }, // Giờ BD
        { wch: 10 }, // Giờ KT
        { wch: 22 }, // Bệnh nhân
        { wch: 13 }, // SĐT
        { wch: 20 }, // Bác sĩ
        { wch: 25 }, // Dịch vụ
        { wch: 10 }, // Thời gian
        { wch: 12 }, // Trạng thái
        { wch: 30 }, // Ghi chú
      ];

      // Apply similar styling as revenue report
      const range = XLSX.utils.decode_range(ws['!ref'] || "A1");

      // Title
      if (ws['A1']) {
        ws['A1'].s = {
          font: { bold: true, sz: 16, color: { rgb: "059669" } },
          alignment: { horizontal: "center", vertical: "center" }
        };
      }

      // Header row
      const headerRow = 5;
      for (let col = 0; col <= 10; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: headerRow, c: col });
        if (ws[cellRef]) {
          ws[cellRef].s = {
            font: { bold: true, color: { rgb: "FFFFFF" }, sz: 11 },
            fill: { fgColor: { rgb: "059669" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" }
            }
          };
        }
      }

      // Data rows
      for (let row = headerRow + 1; row <= range.e.r; row++) {
        const isEven = (row - headerRow) % 2 === 0;
        for (let col = 0; col <= 10; col++) {
          const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
          if (ws[cellRef]) {
            ws[cellRef].s = {
              fill: isEven ? { fgColor: { rgb: "F0FDF4" } } : { fgColor: { rgb: "FFFFFF" } },
              alignment: { horizontal: col === 0 ? "center" : "left", vertical: "center" },
              border: {
                top: { style: "thin", color: { rgb: "E2E8F0" } },
                bottom: { style: "thin", color: { rgb: "E2E8F0" } },
                left: { style: "thin", color: { rgb: "E2E8F0" } },
                right: { style: "thin", color: { rgb: "E2E8F0" } }
              }
            };
          }
        }
      }

      ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 10 } }];

      XLSX.utils.book_append_sheet(wb, ws, "Lượt khám");
      downloadExcel(wb, `Bao_cao_luot_kham_${monthName}.xlsx`);
    } catch (err) {
      console.error("Failed to export visits report:", err);
      throw err;
    }
  };

  const exportPatientsReport = async (monthName: string) => {
    try {
      // Load patients if not already loaded
      let patientsToExport = patients;
      if (patientsToExport.length === 0) {
        const currentRange = getMonthDateRange(getCurrentMonth());
        const currentRangeStart = new Date(currentRange.fromDate);
        currentRangeStart.setHours(0, 0, 0, 0);
        const currentRangeEnd = new Date(currentRange.toDate);
        currentRangeEnd.setHours(23, 59, 59, 999);

        const allPatients = await getPatients();
        patientsToExport = allPatients.filter((patient: PatientItem) => {
          if (!patient.createdAt) return false;
          const patientDate = new Date(patient.createdAt);
          return (
            patientDate >= currentRangeStart && patientDate <= currentRangeEnd
          );
        });
      }

      // Create workbook
      const wb = XLSX.utils.book_new();

      // Prepare data
      const data: any[][] = [
        [`BÁO CÁO BỆNH NHÂN MỚI - THÁNG ${monthName.replace("_", "/")}`],
        [],
        [`Ngày xuất: ${new Date().toLocaleString("vi-VN")}`],
        [`Tổng số bệnh nhân mới: ${patientsToExport.length}`],
        [],
        ["STT", "Mã BN", "Họ và tên", "Giới tính", "Ngày sinh", "SĐT", "Email", "Địa chỉ", "Ngày đăng ký", "Ghi chú"],
      ];

      patientsToExport.forEach((patient, index) => {
        data.push([
          index + 1,
          patient.patientCode || "—",
          patient.fullName || "—",
          patient.gender === 1 ? "Nam" : patient.gender === 2 ? "Nữ" : "—",
          patient.dob ? formatDate(patient.dob) : "—",
          patient.primaryPhone || "—",
          patient.email || "—",
          patient.addressLine1 || "—",
          patient.createdAt ? formatDate(patient.createdAt) : "—",
          patient.note || "—",
        ]);
      });

      const ws = XLSX.utils.aoa_to_sheet(data);

      // Set column widths
      ws['!cols'] = [
        { wch: 5 },  // STT
        { wch: 10 }, // Mã BN
        { wch: 25 }, // Họ tên
        { wch: 10 }, // Giới tính
        { wch: 12 }, // Ngày sinh
        { wch: 13 }, // SĐT
        { wch: 25 }, // Email
        { wch: 35 }, // Địa chỉ
        { wch: 14 }, // Ngày ĐK
        { wch: 30 }, // Ghi chú
      ];

      const range = XLSX.utils.decode_range(ws['!ref'] || "A1");

      // Title
      if (ws['A1']) {
        ws['A1'].s = {
          font: { bold: true, sz: 16, color: { rgb: "7C3AED" } },
          alignment: { horizontal: "center", vertical: "center" }
        };
      }

      // Header row
      const headerRow = 5;
      for (let col = 0; col <= 9; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: headerRow, c: col });
        if (ws[cellRef]) {
          ws[cellRef].s = {
            font: { bold: true, color: { rgb: "FFFFFF" }, sz: 11 },
            fill: { fgColor: { rgb: "7C3AED" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" }
            }
          };
        }
      }

      // Data rows
      for (let row = headerRow + 1; row <= range.e.r; row++) {
        const isEven = (row - headerRow) % 2 === 0;
        for (let col = 0; col <= 9; col++) {
          const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
          if (ws[cellRef]) {
            ws[cellRef].s = {
              fill: isEven ? { fgColor: { rgb: "F5F3FF" } } : { fgColor: { rgb: "FFFFFF" } },
              alignment: { horizontal: col === 0 ? "center" : "left", vertical: "center" },
              border: {
                top: { style: "thin", color: { rgb: "E2E8F0" } },
                bottom: { style: "thin", color: { rgb: "E2E8F0" } },
                left: { style: "thin", color: { rgb: "E2E8F0" } },
                right: { style: "thin", color: { rgb: "E2E8F0" } }
              }
            };
          }
        }
      }

      ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 9 } }];

      XLSX.utils.book_append_sheet(wb, ws, "Bệnh nhân mới");
      downloadExcel(wb, `Bao_cao_benh_nhan_moi_${monthName}.xlsx`);
    } catch (err) {
      console.error("Failed to export patients report:", err);
      throw err;
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

        {/* Revenue Visualization Charts - Show in OVERVIEW mode */}
        {viewMode === 'overview' && (
          <div className="space-y-6">
            {/* Revenue Trend Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Xu hướng doanh thu 6 tháng
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Biểu đồ doanh thu và lượt khám trong 6 tháng gần đây
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="h-80 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563EB]" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={revenueChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis
                      dataKey="month"
                      stroke="#64748B"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis
                      yAxisId="left"
                      stroke="#2563EB"
                      style={{ fontSize: '12px' }}
                      tickFormatter={(value) => `${(value / 1000000).toFixed(0)}tr`}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#10B981"
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      formatter={(value: number | undefined, name: string | undefined) => {
                        if (value === undefined || name === undefined) return ['', ''];
                        if (name === 'revenue') return [formatCurrency(value), 'Doanh thu'];
                        if (name === 'visits') return [value.toString(), 'Lượt khám'];
                        return [value.toString(), name];
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '12px' }}
                      formatter={(value) => {
                        if (value === 'revenue') return 'Doanh thu';
                        if (value === 'visits') return 'Lượt khám';
                        return value;
                      }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#2563EB"
                      strokeWidth={2}
                      dot={{ fill: '#2563EB', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="visits"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ fill: '#10B981', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Monthly Comparison Bar Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    So sánh chỉ số tháng
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Doanh thu, lượt khám và bệnh nhân mới theo tháng
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="h-80 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563EB]" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={revenueChartData.slice(-3)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis
                      dataKey="month"
                      stroke="#64748B"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis
                      stroke="#64748B"
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      formatter={(value: number | undefined, name: string | undefined) => {
                        if (value === undefined || name === undefined) return ['', ''];
                        if (name === 'visits') return [value.toString(), 'Lượt khám'];
                        if (name === 'patients') return [value.toString(), 'Bệnh nhân mới'];
                        return [value.toString(), name];
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '12px' }}
                      formatter={(value) => {
                        if (value === 'visits') return 'Lượt khám';
                        if (value === 'patients') return 'Bệnh nhân mới';
                        return value;
                      }}
                    />
                    <Bar dataKey="visits" fill="#2563EB" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="patients" fill="#7C3AED" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}

        {/* REVENUE VIEW - Revenue Chart */}
        {viewMode === 'revenue' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToOverview}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-[#2563EB] transition-colors"
                >
                  <FiArrowLeft className="w-4 h-4" />
                  Trở lại
                </button>
                <div className="h-5 w-px bg-slate-300" />
                <div>
                  <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <FiBarChart2 className="w-5 h-5 text-[#2563EB]" />
                    Chi tiết doanh thu 6 tháng
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Phân tích xu hướng doanh thu theo thời gian
                  </p>
                </div>
              </div>
              <button
                onClick={scrollToExportSection}
                className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1D4ED8]"
              >
                <FiDownload className="w-4 h-4" />
                Xuất báo cáo
              </button>
            </div>

            {loading ? (
              <div className="h-96 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563EB]" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    dataKey="month"
                    stroke="#64748B"
                    style={{ fontSize: '13px' }}
                  />
                  <YAxis
                    stroke="#2563EB"
                    style={{ fontSize: '13px' }}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}tr`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      fontSize: '13px'
                    }}
                    formatter={(value: number | undefined) => {
                      if (value === undefined) return ['', ''];
                      return [formatCurrency(value), 'Doanh thu'];
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '13px' }}
                    formatter={() => 'Doanh thu'}
                  />
                  <Bar dataKey="revenue" fill="#2563EB" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {/* VISITS VIEW - Visits Chart */}
        {viewMode === 'visits' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToOverview}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-[#059669] transition-colors"
                >
                  <FiArrowLeft className="w-4 h-4" />
                  Trở lại
                </button>
                <div className="h-5 w-px bg-slate-300" />
                <div>
                  <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <FiTrendingUp className="w-5 h-5 text-[#059669]" />
                    Chi tiết lượt khám 6 tháng
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Thống kê số lượt khám hoàn thành theo thời gian
                  </p>
                </div>
              </div>
              <button
                onClick={scrollToExportSection}
                className="inline-flex items-center gap-2 rounded-lg bg-[#059669] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#047857]"
              >
                <FiDownload className="w-4 h-4" />
                Xuất báo cáo
              </button>
            </div>

            {loading ? (
              <div className="h-96 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#059669]" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    dataKey="month"
                    stroke="#64748B"
                    style={{ fontSize: '13px' }}
                  />
                  <YAxis
                    stroke="#059669"
                    style={{ fontSize: '13px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      fontSize: '13px'
                    }}
                    formatter={(value: number | undefined) => {
                      if (value === undefined) return ['', ''];
                      return [value.toString(), 'Lượt khám'];
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '13px' }}
                    formatter={() => 'Lượt khám'}
                  />
                  <Line
                    type="monotone"
                    dataKey="visits"
                    stroke="#059669"
                    strokeWidth={3}
                    dot={{ fill: '#059669', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {/* PATIENTS VIEW - Patients Chart */}
        {viewMode === 'patients' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToOverview}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-[#7C3AED] transition-colors"
                >
                  <FiArrowLeft className="w-4 h-4" />
                  Trở lại
                </button>
                <div className="h-5 w-px bg-slate-300" />
                <div>
                  <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <FiUsers className="w-5 h-5 text-[#7C3AED]" />
                    Chi tiết bệnh nhân mới 6 tháng
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Xu hướng tăng trưởng bệnh nhân mới theo thời gian
                  </p>
                </div>
              </div>
              <button
                onClick={scrollToExportSection}
                className="inline-flex items-center gap-2 rounded-lg bg-[#7C3AED] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#6D28D9]"
              >
                <FiDownload className="w-4 h-4" />
                Xuất báo cáo
              </button>
            </div>

            {loading ? (
              <div className="h-96 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C3AED]" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    dataKey="month"
                    stroke="#64748B"
                    style={{ fontSize: '13px' }}
                  />
                  <YAxis
                    stroke="#7C3AED"
                    style={{ fontSize: '13px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      fontSize: '13px'
                    }}
                    formatter={(value: number | undefined) => {
                      if (value === undefined) return ['', ''];
                      return [value.toString(), 'Bệnh nhân mới'];
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '13px' }}
                    formatter={() => 'Bệnh nhân mới'}
                  />
                  <Bar dataKey="patients" fill="#7C3AED" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {/* Export Reports Section */}
        <div id="export-reports-section" className="bg-white rounded-2xl shadow-sm border border-slate-100 mt-6">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900">
              Xuất báo cáo chi tiết
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Tải xuống báo cáo Excel với đầy đủ thông tin chi tiết
            </p>
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
  change: string;
  changeColor: string;
  icon: React.ElementType;
  accentClass: string;
  buttonBg: string;
  onClick: () => void;
  onExport: () => void;
  loading?: boolean;
};

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  change,
  changeColor,
  icon: Icon,
  accentClass,
  buttonBg,
  onClick,
  onExport,
  loading,
}) => {
  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            {title}
          </p>
          <p className={`text-2xl font-bold text-slate-900 mt-2 ${loading ? "animate-pulse" : ""}`}>
            {value}
          </p>
          <p className={`text-xs font-medium mt-2 ${changeColor} ${loading ? "animate-pulse" : ""}`}>
            {change}
          </p>
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accentClass}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onExport();
        }}
        className={`mt-4 w-full inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${buttonBg}`}
      >
        <FiDownload className="w-3.5 h-3.5" />
        Xem chi tiết
      </button>
    </div>
  );
};
