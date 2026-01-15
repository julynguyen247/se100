import React, { useEffect, useMemo, useState } from 'react';
import {
    FiSearch,
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiRefreshCw,
    FiAlertCircle,
    FiCheck,
} from 'react-icons/fi';
import {
    getPatients,
    getAdminClinics,
    createPatient,
    updatePatient,
    deletePatient,
    type PatientItem,
    type AdminClinicOption,
    type CreatePatientRequest,
    type UpdatePatientRequest,
} from '@/services/apiAdmin';

type GenderFilter = 'ALL' | '1' | '2'; // 1 = Male, 2 = Female

type PatientFormState = {
    clinicId: string;
    patientCode: string;
    fullName: string;
    gender: number | '';
    dob: string;
    primaryPhone: string;
    email: string;
    addressLine1: string;
    note: string;
};

const initialForm: PatientFormState = {
    clinicId: '',
    patientCode: '',
    fullName: '',
    gender: '',
    dob: '',
    primaryPhone: '',
    email: '',
    addressLine1: '',
    note: '',
};

const PatientManagementPage: React.FC = () => {
    const [query, setQuery] = useState('');
    const [genderFilter, setGenderFilter] = useState<GenderFilter>('ALL');
    const [clinicFilter, setClinicFilter] = useState<string>('ALL');

    const [patients, setPatients] = useState<PatientItem[]>([]);
    const [clinics, setClinics] = useState<AdminClinicOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [showAddModal, setShowAddModal] = useState(false);
    const [addForm, setAddForm] = useState<PatientFormState>(initialForm);
    const [addSubmitting, setAddSubmitting] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState<PatientFormState>(initialForm);
    const [editingPatientId, setEditingPatientId] = useState<string | null>(
        null
    );
    const [editSubmitting, setEditSubmitting] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);

    // Delete Modal state
    const [deleteModal, setDeleteModal] = useState<{
        show: boolean;
        patient: PatientItem | null;
    }>({ show: false, patient: null });
    const [deleteSubmitting, setDeleteSubmitting] = useState(false);

    // Success Modal state
    const [successModal, setSuccessModal] = useState<{
        show: boolean;
        type: 'create' | 'update' | 'delete';
        name: string;
    }>({ show: false, type: 'create', name: '' });

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [patientsRes, clinicsRes] = await Promise.all([
                getPatients(),
                getAdminClinics(),
            ]);

            setPatients(patientsRes);
            setClinics(clinicsRes);
        } catch (err) {
            console.error('Failed to load patients:', err);
            setError(
                err instanceof Error
                    ? err.message
                    : 'Không thể tải danh sách bệnh nhân'
            );
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredPatients = useMemo(
        () =>
            patients.filter((p) => {
                const matchText =
                    p.fullName.toLowerCase().includes(query.toLowerCase()) ||
                    p.patientCode.toLowerCase().includes(query.toLowerCase()) ||
                    p.primaryPhone
                        ?.toLowerCase()
                        .includes(query.toLowerCase()) ||
                    p.email?.toLowerCase().includes(query.toLowerCase());

                const matchGender =
                    genderFilter === 'ALL' ||
                    p.gender.toString() === genderFilter;

                const matchClinic =
                    clinicFilter === 'ALL' || p.clinicId === clinicFilter;

                return matchText && matchGender && matchClinic;
            }),
        [patients, query, genderFilter, clinicFilter]
    );

    const handleAdd = () => {
        setAddForm(initialForm);
        setAddError(null);
        setShowAddModal(true);
    };

    const handleEdit = (patient: PatientItem) => {
        setEditingPatientId(patient.patientId);
        setEditForm({
            clinicId: patient.clinicId,
            patientCode: patient.patientCode,
            fullName: patient.fullName,
            gender: patient.gender,
            dob: patient.dob.split('T')[0], // Convert to YYYY-MM-DD
            primaryPhone: patient.primaryPhone || '',
            email: patient.email || '',
            addressLine1: patient.addressLine1 || '',
            note: patient.note || '',
        });
        setEditError(null);
        setShowEditModal(true);
    };

    const handleDelete = (patient: PatientItem) => {
        setDeleteModal({ show: true, patient });
    };

    const confirmDelete = async () => {
        const patient = deleteModal.patient;
        if (!patient) return;

        setDeleteSubmitting(true);
        try {
            const res = await deletePatient(patient.patientId);
            if (!res.isSuccess) {
                throw new Error(res.message || 'Không thể xóa bệnh nhân');
            }
            setDeleteModal({ show: false, patient: null });
            setSuccessModal({
                show: true,
                type: 'delete',
                name: patient.fullName,
            });
            await loadData();
        } catch (err) {
            console.error('Failed to delete patient:', err);
            setDeleteModal({ show: false, patient: null });
        } finally {
            setDeleteSubmitting(false);
        }
    };

    const handleSubmitAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddError(null);

        if (
            !addForm.clinicId ||
            !addForm.patientCode ||
            !addForm.fullName ||
            !addForm.gender
        ) {
            setAddError('Vui lòng điền đầy đủ thông tin bắt buộc.');
            return;
        }

        try {
            setAddSubmitting(true);
            const payload: CreatePatientRequest = {
                clinicId: addForm.clinicId,
                patientCode: addForm.patientCode,
                fullName: addForm.fullName,
                gender: addForm.gender as number,
                dob: addForm.dob || undefined,
                primaryPhone: addForm.primaryPhone || undefined,
                email: addForm.email || undefined,
                addressLine1: addForm.addressLine1 || undefined,
                note: addForm.note || undefined,
            };

            const res = await createPatient(payload);
            if (!res.isSuccess) {
                throw new Error(res.message || 'Không thể tạo bệnh nhân');
            }

            setShowAddModal(false);
            await loadData();
        } catch (err) {
            console.error('Failed to create patient:', err);
            setAddError(
                err instanceof Error ? err.message : 'Không thể tạo bệnh nhân'
            );
        } finally {
            setAddSubmitting(false);
        }
    };

    const handleSubmitEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEditError(null);

        if (
            !editingPatientId ||
            !editForm.clinicId ||
            !editForm.patientCode ||
            !editForm.fullName ||
            !editForm.gender
        ) {
            setEditError('Vui lòng điền đầy đủ thông tin bắt buộc.');
            return;
        }

        try {
            setEditSubmitting(true);
            const payload: UpdatePatientRequest = {
                clinicId: editForm.clinicId,
                patientCode: editForm.patientCode,
                fullName: editForm.fullName,
                gender: editForm.gender as number,
                dob: editForm.dob || undefined,
                primaryPhone: editForm.primaryPhone || undefined,
                email: editForm.email || undefined,
                addressLine1: editForm.addressLine1 || undefined,
                note: editForm.note || undefined,
            };

            const res = await updatePatient(editingPatientId, payload);
            if (!res.isSuccess) {
                throw new Error(res.message || 'Không thể cập nhật bệnh nhân');
            }

            setShowEditModal(false);
            setEditingPatientId(null);
            await loadData();
        } catch (err) {
            console.error('Failed to update patient:', err);
            setEditError(
                err instanceof Error
                    ? err.message
                    : 'Không thể cập nhật bệnh nhân'
            );
        } finally {
            setEditSubmitting(false);
        }
    };

    const formatGender = (gender: number) => {
        return gender === 1 ? 'Nam' : gender === 2 ? 'Nữ' : '—';
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '—';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('vi-VN');
        } catch {
            return '—';
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#F5F7FB] px-6 py-8 sm:px-10 lg:px-16">
            <div className="max-w-6xl mx-auto space-y-5">
                {/* Header */}
                <div>
                    <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
                        Quản lý bệnh nhân
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Quản lý hồ sơ bệnh nhân và thông tin cá nhân
                    </p>
                </div>

                {/* Search + filter + add */}
                <div className="bg-white rounded-t-2xl px-5 pt-4 pb-3 border border-b-0 border-slate-100">
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên, mã, số điện thoại..."
                                className="w-full rounded-lg border border-slate-200 bg-[#F9FAFB] pl-9 pr-3 py-2.5 text-sm outline-none focus:border-[#2563EB]"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>

                        {/* Clinic filter */}
                        <select
                            className="w-full md:w-44 rounded-lg border border-slate-200 bg-[#F9FAFB] px-3 py-2.5 text-sm outline-none focus:border-[#2563EB]"
                            value={clinicFilter}
                            onChange={(e) => setClinicFilter(e.target.value)}
                        >
                            <option value="ALL">Tất cả phòng khám</option>
                            {clinics.map((c) => (
                                <option key={c.clinicId} value={c.clinicId}>
                                    {c.name}
                                </option>
                            ))}
                        </select>

                        {/* Gender filter */}
                        <select
                            className="w-full md:w-36 rounded-lg border border-slate-200 bg-[#F9FAFB] px-3 py-2.5 text-sm outline-none focus:border-[#2563EB]"
                            value={genderFilter}
                            onChange={(e) =>
                                setGenderFilter(e.target.value as GenderFilter)
                            }
                        >
                            <option value="ALL">Tất cả giới tính</option>
                            <option value="1">Nam</option>
                            <option value="2">Nữ</option>
                        </select>

                        {/* Add + refresh buttons */}
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleAdd}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#EF4444] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#DC2626]"
                            >
                                <FiPlus className="w-4 h-4" />
                                <span>Thêm</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsRefreshing(true);
                                    loadData();
                                }}
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                            >
                                <FiRefreshCw
                                    className={`w-3.5 h-3.5 ${
                                        isRefreshing ? 'animate-spin' : ''
                                    }`}
                                />
                                <span>Làm mới</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error block */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-3">
                        <FiAlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-red-900">
                                Không tải được danh sách bệnh nhân
                            </p>
                            <p className="text-xs text-red-700 mt-1">{error}</p>
                        </div>
                        <button
                            type="button"
                            onClick={loadData}
                            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                        >
                            <FiRefreshCw className="w-3.5 h-3.5" />
                            Thử lại
                        </button>
                    </div>
                )}

                {/* Count display */}
                {!loading && !error && (
                    <div className="bg-white border-x border-slate-100 px-5 py-2">
                        <p className="text-xs text-slate-600">
                            Hiển thị{' '}
                            <span className="font-semibold text-slate-900">
                                {filteredPatients.length}
                            </span>{' '}
                            / {patients.length} bệnh nhân
                        </p>
                    </div>
                )}

                {/* Table */}
                <div className="bg-white rounded-b-2xl border border-t-0 border-slate-100 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-[#F9FAFB] text-xs text-slate-500">
                                <th className="text-center font-medium px-3 py-3 w-16">
                                    STT
                                </th>
                                <th className="text-left font-medium px-5 py-3">
                                    Mã BN
                                </th>
                                <th className="text-left font-medium px-5 py-3">
                                    Họ tên
                                </th>
                                <th className="text-left font-medium px-5 py-3">
                                    Giới tính
                                </th>
                                <th className="text-left font-medium px-5 py-3">
                                    Ngày sinh
                                </th>
                                <th className="text-left font-medium px-5 py-3">
                                    Điện thoại
                                </th>
                                <th className="text-left font-medium px-5 py-3">
                                    Email
                                </th>
                                <th className="text-center font-medium px-5 py-3">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading
                                ? Array.from({ length: 5 }).map((_, idx) => (
                                      <tr
                                          key={idx}
                                          className="border-t border-slate-100"
                                      >
                                          <td className="px-3 py-3 text-center text-slate-400">
                                              <div className="h-4 w-8 bg-slate-200 rounded animate-pulse mx-auto" />
                                          </td>
                                          <td className="px-5 py-3">
                                              <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
                                          </td>
                                          <td className="px-5 py-3">
                                              <div className="h-4 w-36 bg-slate-200 rounded animate-pulse" />
                                          </td>
                                          <td className="px-5 py-3">
                                              <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
                                          </td>
                                          <td className="px-5 py-3">
                                              <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                                          </td>
                                          <td className="px-5 py-3">
                                              <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
                                          </td>
                                          <td className="px-5 py-3">
                                              <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                                          </td>
                                          <td className="px-5 py-3">
                                              <div className="h-4 w-16 bg-slate-200 rounded animate-pulse mx-auto" />
                                          </td>
                                      </tr>
                                  ))
                                : filteredPatients.map((patient, idx) => (
                                      <tr
                                          key={patient.patientId}
                                          className={`border-t border-slate-100 ${
                                              idx % 2 === 1
                                                  ? 'bg-[#FCFCFD]'
                                                  : 'bg-white'
                                          }`}
                                      >
                                          <td className="px-3 py-3 text-center text-slate-500 font-medium">
                                              {idx + 1}
                                          </td>
                                          <td className="px-5 py-3 text-slate-800 font-medium">
                                              {patient.patientCode}
                                          </td>
                                          <td className="px-5 py-3 text-slate-800">
                                              {patient.fullName}
                                          </td>
                                          <td className="px-5 py-3 text-slate-600">
                                              {formatGender(patient.gender)}
                                          </td>
                                          <td className="px-5 py-3 text-slate-600">
                                              {formatDate(patient.dob)}
                                          </td>
                                          <td className="px-5 py-3 text-slate-600">
                                              {patient.primaryPhone || '—'}
                                          </td>
                                          <td className="px-5 py-3 text-slate-600">
                                              {patient.email || '—'}
                                          </td>
                                          <td className="px-5 py-3">
                                              <div className="flex items-center justify-center gap-3 text-[15px]">
                                                  <button
                                                      type="button"
                                                      onClick={() =>
                                                          handleEdit(patient)
                                                      }
                                                      className="text-[#2563EB] hover:text-[#1D4ED8]"
                                                  >
                                                      <FiEdit2 />
                                                  </button>
                                                  <button
                                                      type="button"
                                                      onClick={() =>
                                                          handleDelete(patient)
                                                      }
                                                      className="text-[#EF4444] hover:text-[#DC2626]"
                                                  >
                                                      <FiTrash2 />
                                                  </button>
                                              </div>
                                          </td>
                                      </tr>
                                  ))}

                            {!loading &&
                                filteredPatients.length === 0 &&
                                !error && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-5 py-6 text-center text-sm text-slate-400"
                                        >
                                            Không tìm thấy bệnh nhân phù hợp.
                                        </td>
                                    </tr>
                                )}
                        </tbody>
                    </table>
                </div>

                {/* Add Patient Modal */}
                {showAddModal && (
                    <PatientFormModal
                        title="Thêm bệnh nhân"
                        clinics={clinics}
                        form={addForm}
                        setForm={setAddForm}
                        error={addError}
                        submitting={addSubmitting}
                        onSubmit={handleSubmitAdd}
                        onClose={() => setShowAddModal(false)}
                    />
                )}

                {/* Edit Patient Modal */}
                {showEditModal && (
                    <PatientFormModal
                        title="Sửa bệnh nhân"
                        clinics={clinics}
                        form={editForm}
                        setForm={setEditForm}
                        error={editError}
                        submitting={editSubmitting}
                        onSubmit={handleSubmitEdit}
                        onClose={() => {
                            setShowEditModal(false);
                            setEditingPatientId(null);
                        }}
                    />
                )}

                {/* Delete Confirmation Modal */}
                {deleteModal.show && deleteModal.patient && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                                <FiTrash2 className="w-7 h-7 text-red-600" />
                            </div>

                            <h3 className="text-lg font-semibold text-slate-900 text-center mb-2">
                                Xác nhận xóa bệnh nhân
                            </h3>

                            <p className="text-sm text-slate-600 text-center mb-4">
                                Bạn có chắc chắn muốn xóa bệnh nhân{' '}
                                <span className="font-medium">
                                    "{deleteModal.patient.fullName}"
                                </span>
                                ?
                            </p>

                            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                                <p className="text-xs text-red-700 text-center">
                                    ⚠️ Hành động này không thể hoàn tác!
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() =>
                                        setDeleteModal({
                                            show: false,
                                            patient: null,
                                        })
                                    }
                                    disabled={deleteSubmitting}
                                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition disabled:opacity-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={deleteSubmitting}
                                    className="flex-1 px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition disabled:opacity-50"
                                >
                                    {deleteSubmitting ? 'Đang xóa...' : 'Xóa'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Modal */}
                {successModal.show && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
                            <div
                                className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                                    successModal.type === 'delete'
                                        ? 'bg-red-100'
                                        : 'bg-green-100'
                                }`}
                            >
                                <FiCheck
                                    className={`w-8 h-8 ${
                                        successModal.type === 'delete'
                                            ? 'text-red-600'
                                            : 'text-green-600'
                                    }`}
                                />
                            </div>

                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                {successModal.type === 'delete' &&
                                    'Đã xóa bệnh nhân!'}
                                {successModal.type === 'create' &&
                                    'Thêm thành công!'}
                                {successModal.type === 'update' &&
                                    'Cập nhật thành công!'}
                            </h3>

                            <p className="text-sm text-slate-600 mb-4">
                                {successModal.type === 'delete' && (
                                    <>
                                        Đã xóa bệnh nhân{' '}
                                        <span className="font-medium">
                                            {successModal.name}
                                        </span>
                                    </>
                                )}
                                {successModal.type === 'create' && (
                                    <>
                                        Đã thêm bệnh nhân{' '}
                                        <span className="font-medium">
                                            {successModal.name}
                                        </span>
                                    </>
                                )}
                                {successModal.type === 'update' && (
                                    <>
                                        Đã cập nhật thông tin bệnh nhân{' '}
                                        <span className="font-medium">
                                            {successModal.name}
                                        </span>
                                    </>
                                )}
                            </p>

                            <button
                                onClick={() =>
                                    setSuccessModal({
                                        show: false,
                                        type: 'create',
                                        name: '',
                                    })
                                }
                                className="w-full px-4 py-2.5 text-sm font-medium text-white bg-[#2563EB] rounded-xl hover:bg-[#1D4ED8] transition"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientManagementPage;

/* ====== Patient Form Modal Component ====== */

type PatientFormModalProps = {
    title: string;
    clinics: AdminClinicOption[];
    form: PatientFormState;
    setForm: React.Dispatch<React.SetStateAction<PatientFormState>>;
    error: string | null;
    submitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
};

const PatientFormModal: React.FC<PatientFormModalProps> = ({
    title,
    clinics,
    form,
    setForm,
    error,
    submitting,
    onSubmit,
    onClose,
}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    {title}
                </h2>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Clinic */}
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                Phòng khám *
                            </label>
                            <select
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] bg-white"
                                value={form.clinicId}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        clinicId: e.target.value,
                                    }))
                                }
                            >
                                <option value="">Chọn phòng khám</option>
                                {clinics.map((c) => (
                                    <option key={c.clinicId} value={c.clinicId}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Patient Code */}
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                Mã bệnh nhân *
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] bg-white"
                                value={form.patientCode}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        patientCode: e.target.value,
                                    }))
                                }
                                placeholder="VD: BN001"
                            />
                        </div>

                        {/* Full Name */}
                        <div className="col-span-2">
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                Họ và tên *
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] bg-white"
                                value={form.fullName}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        fullName: e.target.value,
                                    }))
                                }
                                placeholder="VD: Nguyễn Văn A"
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                Giới tính *
                            </label>
                            <select
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] bg-white"
                                value={form.gender}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        gender: e.target.value
                                            ? parseInt(e.target.value)
                                            : '',
                                    }))
                                }
                            >
                                <option value="">Chọn giới tính</option>
                                <option value="1">Nam</option>
                                <option value="2">Nữ</option>
                            </select>
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                Ngày sinh
                            </label>
                            <input
                                type="date"
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] bg-white"
                                value={form.dob}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        dob: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                Số điện thoại
                            </label>
                            <input
                                type="tel"
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] bg-white"
                                value={form.primaryPhone}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        primaryPhone: e.target.value,
                                    }))
                                }
                                placeholder="VD: 0912345678"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] bg-white"
                                value={form.email}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        email: e.target.value,
                                    }))
                                }
                                placeholder="VD: example@email.com"
                            />
                        </div>

                        {/* Address */}
                        <div className="col-span-2">
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                Địa chỉ
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] bg-white"
                                value={form.addressLine1}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        addressLine1: e.target.value,
                                    }))
                                }
                                placeholder="VD: 123 Đường ABC, Quận 1, TP.HCM"
                            />
                        </div>

                        {/* Note */}
                        <div className="col-span-2">
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                Ghi chú
                            </label>
                            <textarea
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] bg-white"
                                value={form.note}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        note: e.target.value,
                                    }))
                                }
                                placeholder="Ghi chú thêm về bệnh nhân..."
                                rows={3}
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                if (!submitting) onClose();
                            }}
                            className="px-4 py-2.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1D4ED8] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {submitting && (
                                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            )}
                            <span>Lưu</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
