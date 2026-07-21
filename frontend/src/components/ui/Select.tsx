import { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  className?: string;
};

export function Select({ className = "", children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`h-[38px] w-full appearance-none rounded-sm border border-line-strong bg-surface px-3 pr-8 outline-none transition-colors hover:border-ink-faint focus:border-accent focus:ring-3 focus:ring-accent-soft ${className}`}
      >
        {children}
      </select>
      <svg
        className="pointer-events-none absolute top-1/2 right-3 h-[10px] w-[10px] -translate-y-1/2 text-ink-muted"
        viewBox="0 0 10 6"
        fill="none"
      >
        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
