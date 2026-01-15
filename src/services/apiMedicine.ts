import axios from '@/services/api.customize';

// ============ TYPES ============

export interface Medicine {
    medicineId: string;
    code: string;
    name: string;
    unit: string | null;
    price: number | null;
    stockQuantity: number;
    minStockLevel: number;
    expiryDate: string | null;
    isActive: boolean;
    isLowStock: boolean;
}

export interface CreateMedicineRequest {
    code: string;
    name: string;
    unit?: string;
    price?: number;
    description?: string;
}

export interface UpdateMedicineRequest {
    name?: string;
    unit?: string;
    price?: number;
    description?: string;
    isActive?: boolean;
}

export interface CreateMedicineResponse {
    medicineId: string;
    createdAt: string;
}

// ============ API FUNCTIONS ============

/**
 * Get all medicines for the clinic
 */
export const getMedicines = () => {
    return axios.get<IBackendRes<Medicine[]>>(
        '/api/medicines'
    ) as unknown as Promise<IBackendRes<Medicine[]>>;
};

/**
 * Create a new medicine
 */
export const createMedicine = (data: CreateMedicineRequest) => {
    return axios.post<IBackendRes<CreateMedicineResponse>>(
        '/api/medicines',
        data
    ) as unknown as Promise<IBackendRes<CreateMedicineResponse>>;
};

/**
 * Update an existing medicine
 * @param medicineId Medicine GUID
 */
export const updateMedicine = (
    medicineId: string,
    data: UpdateMedicineRequest
) => {
    return axios.put<IBackendRes<object>>(
        `/api/medicines/${medicineId}`,
        data
    ) as unknown as Promise<IBackendRes<object>>;
};

/**
 * Delete/deactivate a medicine
 * @param medicineId Medicine GUID
 */
export const deleteMedicine = (medicineId: string) => {
    return axios.delete<IBackendRes<object>>(
        `/api/medicines/${medicineId}`
    ) as unknown as Promise<IBackendRes<object>>;
};

// ============ LOW STOCK MANAGEMENT ============

export interface LowStockMedicineDto {
    medicineId: string;
    code: string;
    name: string;
    unit: string | null;
    stockQuantity: number;
    minStockLevel: number;
    expiryDate: string | null; // ISO date
    isExpiringSoon: boolean; // < 30 days until expiry
}

export interface UpdateStockRequest {
    quantity: number;
    notes?: string; // Lý do: Nhập kho, Kiểm kê...
}

export interface UpdateStockResponse {
    medicineId: string;
    newStockQuantity: number;
    updatedAt: string;
}

/**
 * Get medicines with low stock (stock <= minStockLevel)
 * GET /api/medicines/low-stock
 */
export const getLowStockMedicines = () => {
    return axios.get<IBackendRes<LowStockMedicineDto[]>>(
        '/api/medicines/low-stock'
    ) as unknown as Promise<IBackendRes<LowStockMedicineDto[]>>;
};

/**
 * Update medicine stock quantity
 * PUT /api/medicines/{medicineId}/stock
 * @param medicineId Medicine GUID
 * @param data Stock update data (quantity, notes)
 */
export const updateMedicineStock = (
    medicineId: string,
    data: UpdateStockRequest
) => {
    return axios.put<IBackendRes<UpdateStockResponse>>(
        `/api/medicines/${medicineId}/stock`,
        data
    ) as unknown as Promise<IBackendRes<UpdateStockResponse>>;
};
