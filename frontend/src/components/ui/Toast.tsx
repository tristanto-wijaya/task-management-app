export interface ToastItem {
  id: number;
  type: "success" | "error";
  message: string;
}

export function ToastStack({ toasts }: { toasts: ToastItem[] }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[70] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className="flex items-center gap-2 rounded-sm bg-ink px-4 py-3 text-[13px] font-medium text-white shadow-md"
        >
          {toast.type === "success" ? (
            <svg className="h-4 w-4 flex-shrink-0 text-[#7CD695]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : (
            <svg className="h-4 w-4 flex-shrink-0 text-[#F0958A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
