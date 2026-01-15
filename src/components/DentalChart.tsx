import React, { useState, useEffect } from 'react';
import {
    ToothStatus,
    ToothStatusLabels,
    ToothStatusColors,
    ToothRecordDto,
    DentalChartDto,
    ToothUpdate,
    UPPER_TEETH,
    LOWER_TEETH,
    getDentalChart,
    batchUpdateToothRecords,
} from '@/services/apiDentalChart';

interface DentalChartProps {
    patientId: string;
    patientName?: string;
    medicalRecordId?: string;
    editable?: boolean;
    onSave?: (updates: ToothUpdate[]) => void;
    compact?: boolean;
}

interface ToothProps {
    toothNumber: number;
    record: ToothRecordDto | null;
    isSelected: boolean;
    onClick: () => void;
    editable: boolean;
    pendingUpdate?: ToothUpdate;
}

const Tooth: React.FC<ToothProps> = ({
    toothNumber,
    record,
    isSelected,
    onClick,
    editable,
    pendingUpdate,
}) => {
    const status =
        pendingUpdate?.status ?? record?.status ?? ToothStatus.Healthy;
    const color = ToothStatusColors[status];
    const isUpper = toothNumber < 30;
    const isHealthy = status === ToothStatus.Healthy;

    return (
        <button
            onClick={onClick}
            className={`group flex flex-col items-center transition-all duration-150 ${
                editable ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            } ${isSelected ? 'scale-110 z-10' : ''}`}
            title={`Răng số ${toothNumber} - ${ToothStatusLabels[status]}`}
        >
            {/* Tooth number - top for upper teeth */}
            {isUpper && (
                <span
                    className={`text-[9px] mb-0.5 ${
                        isSelected
                            ? 'text-blue-600 font-bold'
                            : 'text-slate-500'
                    }`}
                >
                    {toothNumber}
                </span>
            )}

            {/* Tooth visual - rectangular */}
            <div
                className={`
                    w-6 h-7 relative flex items-center justify-center
                    transition-all duration-150
                    ${
                        isUpper
                            ? 'rounded-t-lg rounded-b-md'
                            : 'rounded-b-lg rounded-t-md'
                    }
                    ${
                        isHealthy
                            ? 'bg-white border-2 border-slate-300 group-hover:border-slate-400'
                            : `border-2`
                    }
                    ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : ''}
                    ${pendingUpdate ? 'ring-2 ring-yellow-400' : ''}
                `}
                style={{
                    backgroundColor: color,
                    borderColor: isSelected
                        ? '#3b82f6'
                        : isHealthy
                        ? undefined
                        : color,
                }}
            >
                {/* Root indicator */}
                <div
                    className={`absolute ${
                        isUpper ? 'bottom-0' : 'top-0'
                    } left-1/2 -translate-x-1/2 w-0.5 h-1.5 ${
                        isHealthy ? 'bg-slate-200' : 'bg-white/50'
                    }`}
                />
            </div>

            {/* Tooth number - bottom for lower teeth */}
            {!isUpper && (
                <span
                    className={`text-[9px] mt-0.5 ${
                        isSelected
                            ? 'text-blue-600 font-bold'
                            : 'text-slate-500'
                    }`}
                >
                    {toothNumber}
                </span>
            )}
        </button>
    );
};

const DentalChart: React.FC<DentalChartProps> = ({
    patientId,
    patientName,
    medicalRecordId,
    editable = false,
    onSave,
    compact = false,
}) => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dentalChart, setDentalChart] = useState<DentalChartDto | null>(null);
    const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
    const [pendingUpdates, setPendingUpdates] = useState<
        Map<number, ToothUpdate>
    >(new Map());
    const [showStatusPicker, setShowStatusPicker] = useState(false);

    // Fetch dental chart on mount
    useEffect(() => {
        const fetchDentalChart = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getDentalChart(patientId);
                setDentalChart(data);
            } catch (err) {
                console.error('Error fetching dental chart:', err);
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Không thể tải sơ đồ răng'
                );
            } finally {
                setLoading(false);
            }
        };

        if (patientId) {
            fetchDentalChart();
        }
    }, [patientId]);

    // Get tooth record by number
    const getToothRecord = (toothNumber: number): ToothRecordDto | null => {
        return (
            dentalChart?.teeth.find((t) => t.toothNumber === toothNumber) ||
            null
        );
    };

    // Handle tooth click
    const handleToothClick = (toothNumber: number) => {
        if (!editable) return;
        setSelectedTooth(toothNumber);
        setShowStatusPicker(true);
    };

    // Handle status change
    const handleStatusChange = (status: ToothStatus, notes?: string) => {
        if (selectedTooth === null) return;

        const update: ToothUpdate = {
            toothNumber: selectedTooth,
            status,
            notes,
        };

        setPendingUpdates((prev) => {
            const newMap = new Map(prev);
            newMap.set(selectedTooth, update);
            return newMap;
        });

        setShowStatusPicker(false);
        setSelectedTooth(null);
    };

    // Handle save
    const handleSave = async () => {
        if (pendingUpdates.size === 0) return;

        try {
            setSaving(true);
            const updates = Array.from(pendingUpdates.values());

            await batchUpdateToothRecords({
                patientId,
                medicalRecordId,
                teeth: updates,
            });

            // Refresh dental chart
            const data = await getDentalChart(patientId);
            setDentalChart(data);
            setPendingUpdates(new Map());

            if (onSave) {
                onSave(updates);
            }
        } catch (err) {
            console.error('Error saving dental chart:', err);
            setError(
                err instanceof Error ? err.message : 'Không thể lưu sơ đồ răng'
            );
        } finally {
            setSaving(false);
        }
    };

    // Handle cancel changes
    const handleCancel = () => {
        setPendingUpdates(new Map());
        setSelectedTooth(null);
        setShowStatusPicker(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                <span className="ml-2 text-slate-600">
                    Đang tải sơ đồ răng...
                </span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                <p className="font-medium">Lỗi</p>
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div
            className={`bg-white rounded-xl border border-slate-200 ${
                compact ? 'p-3' : 'p-4'
            }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                        Sơ đồ răng
                    </h3>
                    {patientName && (
                        <p className="text-sm text-slate-500">{patientName}</p>
                    )}
                </div>
                {editable && pendingUpdates.size > 0 && (
                    <div className="flex gap-2">
                        <button
                            onClick={handleCancel}
                            disabled={saving}
                            className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800 border border-slate-300 rounded-lg hover:bg-slate-50"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-3 py-1.5 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-lg disabled:opacity-50 flex items-center gap-1"
                        >
                            {saving && (
                                <svg
                                    className="animate-spin h-4 w-4"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                    />
                                </svg>
                            )}
                            Lưu ({pendingUpdates.size})
                        </button>
                    </div>
                )}
            </div>

            {/* Dental Chart Grid */}
            <div className="relative">
                {/* Upper jaw label */}
                <div className="text-center text-xs text-slate-400 mb-1">
                    Hàm trên
                </div>

                {/* Upper teeth row */}
                <div className="flex justify-center gap-0.5 mb-2">
                    {UPPER_TEETH.map((num) => (
                        <Tooth
                            key={num}
                            toothNumber={num}
                            record={getToothRecord(num)}
                            isSelected={selectedTooth === num}
                            onClick={() => handleToothClick(num)}
                            editable={editable}
                            pendingUpdate={pendingUpdates.get(num)}
                        />
                    ))}
                </div>

                {/* Divider line (represents the bite line) */}
                <div className="relative my-3">
                    <div className="border-t-2 border-dashed border-slate-300" />
                    <div className="absolute left-1/2 -translate-x-1/2 -top-2 bg-white px-2 text-xs text-slate-400">
                        {editable
                            ? 'Click vào răng để thay đổi trạng thái'
                            : ''}
                    </div>
                </div>

                {/* Lower teeth row */}
                <div className="flex justify-center gap-0.5 mt-2">
                    {LOWER_TEETH.map((num) => (
                        <Tooth
                            key={num}
                            toothNumber={num}
                            record={getToothRecord(num)}
                            isSelected={selectedTooth === num}
                            onClick={() => handleToothClick(num)}
                            editable={editable}
                            pendingUpdate={pendingUpdates.get(num)}
                        />
                    ))}
                </div>

                {/* Lower jaw label */}
                <div className="text-center text-xs text-slate-400 mt-1">
                    Hàm dưới
                </div>
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 mb-2">Chú thích:</p>
                <div className="flex flex-wrap gap-3">
                    {Object.entries(ToothStatusLabels).map(
                        ([status, label]) => {
                            const statusNum = Number(status) as ToothStatus;
                            const isWhite = statusNum === ToothStatus.Healthy;
                            return (
                                <div
                                    key={status}
                                    className="flex items-center gap-1.5"
                                >
                                    <div
                                        className={`w-3 h-4 rounded ${
                                            isWhite
                                                ? 'border border-slate-300'
                                                : ''
                                        }`}
                                        style={{
                                            backgroundColor:
                                                ToothStatusColors[statusNum],
                                        }}
                                    />
                                    <span className="text-xs text-slate-600">
                                        {label}
                                    </span>
                                </div>
                            );
                        }
                    )}
                </div>
            </div>

            {/* Status Picker Modal */}
            {showStatusPicker && selectedTooth !== null && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-4 max-w-md w-full mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-slate-800">
                                Răng số {selectedTooth}
                            </h4>
                            <button
                                onClick={() => {
                                    setShowStatusPicker(false);
                                    setSelectedTooth(null);
                                }}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <p className="text-sm text-slate-600 mb-3">
                            Chọn trạng thái răng:
                        </p>

                        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                            {Object.entries(ToothStatusLabels).map(
                                ([status, label]) => {
                                    const statusNum = Number(
                                        status
                                    ) as ToothStatus;
                                    const currentRecord =
                                        getToothRecord(selectedTooth);
                                    const pendingUpdate =
                                        pendingUpdates.get(selectedTooth);
                                    const isCurrentStatus =
                                        (pendingUpdate?.status ??
                                            currentRecord?.status ??
                                            ToothStatus.Healthy) === statusNum;

                                    return (
                                        <button
                                            key={status}
                                            onClick={() =>
                                                handleStatusChange(statusNum)
                                            }
                                            className={`
                      flex items-center gap-2 p-2 rounded-lg border transition-all
                      ${
                          isCurrentStatus
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }
                    `}
                                        >
                                            <div
                                                className={`w-4 h-5 rounded ${
                                                    statusNum ===
                                                    ToothStatus.Healthy
                                                        ? 'border border-slate-300'
                                                        : ''
                                                }`}
                                                style={{
                                                    backgroundColor:
                                                        ToothStatusColors[
                                                            statusNum
                                                        ],
                                                }}
                                            />
                                            <span className="text-sm text-slate-700">
                                                {label}
                                            </span>
                                            {isCurrentStatus && (
                                                <svg
                                                    className="w-4 h-4 text-blue-500 ml-auto"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            )}
                                        </button>
                                    );
                                }
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Last updated info */}
            {dentalChart?.lastUpdatedAt && (
                <div className="mt-3 text-xs text-slate-400 text-right">
                    Cập nhật lần cuối:{' '}
                    {new Date(dentalChart.lastUpdatedAt).toLocaleDateString(
                        'vi-VN',
                        {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        }
                    )}
                </div>
            )}
        </div>
    );
};

export default DentalChart;
