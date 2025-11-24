import React from "react";

interface StepModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle: string;
  icon?: React.ReactNode;
  progress?: number;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  children: React.ReactNode;
}

export const StepModal: React.FC<StepModalProps> = ({
  open,
  onClose,
  title = "Appointment - modal",
  subtitle,
  icon,
  progress = 0,
  primaryLabel = "Next",
  secondaryLabel = "Cancel",
  onPrimary,
  onSecondary,
  children,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-[380px] max-w-full rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-5 text-xs font-medium text-slate-400">
          {title}
        </div>

        <div className="px-6 pb-5 pt-3">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                {icon ?? (
                  <span className="text-lg" aria-hidden>
                    👤
                  </span>
                )}
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {subtitle}
              </div>
            </div>

            <div className="text-xs font-medium text-slate-400">
              {progress}%
            </div>
          </div>
          <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="space-y-3">{children}</div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onSecondary ?? onClose}
              className="flex-1 rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {secondaryLabel}
            </button>
            <button
              type="button"
              onClick={onPrimary}
              className="flex-1 rounded-lg bg-indigo-500 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-indigo-300"
            >
              {primaryLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
