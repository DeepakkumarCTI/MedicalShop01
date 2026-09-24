
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Delete",
  onConfirm,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#3F2930]/60 p-3 backdrop-blur-sm sm:p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#EAD5D8] bg-white shadow-2xl">
        {/* =========================
            HEADER
        ========================== */}
        <div className="flex items-start justify-between border-b border-[#EAD5D8] bg-[#9DB4C0] px-4 py-4 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#5C6B73] text-[#A96F7D] shadow-sm">
              <AlertTriangle size={21} />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#A96F7D]">
                Confirmation
              </p>

              <p className="mt-0.5 text-xs font-semibold text-[#9A858B]">
                Please confirm this action
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[#EAD5D8] bg-white text-[#9A858B] transition hover:border-[C2DFE3] hover:bg-[#5C6B73] hover:text-[#6A414B]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* =========================
            CONTENT
        ========================== */}
        <div className="px-4 py-5 sm:px-5 sm:py-6">
          <h3 className="text-lg font-extrabold text-[#3F2930]">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#6F5A60]">
            {message}
          </p>

          {/* Warning box */}
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#EAD5D8] bg-[#9DB4C0] px-3.5 py-3">
            <AlertTriangle
              size={16}
              className="mt-0.5 shrink-0 text-[#A96F7D]"
            />

            <p className="text-xs leading-5 text-[#7A5B63]">
              This action may affect the current data and cannot be
              undone.
            </p>
          </div>
        </div>

        {/* =========================
            ACTIONS
        ========================== */}
        <div className="flex flex-col-reverse gap-2 border-t border-[#EAD5D8] bg-white px-4 py-3 sm:flex-row sm:justify-end sm:px-5">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary w-full sm:w-auto"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-100 hover:text-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-100 sm:w-auto"
          >
            <AlertTriangle size={16} />
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

