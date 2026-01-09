import React from 'react';

interface ToothStatusDisplayProps {
    notes: string | any;
}

const ToothStatusDisplay: React.FC<ToothStatusDisplayProps> = ({ notes }) => {
    try {
        let parsed = notes;

        // Check if notes has format: [ToothStatus]: {"T26":"normal"}
        if (typeof notes === 'string' && notes.includes('[ToothStatus]:')) {
            const jsonPart = notes.split('[ToothStatus]:')[1]?.trim();
            if (jsonPart) {
                parsed = JSON.parse(jsonPart);
            }
        } else if (typeof notes === 'string') {
            try {
                parsed = JSON.parse(notes);
            } catch {
                // Not JSON, return plain text
                return (
                    <div>
                        <p className="text-sm font-medium text-slate-700">
                            Ghi chú
                        </p>
                        <p className="text-sm text-slate-900 mt-1 whitespace-pre-wrap">
                            {notes}
                        </p>
                    </div>
                );
            }
        }

        // Check if object has tooth keys
        const keys = Object.keys(parsed);
        const hasToothKeys = keys.some((k) => /^T\d+$/i.test(k));

        if (!hasToothKeys) {
            return (
                <div>
                    <p className="text-sm font-medium text-slate-700">
                        Ghi chú
                    </p>
                    <p className="text-sm text-slate-900 mt-1 whitespace-pre-wrap">
                        {JSON.stringify(parsed, null, 2)}
                    </p>
                </div>
            );
        }

        // Helper functions for tooth status
        const getStatusColor = (status: string) => {
            if (status === 'normal')
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            if (status.includes('cavity') || status.includes('caries'))
                return 'bg-rose-50 text-rose-700 border-rose-200';
            if (status.includes('missing'))
                return 'bg-slate-100 text-slate-700 border-slate-300';
            return 'bg-amber-50 text-amber-700 border-amber-200';
        };

        const getStatusIcon = (status: string) => {
            if (status === 'normal') return '✓';
            if (status.includes('cavity') || status.includes('caries'))
                return '⚠';
            if (status.includes('missing')) return '✗';
            return '●';
        };

        const getStatusLabel = (status: string) => {
            if (status === 'normal') return 'Khỏe mạnh';
            if (status.includes('cavity')) return 'Sâu răng';
            if (status.includes('caries')) return 'Sâu răng';
            if (status.includes('missing')) return 'Mất răng';
            return status;
        };

        return (
            <div>
                <p className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                    <span className="text-lg">🦷</span>
                    Tình trạng răng
                </p>
                <div className="space-y-2">
                    {keys
                        .filter((k) => /^T\d+$/i.test(k))
                        .map((toothNum, idx) => {
                            const status = parsed[toothNum];
                            return (
                                <div
                                    key={idx}
                                    className={`flex items-center justify-between p-3 rounded-lg border transition-all hover:shadow-sm ${getStatusColor(
                                        status
                                    )}`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-base font-bold">
                                            {getStatusIcon(status)}
                                        </span>
                                        <span className="font-semibold text-sm">
                                            Răng #{toothNum}
                                        </span>
                                    </div>
                                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/70 shadow-sm">
                                        {getStatusLabel(status)}
                                    </span>
                                </div>
                            );
                        })}
                </div>
            </div>
        );
    } catch (error) {
        // Fallback for any parsing errors
        return (
            <div>
                <p className="text-sm font-medium text-slate-700">Ghi chú</p>
                <p className="text-sm text-slate-900 mt-1 whitespace-pre-wrap">
                    {typeof notes === 'string' ? notes : JSON.stringify(notes)}
                </p>
            </div>
        );
    }
};

export default ToothStatusDisplay;
