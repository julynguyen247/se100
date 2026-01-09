import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

export const FORMATE_DATE_DEFAULT = "YYYY-MM-DD";
export const FORMATE_DATE_VN = "DD-MM-YYYY";
export const MAX_UPLOAD_IMAGE_SIZE = 2; //2MB

export const dateRangeValidate = (dateRange: any) => {
  if (!dateRange) return undefined;

  const startDate = dayjs(dateRange[0], FORMATE_DATE_DEFAULT).toDate();
  const endDate = dayjs(dateRange[1], FORMATE_DATE_DEFAULT).toDate();

  return [startDate, endDate];
};

/**
 * Format số tiền VND
 * @param amount Số tiền (VND)
 * @returns String formatted (VD: "450M VND" hoặc "1.2B VND")
 */
export const formatVND = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) return "—";
  
  if (amount >= 1000000000) {
    return `${(amount / 1000000000).toFixed(1)}B VND`;
  } else if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(0)}M VND`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}K VND`;
  }
  return `${amount.toLocaleString("vi-VN")} VND`;
};

/**
 * Format số với dấu phẩy
 * @param num Số cần format
 * @returns String formatted (VD: "1,234")
 */
export const formatNumber = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return "—";
  return num.toLocaleString("vi-VN");
};

/**
 * Format phần trăm
 * @param rate Tỷ lệ phần trăm (0-100)
 * @returns String formatted (VD: "96%")
 */
export const formatPercentage = (rate: number | null | undefined): string => {
  if (rate === null || rate === undefined) return "—";
  return `${rate}%`;
};

/**
 * Format thời gian "X phút trước", "X giờ trước"
 * @param dateString ISO datetime string
 * @returns String formatted (VD: "10 phút trước")
 */
export const formatTimeAgo = (dateString: string | null | undefined): string => {
  if (!dateString) return "—";
  
  const date = dayjs(dateString);
  const now = dayjs();
  const diffMinutes = now.diff(date, "minute");
  const diffHours = now.diff(date, "hour");
  const diffDays = now.diff(date, "day");
  
  if (diffMinutes < 1) return "Vừa xong";
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  
  return date.format("DD/MM/YYYY");
};
