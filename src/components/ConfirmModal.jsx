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
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#FFF275] text-[#3A0CA3]">
            <AlertTriangle size={21} />
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-[#FFF275]/50 hover:text-[#3A0CA3]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <h3 className="mt-4 text-lg font-bold text-slate-900">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {message}
        </p>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>

          <button onClick={onConfirm} className="btn-danger">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}