import { AlertTriangle, X, ShieldAlert } from "lucide-react";

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
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-3 backdrop-blur-sm sm:p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#DCE5E8] bg-white shadow-[0_25px_70px_rgba(15,23,42,0.22)]">

        {/* =========================
            HEADER
        ========================== */}
        <div className="relative overflow-hidden border-b border-[#E3EAEC] bg-gradient-to-br from-[#F2F7F8] to-white px-4 py-4 sm:px-5 sm:py-5">
          {/* Decorative circle */}
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#EAF2F3] opacity-80" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#E1EAEC] bg-[#EAF2F3] text-[#64777D]">
                <ShieldAlert size={21} />
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#91A0A5] sm:text-[10px]">
                  Confirmation
                </p>

                <p className="mt-1 text-xs font-semibold text-[#6F8085]">
                  Please confirm this action
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#DCE5E8] bg-white text-[#8C999E] transition duration-200 hover:border-[#C5D9DC] hover:bg-[#F2F7F8] hover:text-[#52656B] focus:outline-none focus:ring-4 focus:ring-[#E5EFF1]"
              aria-label="Close"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* =========================
            CONTENT
        ========================== */}
        <div className="px-4 py-5 sm:px-5 sm:py-6">
          <h3 className="text-lg font-black leading-6 text-[#35464B]">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#68797F]">
            {message}
          </p>

          {/* Warning box */}
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#E5E9EA] bg-[#F7F9F9] px-3.5 py-3">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#F0F3F4] text-[#78888D]">
              <AlertTriangle size={15} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-wide text-[#74858A]">
                Warning
              </p>

              <p className="mt-0.5 text-xs leading-5 text-[#89969A]">
                This action may affect the current data and cannot be
                undone.
              </p>
            </div>
          </div>
        </div>

        {/* =========================
            ACTIONS
        ========================== */}
        <div className="flex flex-col-reverse gap-2 border-t border-[#E4EAEC] bg-[#FAFCFC] px-4 py-3 sm:flex-row sm:justify-end sm:px-5">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-[#DCE5E8] bg-white px-4 text-xs font-black text-[#68797F] transition duration-200 hover:border-[#C8D9DC] hover:bg-[#F3F7F8] hover:text-[#4D6066] focus:outline-none focus:ring-4 focus:ring-[#EAF2F3] sm:w-auto"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 text-xs font-black text-rose-600 transition duration-200 hover:border-rose-300 hover:bg-rose-100 hover:text-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-100 sm:w-auto"
          >
            <AlertTriangle size={15} />
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}