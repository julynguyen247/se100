import React, {
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import ReactDOM from "react-dom";
import { FiX } from "react-icons/fi";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;

  showCloseButton?: boolean;

  closeOnBackdrop?: boolean;

  initialFocusRef?: RefObject<HTMLElement>;

  preventScroll?: boolean;

  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  footer,
  showCloseButton = true,
  closeOnBackdrop = true,
  initialFocusRef,
  preventScroll = true,
  className = "",
}) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!preventScroll) return;
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open, preventScroll]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    if (initialFocusRef?.current) {
      initialFocusRef.current.focus();
      return;
    }

    if (showCloseButton && closeBtnRef.current) {
      closeBtnRef.current.focus();
      return;
    }

    if (panelRef.current) {
      panelRef.current.focus();
    }
  }, [open, initialFocusRef, showCloseButton]);

  if (!open) return null;
  if (typeof document === "undefined") return null; // phòng SSR

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!closeOnBackdrop) return;
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const panelClasses = [
    "w-full max-w-lg",
    "bg-white rounded-2xl shadow-xl",
    "p-4 sm:p-5",
    "focus:outline-none",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0 bg-black/40"
      onClick={handleBackdropClick}
    >
      <div ref={panelRef} tabIndex={-1} className={panelClasses}>
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between mb-3">
            {title ? (
              <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
            ) : (
              <div />
            )}

            {showCloseButton && (
              <button
                type="button"
                ref={closeBtnRef}
                onClick={onClose}
                className="p-1 rounded-full text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        <div className="text-xs sm:text-sm text-slate-700">{children}</div>

        {footer && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
