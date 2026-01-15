import axios from '@/services/api.customize';

// ============ ENUMS ============

export enum ToothStatus {
    Healthy = 0, // Răng khỏe mạnh
    Cavity = 1, // Sâu răng
    Filled = 2, // Đã trám
    Crown = 3, // Bọc sứ/răng giả
    Missing = 4, // Mất răng
    Extracted = 5, // Đã nhổ
    RootCanal = 6, // Đã điều trị tủy
    Implant = 7, // Cấy ghép implant
    Bridge = 8, // Cầu răng
    Chipped = 9, // Mẻ răng
    Sensitive = 10, // Răng nhạy cảm
    Gum = 11, // Vấn đề nướu
    Orthodontic = 12, // Đang niềng
    PendingTreatment = 13, // Cần điều trị
}

export const ToothStatusLabels: Record<ToothStatus, string> = {
    [ToothStatus.Healthy]: 'Khỏe mạnh',
    [ToothStatus.Cavity]: 'Sâu răng',
    [ToothStatus.Filled]: 'Đã trám',
    [ToothStatus.Crown]: 'Bọc sứ',
    [ToothStatus.Missing]: 'Mất răng',
    [ToothStatus.Extracted]: 'Đã nhổ',
    [ToothStatus.RootCanal]: 'Điều trị tủy',
    [ToothStatus.Implant]: 'Implant',
    [ToothStatus.Bridge]: 'Cầu răng',
    [ToothStatus.Chipped]: 'Mẻ răng',
    [ToothStatus.Sensitive]: 'Nhạy cảm',
    [ToothStatus.Gum]: 'Vấn đề nướu',
    [ToothStatus.Orthodontic]: 'Đang niềng',
    [ToothStatus.PendingTreatment]: 'Cần điều trị',
};

export const ToothStatusColors: Record<ToothStatus, string> = {
    [ToothStatus.Healthy]: '#ffffff', // white - natural color
    [ToothStatus.Cavity]: '#ef4444', // red-500
    [ToothStatus.Filled]: '#3b82f6', // blue-500
    [ToothStatus.Crown]: '#a855f7', // purple-500
    [ToothStatus.Missing]: '#6b7280', // gray-500
    [ToothStatus.Extracted]: '#374151', // gray-700
    [ToothStatus.RootCanal]: '#f97316', // orange-500
    [ToothStatus.Implant]: '#14b8a6', // teal-500
    [ToothStatus.Bridge]: '#8b5cf6', // violet-500
    [ToothStatus.Chipped]: '#eab308', // yellow-500
    [ToothStatus.Sensitive]: '#f59e0b', // amber-500
    [ToothStatus.Gum]: '#ec4899', // pink-500
    [ToothStatus.Orthodontic]: '#06b6d4', // cyan-500
    [ToothStatus.PendingTreatment]: '#dc2626', // red-600
};

// ============ TYPES ============

export interface ToothRecordDto {
    toothRecordId: string;
    toothNumber: number; // 11-18, 21-28, 31-38, 41-48 (FDI notation)
    toothName: string; // "Răng cửa giữa trên phải"
    quadrant: string; // "Trên phải", "Trên trái", "Dưới trái", "Dưới phải"
    status: ToothStatus;
    statusName: string; // "Khỏe mạnh", "Sâu răng", etc.
    previousStatus: ToothStatus | null;
    notes: string | null;
    lastTreatment: string | null;
    lastTreatedAt: string | null;
    lastTreatedByDoctorName: string | null;
}

export interface DentalChartDto {
    patientId: string;
    patientName: string;
    teeth: ToothRecordDto[];
    lastUpdatedAt: string | null;
}

export interface UpdateToothRecordRequest {
    toothNumber: number;
    status: ToothStatus;
    notes?: string;
    lastTreatment?: string;
    medicalRecordId?: string;
}

export interface ToothUpdate {
    toothNumber: number;
    status: ToothStatus;
    notes?: string;
    treatment?: string;
}

export interface BatchUpdateToothRecordsRequest {
    patientId: string;
    medicalRecordId?: string;
    teeth: ToothUpdate[];
}

export interface ToothRecordResponse {
    toothRecordId: string;
    toothNumber: number;
    status: ToothStatus;
    updatedAt: string;
}

export interface ToothHistoryDto {
    toothNumber: number;
    toothName: string;
    currentStatus: ToothStatus;
    currentStatusName: string;
    history: ToothHistoryItem[];
}

export interface ToothHistoryItem {
    recordId: string;
    previousStatus: ToothStatus | null;
    newStatus: ToothStatus;
    statusName: string;
    treatment: string | null;
    notes: string | null;
    doctorName: string;
    updatedAt: string;
}

// ============ API FUNCTIONS ============

interface IBackendRes<T> {
    isSuccess: boolean;
    message: string;
    data: T;
}

/**
 * GET /api/patients/{patientId}/dental-chart
 * Lấy sơ đồ răng đầy đủ của bệnh nhân
 */
export const getDentalChart = async (
    patientId: string
): Promise<DentalChartDto> => {
    const url = `/api/patients/${patientId}/dental-chart`;
    const response = await axios.get<IBackendRes<DentalChartDto>>(url);

    if (response.isSuccess && response.data) {
        return response.data;
    }

    throw new Error(response.message || 'Không thể tải sơ đồ răng');
};

/**
 * PUT /api/patients/{patientId}/dental-chart/teeth
 * Cập nhật trạng thái một răng
 */
export const updateToothRecord = async (
    patientId: string,
    request: UpdateToothRecordRequest
): Promise<ToothRecordResponse> => {
    const url = `/api/patients/${patientId}/dental-chart/teeth`;
    const response = await axios.put<IBackendRes<ToothRecordResponse>>(
        url,
        request
    );

    if (response.isSuccess && response.data) {
        return response.data;
    }

    throw new Error(response.message || 'Không thể cập nhật trạng thái răng');
};

/**
 * GET /api/patients/{patientId}/dental-chart/teeth/{toothNumber}
 * Xem chi tiết lịch sử điều trị một răng
 */
export const getToothHistory = async (
    patientId: string,
    toothNumber: number
): Promise<ToothHistoryDto> => {
    const url = `/api/patients/${patientId}/dental-chart/teeth/${toothNumber}`;
    const response = await axios.get<IBackendRes<ToothHistoryDto>>(url);

    if (response.isSuccess && response.data) {
        return response.data;
    }

    throw new Error(response.message || 'Không thể tải lịch sử răng');
};

/**
 * POST /api/dental-chart/batch-update
 * Cập nhật nhiều răng cùng lúc (dùng sau khi khám)
 */
export const batchUpdateToothRecords = async (
    request: BatchUpdateToothRecordsRequest
): Promise<ToothRecordResponse[]> => {
    const url = '/api/dental-chart/batch-update';
    const response = await axios.post<IBackendRes<ToothRecordResponse[]>>(
        url,
        request
    );

    if (response.isSuccess && response.data) {
        return response.data;
    }

    throw new Error(response.message || 'Không thể cập nhật sơ đồ răng');
};

// ============ HELPER FUNCTIONS ============

/**
 * Lấy tên vị trí răng theo số FDI
 */
export const getToothPosition = (
    toothNumber: number
): { quadrant: string; position: number } => {
    const quadrantNum = Math.floor(toothNumber / 10);
    const position = toothNumber % 10;

    const quadrants: Record<number, string> = {
        1: 'Trên phải',
        2: 'Trên trái',
        3: 'Dưới trái',
        4: 'Dưới phải',
    };

    return {
        quadrant: quadrants[quadrantNum] || 'Không xác định',
        position,
    };
};

/**
 * Danh sách tất cả các răng người lớn theo FDI notation
 */
export const ADULT_TEETH = [
    // Upper right (11-18): từ răng cửa giữa đến răng khôn
    18, 17, 16, 15, 14, 13, 12, 11,
    // Upper left (21-28)
    21, 22, 23, 24, 25, 26, 27, 28,
    // Lower left (31-38)
    38, 37, 36, 35, 34, 33, 32, 31,
    // Lower right (41-48)
    41, 42, 43, 44, 45, 46, 47, 48,
];

/**
 * Răng hàm trên (để render hàng trên)
 */
export const UPPER_TEETH = [
    18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28,
];

/**
 * Răng hàm dưới (để render hàng dưới)
 */
export const LOWER_TEETH = [
    48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38,
];
