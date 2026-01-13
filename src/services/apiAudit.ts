import axios from '@/services/api.customize';

// ============ ENUMS ============

export enum AuditAction {
    Created = 1,
    Updated = 2,
    Deleted = 3,
    Viewed = 4,
    Exported = 5,
    StatusChanged = 6,
}

export const AuditActionLabels: Record<AuditAction, string> = {
    [AuditAction.Created]: 'Tạo mới',
    [AuditAction.Updated]: 'Cập nhật',
    [AuditAction.Deleted]: 'Xóa',
    [AuditAction.Viewed]: 'Xem',
    [AuditAction.Exported]: 'Xuất dữ liệu',
    [AuditAction.StatusChanged]: 'Thay đổi trạng thái',
};

export const AuditActionColors: Record<AuditAction, string> = {
    [AuditAction.Created]: 'bg-green-100 text-green-700',
    [AuditAction.Updated]: 'bg-blue-100 text-blue-700',
    [AuditAction.Deleted]: 'bg-red-100 text-red-700',
    [AuditAction.Viewed]: 'bg-slate-100 text-slate-700',
    [AuditAction.Exported]: 'bg-purple-100 text-purple-700',
    [AuditAction.StatusChanged]: 'bg-amber-100 text-amber-700',
};

export enum AuditEntityType {
    MedicalRecord = 1,
    Prescription = 2,
    Appointment = 3,
    Bill = 4,
    Patient = 5,
    ToothRecord = 6,
}

export const AuditEntityTypeLabels: Record<AuditEntityType, string> = {
    [AuditEntityType.MedicalRecord]: 'Hồ sơ bệnh án',
    [AuditEntityType.Prescription]: 'Đơn thuốc',
    [AuditEntityType.Appointment]: 'Lịch hẹn',
    [AuditEntityType.Bill]: 'Hóa đơn',
    [AuditEntityType.Patient]: 'Bệnh nhân',
    [AuditEntityType.ToothRecord]: 'Hồ sơ răng',
};

export const AuditEntityTypeIcons: Record<AuditEntityType, string> = {
    [AuditEntityType.MedicalRecord]: '📋',
    [AuditEntityType.Prescription]: '💊',
    [AuditEntityType.Appointment]: '📅',
    [AuditEntityType.Bill]: '💵',
    [AuditEntityType.Patient]: '👤',
    [AuditEntityType.ToothRecord]: '🦷',
};

// ============ TYPES ============

export interface AuditLogDto {
    auditLogId: string;
    entityType: AuditEntityType;
    entityTypeName: string;
    entityId: string;
    action: AuditAction;
    actionName: string;
    userName: string | null;
    userRole: string | null;
    changesSummary: string | null;
    createdAt: string;
}

export interface AuditLogDetailDto extends AuditLogDto {
    userId: string | null;
    oldValues: string | null; // JSON string
    newValues: string | null; // JSON string
    ipAddress: string | null;
}

export interface GetAuditLogsRequest {
    entityType?: AuditEntityType;
    entityId?: string;
    userId?: string;
    fromDate?: string; // ISO datetime
    toDate?: string; // ISO datetime
    page?: number;
    pageSize?: number;
}

export interface AuditLogPagedResponse {
    items: AuditLogDto[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface MedicalRecordHistoryDto {
    medicalRecordId: string;
    patientName: string;
    history: AuditLogDto[];
}

// ============ API FUNCTIONS ============

interface IBackendRes<T> {
    isSuccess: boolean;
    message: string;
    data: T;
}

/**
 * GET /api/audit
 * Lấy danh sách audit logs (phân trang)
 */
export const getAuditLogs = async (
    params: GetAuditLogsRequest = {}
): Promise<AuditLogPagedResponse> => {
    const queryParams = new URLSearchParams();

    if (params.entityType !== undefined) {
        queryParams.append('entityType', params.entityType.toString());
    }
    if (params.entityId) {
        queryParams.append('entityId', params.entityId);
    }
    if (params.userId) {
        queryParams.append('userId', params.userId);
    }
    if (params.fromDate) {
        queryParams.append('fromDate', params.fromDate);
    }
    if (params.toDate) {
        queryParams.append('toDate', params.toDate);
    }
    if (params.page !== undefined) {
        queryParams.append('page', params.page.toString());
    }
    if (params.pageSize !== undefined) {
        queryParams.append('pageSize', params.pageSize.toString());
    }

    const queryString = queryParams.toString();
    const url = `/api/audit${queryString ? `?${queryString}` : ''}`;

    const response = await axios.get<IBackendRes<AuditLogPagedResponse>>(url);

    if (response.isSuccess && response.data) {
        return response.data;
    }

    throw new Error(response.message || 'Không thể tải danh sách audit logs');
};

/**
 * GET /api/audit/{auditLogId}
 * Xem chi tiết một audit log
 */
export const getAuditLogDetail = async (
    auditLogId: string
): Promise<AuditLogDetailDto> => {
    const url = `/api/audit/${auditLogId}`;
    const response = await axios.get<IBackendRes<AuditLogDetailDto>>(url);

    if (response.isSuccess && response.data) {
        return response.data;
    }

    throw new Error(response.message || 'Không thể tải chi tiết audit log');
};

/**
 * GET /api/audit/medical-records/{medicalRecordId}/history
 * Xem lịch sử thay đổi của hồ sơ bệnh án
 */
export const getMedicalRecordHistory = async (
    medicalRecordId: string
): Promise<MedicalRecordHistoryDto> => {
    const url = `/api/audit/medical-records/${medicalRecordId}/history`;
    const response = await axios.get<IBackendRes<MedicalRecordHistoryDto>>(url);

    if (response.isSuccess && response.data) {
        return response.data;
    }

    throw new Error(response.message || 'Không thể tải lịch sử hồ sơ bệnh án');
};

// ============ HELPER FUNCTIONS ============

/**
 * Format date for display
 */
export const formatAuditDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

/**
 * Parse JSON values safely
 */
export const parseAuditValues = (
    jsonString: string | null
): Record<string, unknown> | null => {
    if (!jsonString) return null;
    try {
        return JSON.parse(jsonString);
    } catch {
        return null;
    }
};
