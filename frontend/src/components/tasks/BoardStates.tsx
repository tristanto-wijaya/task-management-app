export function LoadingBoard() {
  const columns = [2, 1, 1];
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {columns.map((cardCount, columnIndex) => (
        <div key={columnIndex} className="flex flex-col rounded-md border border-line bg-surface-alt">
          <div className="px-3 pt-3 pb-2">
            <div className="h-[13px] w-[70px] animate-shimmer rounded bg-surface-alt bg-[linear-gradient(90deg,var(--color-surface-alt)_25%,#E4E6EC_37%,var(--color-surface-alt)_63%)]" />
          </div>
          <div className="flex flex-col gap-3 px-3 pb-3">
            {Array.from({ length: cardCount }).map((_, cardIndex) => (
              <div key={cardIndex} className="rounded-md border border-line bg-surface p-4">
                <div className="h-[10px] w-4/5 animate-shimmer rounded bg-[linear-gradient(90deg,var(--color-surface-alt)_25%,#E4E6EC_37%,var(--color-surface-alt)_63%)]" />
                <div className="mt-2 h-[10px] w-3/5 animate-shimmer rounded bg-[linear-gradient(90deg,var(--color-surface-alt)_25%,#E4E6EC_37%,var(--color-surface-alt)_63%)]" />
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-[22px] w-[22px] flex-shrink-0 animate-shimmer rounded-full bg-[linear-gradient(90deg,var(--color-surface-alt)_25%,#E4E6EC_37%,var(--color-surface-alt)_63%)]" />
                  <div className="h-[10px] w-[60px] animate-shimmer rounded bg-[linear-gradient(90deg,var(--color-surface-alt)_25%,#E4E6EC_37%,var(--color-surface-alt)_63%)]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function StateShell({
  icon,
  iconTone = "muted",
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  iconTone?: "muted" | "destructive";
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-md border border-line bg-surface px-6 py-16 text-center">
      <div
        className={`mb-4 flex h-[50px] w-[50px] items-center justify-center rounded-full ${
          iconTone === "destructive" ? "bg-destructive-soft text-destructive" : "bg-surface-alt text-ink-faint"
        }`}
      >
        {icon}
      </div>
      <h3 className="mb-2 text-[15px] font-bold">{title}</h3>
      <p className="mb-5 max-w-[320px] text-[13px] text-ink-muted">{description}</p>
      {action}
    </div>
  );
}

export function EmptyBoardState({ onAddTask }: { onAddTask: () => void }) {
  return (
    <StateShell
      icon={
        <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M20 8v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8" />
          <path d="M2 8h20l-2-5H4l-2 5z" />
          <path d="M9 12h6" />
        </svg>
      }
      title="No tasks yet"
      description="Create the first task to start organizing the team's work."
      action={
        <button
          type="button"
          onClick={onAddTask}
          className="flex h-[38px] items-center justify-center rounded-sm bg-accent px-4 text-[13.5px] font-semibold text-white hover:bg-accent-strong"
        >
          Add Task
        </button>
      }
    />
  );
}

export function NoResultsState() {
  return (
    <StateShell
      icon={
        <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      }
      title="No matching tasks found"
      description="Try another title or update your filters."
    />
  );
}

export function ErrorBoardState({ onRetry }: { onRetry: () => void }) {
  return (
    <StateShell
      icon={
        <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      }
      iconTone="destructive"
      title="Unable to load tasks."
      description="Something went wrong while retrieving the task list."
      action={
        <button
          type="button"
          onClick={onRetry}
          className="flex h-[38px] items-center justify-center rounded-sm border border-line-strong bg-surface px-4 text-[13.5px] font-semibold hover:bg-surface-alt"
        >
          Retry
        </button>
      }
    />
  );
}
