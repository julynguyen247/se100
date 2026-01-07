import { useState } from 'react';
import {
    updateAppointment,
    type UpdateAppointmentRequest,
    type ReceptionistAppointment,
} from '@/services/apiReceptionist';

interface UpdateAppointmentFormProps {
    appointment: ReceptionistAppointment;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function UpdateAppointmentForm({
    appointment,
    onSuccess,
    onCancel,
}: UpdateAppointmentFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<UpdateAppointmentRequest>({
        patientName: appointment.patientName,
        phone: appointment.phone,
        serviceId: '', // TODO: Get from API
        doctorId: '', // TODO: Get from API
        date: appointment.date,
        time: appointment.time,
        duration: appointment.duration,
        notes: appointment.notes || '',
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'duration' ? parseInt(value) || 30 : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            setLoading(true);
            const result = await updateAppointment(appointment.id, formData);

            if (result.isSuccess && result.data) {
                alert('✅ Cập nhật lịch hẹn thành công!');
                onSuccess?.();
            }
        } catch (err: any) {
            console.error('Error updating appointment:', err);
            setError(err.message || 'Có lỗi xảy ra khi cập nhật lịch hẹn');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-6">Cập nhật lịch hẹn</h2>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Patient Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên bệnh nhân
                    </label>
                    <input
                        type="text"
                        name="patientName"
                        value={formData.patientName}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>

                {/* Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày khám
                    </label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>

                {/* Time */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giờ khám
                    </label>
                    <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>

                {/* Duration */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thời gian (phút)
                    </label>
                    <select
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                        <option value={15}>15 phút</option>
                        <option value={30}>30 phút</option>
                        <option value={45}>45 phút</option>
                        <option value={60}>60 phút</option>
                    </select>
                </div>
            </div>

            {/* Notes */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú
                </label>
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Ghi chú thêm (nếu có)..."
                />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                    >
                        Hủy
                    </button>
                )}
            </div>
        </form>
    );
}
