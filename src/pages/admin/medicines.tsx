import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { FaPills } from 'react-icons/fa';
import Modal from '@/components/ui/Modal';
import {
    getMedicines,
    createMedicine,
    updateMedicine,
    deleteMedicine,
    Medicine,
    CreateMedicineRequest,
    UpdateMedicineRequest,
} from '@/services/apiMedicine';

type FormMode = 'create' | 'edit';

const MedicinesPage: React.FC = () => {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [formMode, setFormMode] = useState<FormMode>('create');
    const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(
        null
    );

    // Form data
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        unit: '',
        price: '',
        description: '',
        isActive: true,
    });

    useEffect(() => {
        fetchMedicines();
    }, []);

    useEffect(() => {
        // Filter medicines based on search query
        if (searchQuery.trim() === '') {
            setFilteredMedicines(medicines);
        } else {
            const query = searchQuery.toLowerCase();
            setFilteredMedicines(
                medicines.filter(
                    (m) =>
                        m.code.toLowerCase().includes(query) ||
                        m.name.toLowerCase().includes(query) ||
                        m.unit?.toLowerCase().includes(query)
                )
            );
        }
    }, [searchQuery, medicines]);

    const fetchMedicines = async () => {
        try {
            setLoading(true);
            const response = await getMedicines();
            if (response.isSuccess && response.data) {
                setMedicines(response.data);
            }
        } catch (error) {
            console.error('Error fetching medicines:', error);
            alert('Lỗi khi tải danh sách thuốc');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAdd = () => {
        setFormMode('create');
        setSelectedMedicine(null);
        setFormData({
            code: '',
            name: '',
            unit: '',
            price: '',
            description: '',
            isActive: true,
        });
        setModalOpen(true);
    };

    const handleOpenEdit = (medicine: Medicine) => {
        setFormMode('edit');
        setSelectedMedicine(medicine);
        setFormData({
            code: medicine.code,
            name: medicine.name,
            unit: medicine.unit || '',
            price: medicine.price?.toString() || '',
            description: '',
            isActive: medicine.isActive,
        });
        setModalOpen(true);
    };

    const handleSubmit = async () => {
        // Validation
        if (!formData.code.trim() || !formData.name.trim()) {
            alert('Vui lòng nhập mã thuốc và tên thuốc!');
            return;
        }

        try {
            if (formMode === 'create') {
                const request: CreateMedicineRequest = {
                    code: formData.code,
                    name: formData.name,
                    unit: formData.unit || undefined,
                    price: formData.price
                        ? parseFloat(formData.price)
                        : undefined,
                    description: formData.description || undefined,
                };

                const response = await createMedicine(request);
                if (response.isSuccess) {
                    alert('Đã thêm thuốc mới!');
                    setModalOpen(false);
                    fetchMedicines();
                } else {
                    alert(response.message || 'Không thể thêm thuốc');
                }
            } else {
                if (!selectedMedicine) return;

                const request: UpdateMedicineRequest = {
                    name: formData.name,
                    unit: formData.unit || undefined,
                    price: formData.price
                        ? parseFloat(formData.price)
                        : undefined,
                    description: formData.description || undefined,
                    isActive: formData.isActive,
                };

                const response = await updateMedicine(
                    selectedMedicine.medicineId,
                    request
                );
                if (response.isSuccess) {
                    alert('Đã cập nhật thuốc!');
                    setModalOpen(false);
                    fetchMedicines();
                } else {
                    alert(response.message || 'Không thể cập nhật thuốc');
                }
            }
        } catch (error) {
            console.error('Error saving medicine:', error);
            alert('Lỗi kết nối server');
        }
    };

    const handleDelete = async (medicine: Medicine) => {
        if (!confirm(`Xác nhận xóa thuốc "${medicine.name}"?`)) {
            return;
        }

        try {
            const response = await deleteMedicine(medicine.medicineId);
            if (response.isSuccess) {
                alert('Đã xóa thuốc!');
                fetchMedicines();
            } else {
                alert(response.message || 'Không thể xóa thuốc');
            }
        } catch (error) {
            console.error('Error deleting medicine:', error);
            alert('Lỗi kết nối server');
        }
    };

    return (
        <div className="px-6 py-8 lg:px-10">
            <div className="max-w-[1200px] mx-auto space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <span className="inline-flex items-center rounded-full bg-[#E0ECFF] text-[#2563EB] text-[11px] font-semibold px-4 py-1.5 tracking-wide uppercase mb-2">
                            MEDICINES
                        </span>
                        <h1 className="text-lg font-semibold text-slate-900">
                            Quản lý danh mục thuốc
                        </h1>
                        <p className="text-xs text-slate-500">
                            Thêm và quản lý thuốc trong phòng khám
                        </p>
                    </div>
                    <button
                        onClick={handleOpenAdd}
                        className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition text-sm font-medium"
                    >
                        <FiPlus className="w-4 h-4" />
                        Thêm thuốc
                    </button>
                </div>

                {/* Search */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo mã, tên thuốc..."
                            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563EB] mx-auto"></div>
                            <p className="mt-2 text-sm text-slate-500">
                                Đang tải...
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="text-left text-xs font-semibold text-slate-600 px-4 py-3">
                                            Mã thuốc
                                        </th>
                                        <th className="text-left text-xs font-semibold text-slate-600 px-4 py-3">
                                            Tên thuốc
                                        </th>
                                        <th className="text-left text-xs font-semibold text-slate-600 px-4 py-3">
                                            Đơn vị
                                        </th>
                                        <th className="text-left text-xs font-semibold text-slate-600 px-4 py-3">
                                            Giá
                                        </th>
                                        <th className="text-left text-xs font-semibold text-slate-600 px-4 py-3">
                                            Trạng thái
                                        </th>
                                        <th className="text-left text-xs font-semibold text-slate-600 px-4 py-3">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredMedicines.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-4 py-8 text-center text-sm text-slate-500"
                                            >
                                                {searchQuery
                                                    ? 'Không tìm thấy thuốc nào'
                                                    : 'Chưa có thuốc nào'}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredMedicines.map((medicine) => (
                                            <tr
                                                key={medicine.medicineId}
                                                className="border-b border-slate-100 hover:bg-slate-50 transition"
                                            >
                                                <td className="px-4 py-3 text-sm font-medium text-slate-900">
                                                    {medicine.code}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-700">
                                                    <div className="flex items-center gap-2">
                                                        <FaPills className="w-4 h-4 text-[#2563EB]" />
                                                        {medicine.name}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-600">
                                                    {medicine.unit || '-'}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-700">
                                                    {medicine.price
                                                        ? `${medicine.price.toLocaleString()}đ`
                                                        : '-'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                            medicine.isActive
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-red-100 text-red-700'
                                                        }`}
                                                    >
                                                        {medicine.isActive
                                                            ? 'Hoạt động'
                                                            : 'Ngừng dùng'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() =>
                                                                handleOpenEdit(
                                                                    medicine
                                                                )
                                                            }
                                                            className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition"
                                                            title="Sửa"
                                                        >
                                                            <FiEdit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    medicine
                                                                )
                                                            }
                                                            className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition"
                                                            title="Xóa"
                                                        >
                                                            <FiTrash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Form */}
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={
                    formMode === 'create'
                        ? 'Thêm thuốc mới'
                        : 'Sửa thông tin thuốc'
                }
                className="max-w-md"
            >
                <div className="space-y-4">
                    {/* Code */}
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                            Mã thuốc *
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none"
                            value={formData.code}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    code: e.target.value,
                                })
                            }
                            disabled={formMode === 'edit'} // Code không được sửa
                            placeholder="VD: PARA500"
                        />
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                            Tên thuốc *
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            placeholder="VD: Paracetamol"
                        />
                    </div>

                    {/* Unit */}
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                            Đơn vị
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none"
                            value={formData.unit}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    unit: e.target.value,
                                })
                            }
                            placeholder="VD: viên, hộp, chai..."
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                            Giá (đ)
                        </label>
                        <input
                            type="number"
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none"
                            value={formData.price}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    price: e.target.value,
                                })
                            }
                            placeholder="VD: 5000"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                            Mô tả
                        </label>
                        <textarea
                            rows={2}
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none resize-none"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            placeholder="Mô tả ngắn về thuốc..."
                        />
                    </div>

                    {/* IsActive (only for edit) */}
                    {formMode === 'edit' && (
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        isActive: e.target.checked,
                                    })
                                }
                                className="w-4 h-4 text-[#2563EB] border-slate-300 rounded focus:ring-[#2563EB]"
                            />
                            <label
                                htmlFor="isActive"
                                className="text-sm text-slate-700"
                            >
                                Đang hoạt động
                            </label>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 mt-4 border-t border-slate-100">
                    <button
                        onClick={() => setModalOpen(false)}
                        className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#2563EB] rounded-lg hover:bg-[#1d4ed8] transition"
                    >
                        {formMode === 'create' ? 'Thêm' : 'Lưu'}
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default MedicinesPage;
