import axios from '@/services/api.customize';

// ============ TYPES ============

export interface Medicine {
    medicineId: string;
    code: string;
    name: string;
    unit: string | null;
    price: number | null;
    isActive: boolean;
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
