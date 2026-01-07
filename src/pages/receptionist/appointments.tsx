import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import AppointmentList from '@/components/receptionist/AppointmentList.tsx';
import CreateAppointmentForm from '@/components/receptionist/CreateAppointmentForm.tsx';

export default function ReceptionistAppointmentsPage() {

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleSuccessCreate = () => {
        setShowCreateModal(false);
        setRefreshKey(prev => prev + 1); // Trigger refresh of AppointmentList
    };

    return (
        <div className="relative">
            {/* Main Content */}
            <div className="px-6 py-8 lg:px-10">
                <div className="max-w-[1400px] mx-auto space-y-6">
                    {/* Header with Create Button */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <span className="inline-flex items-center rounded-full bg-[#E0ECFF] text-[#2563EB] text-[11px] font-semibold px-4 py-1.5 tracking-wide uppercase mb-3">
                                APPOINTMENT MANAGEMENT
                            </span>
                            <h1 className="text-xl font-semibold text-slate-900">Quản lý lịch hẹn</h1>
                            <p className="text-sm text-slate-500 mt-1">Theo dõi và quản lý các lịch hẹn khám</p>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-5 py-3 bg-[#2563EB] text-white text-sm font-semibold rounded-xl hover:bg-[#1D4ED8] shadow-lg shadow-blue-500/25 transition hover:scale-105"
                        >
                            <FiPlus className="w-4 h-4" />
                            Tạo lịch hẹn
                        </button>
                    </div>

                    {/* Appointment List Component with Real API */}
                    <AppointmentList key={refreshKey} />
                </div>
            </div>

            {/* Create Appointment Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setShowCreateModal(false)}
                    />
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
                        <CreateAppointmentForm
                            onSuccess={handleSuccessCreate}
                            onCancel={() => setShowCreateModal(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
