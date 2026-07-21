"use client";

interface DeleteDialogProps {
  open: boolean;
  taskTitle?: string;
  submitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteDialog({ open, taskTitle, submitting, onCancel, onConfirm }: DeleteDialogProps) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/40" onClick={onCancel} aria-hidden="true" />
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          className="w-full max-w-[372px] rounded-lg bg-surface shadow-lg"
        >
          <div className="p-5 pt-6">
            <div className="mb-4 flex h-[42px] w-[42px] items-center justify-center rounded-full bg-destructive-soft text-destructive">
              <svg className="h-[19px] w-[19px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
              </svg>
            </div>
            <h3 id="delete-dialog-title" className="mb-2 text-[15.5px] font-bold">
              Delete task?
            </h3>
            <p className="text-[13.5px] leading-relaxed text-ink-muted">
              {taskTitle ? `"${taskTitle}" will be permanently removed. ` : ""}This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-3 border-t border-line p-5">
            <button
              type="button"
              onClick={onCancel}
              className="flex h-[38px] items-center justify-center rounded-sm border border-line-strong bg-surface px-4 text-[13.5px] font-semibold hover:bg-surface-alt"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={submitting}
              className="relative flex h-[38px] items-center justify-center rounded-sm bg-destructive px-4 text-[13.5px] font-semibold text-white hover:bg-[#A32F22] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className={submitting ? "invisible" : ""}>Delete Task</span>
              {submitting && (
                <span className="absolute h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
