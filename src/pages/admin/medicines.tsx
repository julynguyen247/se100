import React, { useState, useEffect } from 'react';
import {
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiSearch,
    FiPackage,
    FiCheck,
    FiAlertCircle,
} from 'react-icons/fi';
import { FaPills } from 'react-icons/fa';
import Modal from '@/components/ui/Modal';
import {
    getMedicines,
    createMedicine,
    updateMedicine,
    deleteMedicine,
    updateMedicineStock,
    Medicine,
    CreateMedicineRequest,
    UpdateMedicineRequest,
    UpdateStockRequest,
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

    // Stock Update Modal state
    const [stockModalOpen, setStockModalOpen] = useState(false);
    const [stockMedicine, setStockMedicine] = useState<Medicine | null>(null);
    const [stockQuantity, setStockQuantity] = useState('');
    const [stockNotes, setStockNotes] = useState('');
    const [stockSubmitting, setStockSubmitting] = useState(false);

    // Success Modal state (generic for all actions)
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [successInfo, setSuccessInfo] = useState<{
        type: 'create' | 'update' | 'delete' | 'stock';
        medicineName: string;
        // For stock updates
        oldQuantity?: number;
        newQuantity?: number;
        change?: number;
    } | null>(null);

    // Error Modal state
    const [errorModal, setErrorModal] = useState<{
        show: boolean;
        message: string;
    }>({ show: false, message: '' });

    // Delete Confirmation Modal state
    const [deleteModal, setDeleteModal] = useState<{
        show: boolean;
        medicine: Medicine | null;
    }>({ show: false, medicine: null });

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
            setErrorModal({
                show: true,
                message: 'Lỗi khi tải danh sách thuốc',
            });
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
            setErrorModal({
                show: true,
                message: 'Vui lòng nhập mã thuốc và tên thuốc!',
            });
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
                    setSuccessInfo({
                        type: 'create',
                        medicineName: formData.name,
                    });
                    setModalOpen(false);
                    setSuccessModalOpen(true);
                    fetchMedicines();
                } else {
                    setErrorModal({
                        show: true,
                        message: response.message || 'Không thể thêm thuốc',
                    });
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
                    setSuccessInfo({
                        type: 'update',
                        medicineName: formData.name,
                    });
                    setModalOpen(false);
                    setSuccessModalOpen(true);
                    fetchMedicines();
                } else {
                    setErrorModal({
                        show: true,
                        message: response.message || 'Không thể cập nhật thuốc',
                    });
                }
            }
        } catch (error) {
            console.error('Error saving medicine:', error);
            setErrorModal({ show: true, message: 'Lỗi kết nối server' });
        }
    };

    const handleDelete = (medicine: Medicine) => {
        setDeleteModal({ show: true, medicine });
    };

    const confirmDelete = async () => {
        if (!deleteModal.medicine) return;
        const medicine = deleteModal.medicine;
        setDeleteModal({ show: false, medicine: null });

        try {
            const response = await deleteMedicine(medicine.medicineId);
            if (response.isSuccess) {
                setSuccessInfo({
                    type: 'delete',
                    medicineName: medicine.name,
                });
                setSuccessModalOpen(true);
                fetchMedicines();
            } else {
                setErrorModal({
                    show: true,
                    message: response.message || 'Không thể xóa thuốc',
                });
            }
        } catch (error) {
            console.error('Error deleting medicine:', error);
            setErrorModal({ show: true, message: 'Lỗi kết nối server' });
        }
    };

    // Stock Update handlers
    const handleOpenStockModal = (medicine: Medicine) => {
        setStockMedicine(medicine);
        setStockQuantity('');
        setStockNotes('');
        setStockModalOpen(true);
    };

    const handleUpdateStock = async () => {
        if (!stockMedicine || !stockQuantity) {
            setErrorModal({ show: true, message: 'Vui lòng nhập số lượng!' });
            return;
        }

        const qty = parseInt(stockQuantity);
        if (isNaN(qty)) {
            setErrorModal({ show: true, message: 'Số lượng không hợp lệ!' });
            return;
        }

        try {
            setStockSubmitting(true);
            const request: UpdateStockRequest = {
                quantity: qty,
                notes: stockNotes || undefined,
            };

            const response = await updateMedicineStock(
                stockMedicine.medicineId,
                request
            );
            if (response.isSuccess) {
                const oldQty = stockMedicine.stockQuantity;
                const newQty = oldQty + qty;
                setSuccessInfo({
                    type: 'stock',
                    medicineName: stockMedicine.name,
                    oldQuantity: oldQty,
                    newQuantity: newQty,
                    change: qty,
                });
                setStockModalOpen(false);
                setSuccessModalOpen(true);
                fetchMedicines();
            } else {
                setErrorModal({
                    show: true,
                    message: response.message || 'Không thể cập nhật tồn kho',
                });
            }
        } catch (error) {
            console.error('Error updating stock:', error);
            setErrorModal({ show: true, message: 'Lỗi kết nối server' });
        } finally {
            setStockSubmitting(false);
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
                                            Tồn kho
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
                                                colSpan={7}
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
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={`text-sm font-medium ${
                                                                medicine.isLowStock
                                                                    ? 'text-red-600'
                                                                    : 'text-slate-700'
                                                            }`}
                                                        >
                                                            {
                                                                medicine.stockQuantity
                                                            }
                                                        </span>
                                                        {medicine.isLowStock && (
                                                            <span className="text-xs text-red-500">
                                                                (thấp)
                                                            </span>
                                                        )}
                                                        {medicine.isActive ? (
                                                            <button
                                                                onClick={() =>
                                                                    handleOpenStockModal(
                                                                        medicine
                                                                    )
                                                                }
                                                                className="ml-1 p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                                                                title="Cập nhật tồn kho"
                                                            >
                                                                <FiPackage className="w-3.5 h-3.5" />
                                                            </button>
                                                        ) : (
                                                            <span
                                                                className="ml-1 p-1 text-slate-300 cursor-not-allowed"
                                                                title="Thuốc đã ngừng dùng"
                                                            >
                                                                <FiPackage className="w-3.5 h-3.5" />
                                                            </span>
                                                        )}
                                                    </div>
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

            {/* Stock Update Modal */}
            <Modal
                open={stockModalOpen}
                onClose={() => setStockModalOpen(false)}
                title="Cập nhật tồn kho"
                className="max-w-md"
            >
                <div className="space-y-4">
                    {/* Medicine Info */}
                    {stockMedicine && (
                        <div className="bg-slate-50 rounded-lg p-3">
                            <p className="text-sm font-medium text-slate-900">
                                {stockMedicine.name}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                Mã: {stockMedicine.code}
                            </p>
                        </div>
                    )}

                    {/* Quantity */}
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                            Số lượng thay đổi *
                        </label>
                        <input
                            type="number"
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none"
                            value={stockQuantity}
                            onChange={(e) => setStockQuantity(e.target.value)}
                            placeholder="VD: 100 (nhập kho) hoặc -10 (xuất kho)"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            Nhập số dương để thêm, số âm để trừ tồn kho
                        </p>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                            Ghi chú
                        </label>
                        <textarea
                            rows={2}
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none resize-none"
                            value={stockNotes}
                            onChange={(e) => setStockNotes(e.target.value)}
                            placeholder="VD: Nhập kho ngày 15/01, Kiểm kê cuối tháng..."
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 mt-4 border-t border-slate-100">
                    <button
                        onClick={() => setStockModalOpen(false)}
                        className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
                        disabled={stockSubmitting}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleUpdateStock}
                        disabled={stockSubmitting}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#2563EB] rounded-lg hover:bg-[#1d4ed8] transition disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {stockSubmitting ? 'Đang xử lý...' : 'Cập nhật'}
                    </button>
                </div>
            </Modal>

            {/* Success Modal */}
            {successModalOpen && successInfo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
                        {/* Success Icon */}
                        <div
                            className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                                successInfo.type === 'delete'
                                    ? 'bg-red-100'
                                    : 'bg-green-100'
                            }`}
                        >
                            <FiCheck
                                className={`w-8 h-8 ${
                                    successInfo.type === 'delete'
                                        ? 'text-red-600'
                                        : 'text-green-600'
                                }`}
                            />
                        </div>

                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            {successInfo.type === 'create' &&
                                'Thêm thuốc thành công!'}
                            {successInfo.type === 'update' &&
                                'Cập nhật thành công!'}
                            {successInfo.type === 'delete' && 'Đã xóa thuốc!'}
                            {successInfo.type === 'stock' &&
                                'Cập nhật tồn kho thành công!'}
                        </h3>

                        <p className="text-sm text-slate-600 mb-4">
                            {successInfo.type === 'create' && (
                                <>
                                    Đã thêm thuốc{' '}
                                    <span className="font-medium">
                                        {successInfo.medicineName}
                                    </span>{' '}
                                    vào danh mục
                                </>
                            )}
                            {successInfo.type === 'update' && (
                                <>
                                    Đã cập nhật thông tin thuốc{' '}
                                    <span className="font-medium">
                                        {successInfo.medicineName}
                                    </span>
                                </>
                            )}
                            {successInfo.type === 'delete' && (
                                <>
                                    Đã xóa thuốc{' '}
                                    <span className="font-medium">
                                        {successInfo.medicineName}
                                    </span>{' '}
                                    khỏi danh mục
                                </>
                            )}
                            {successInfo.type === 'stock' && (
                                <>
                                    Đã cập nhật tồn kho cho{' '}
                                    <span className="font-medium">
                                        {successInfo.medicineName}
                                    </span>
                                </>
                            )}
                        </p>

                        {/* Stock change details - only for stock type */}
                        {successInfo.type === 'stock' &&
                            successInfo.oldQuantity !== undefined && (
                                <div className="bg-slate-50 rounded-lg p-4 mb-4">
                                    <div className="flex justify-between items-center text-sm mb-2">
                                        <span className="text-slate-500">
                                            Tồn kho cũ:
                                        </span>
                                        <span className="font-medium text-slate-700">
                                            {successInfo.oldQuantity}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm mb-2">
                                        <span className="text-slate-500">
                                            Thay đổi:
                                        </span>
                                        <span
                                            className={`font-medium ${
                                                (successInfo.change ?? 0) >= 0
                                                    ? 'text-green-600'
                                                    : 'text-red-600'
                                            }`}
                                        >
                                            {(successInfo.change ?? 0) >= 0
                                                ? '+'
                                                : ''}
                                            {successInfo.change}
                                        </span>
                                    </div>
                                    <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between items-center text-sm">
                                        <span className="text-slate-700 font-medium">
                                            Tồn kho mới:
                                        </span>
                                        <span className="font-semibold text-blue-600 text-lg">
                                            {successInfo.newQuantity}
                                        </span>
                                    </div>
                                </div>
                            )}

                        <button
                            onClick={() => {
                                setSuccessModalOpen(false);
                                setSuccessInfo(null);
                            }}
                            className="w-full px-4 py-2.5 text-sm font-medium text-white bg-[#2563EB] rounded-lg hover:bg-[#1d4ed8] transition"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}

            {/* Error Modal */}
            {errorModal.show && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                            <FiAlertCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            Lỗi
                        </h3>
                        <p className="text-sm text-slate-600 mb-4">
                            {errorModal.message}
                        </p>
                        <button
                            onClick={() =>
                                setErrorModal({ show: false, message: '' })
                            }
                            className="w-full px-4 py-2.5 text-sm font-medium text-white bg-slate-600 rounded-xl hover:bg-slate-700 transition"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal.show && deleteModal.medicine && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                            <FiTrash2 className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            Xác nhận xóa
                        </h3>
                        <p className="text-sm text-slate-600 mb-4">
                            Bạn có chắc muốn xóa thuốc "
                            {deleteModal.medicine.name}"?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() =>
                                    setDeleteModal({
                                        show: false,
                                        medicine: null,
                                    })
                                }
                                className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicinesPage;
