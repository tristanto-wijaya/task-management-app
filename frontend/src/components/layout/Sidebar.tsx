"use client";

import { ListChecks } from "lucide-react";
import type { User } from "@/types";
import { initials } from "@/lib/date";

type View = "all" | "mine";

interface SidebarProps {
  view: View;
  onChangeView: (view: View) => void;
  currentUser: User | null;
  onLogout: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

function NavIcon({ name }: { name: "grid" | "user" }) {
  const common = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2 } as const;
  if (name === "grid") {
    return (
      <svg {...common} className="h-[17px] w-[17px] flex-shrink-0">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    );
  }
  return (
    <svg {...common} className="h-[17px] w-[17px] flex-shrink-0">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
    </svg>
  );
}

export function Sidebar({ view, onChangeView, currentUser, onLogout, mobileOpen, onCloseMobile }: SidebarProps) {
  const navItemClass = (active: boolean) =>
    `flex w-full items-center gap-3 rounded-sm px-3 py-2 text-[13.5px] font-medium transition-colors ${
      active ? "bg-accent-soft font-semibold text-accent-strong" : "text-ink-muted hover:bg-surface-alt hover:text-ink"
    }`;

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 md:hidden" onClick={onCloseMobile} aria-hidden="true" />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-[65] flex h-screen w-[248px] flex-col border-r border-line bg-surface transition-transform duration-200 md:sticky md:top-0 md:w-[76px] md:translate-x-0 lg:w-[236px] ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 px-5 pt-5 pb-4 md:justify-center lg:justify-start">
          <div className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-md bg-ink text-accent-soft">
            <ListChecks className="h-4 w-4" strokeWidth={2} />
          </div>
          <span className="text-[14.5px] font-bold tracking-tight md:hidden lg:inline">Task Management</span>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close menu"
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-sm text-ink-muted hover:bg-surface-alt hover:text-ink md:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 px-3 py-2" aria-label="Primary">
          <button
            type="button"
            className={`${navItemClass(view === "all")} md:justify-center lg:justify-start`}
            onClick={() => {
              onChangeView("all");
              onCloseMobile();
            }}
          >
            <NavIcon name="grid" />
            <span className="md:hidden lg:inline">All Tasks</span>
          </button>
          <button
            type="button"
            className={`${navItemClass(view === "mine")} md:justify-center lg:justify-start`}
            onClick={() => {
              onChangeView("mine");
              onCloseMobile();
            }}
          >
            <NavIcon name="user" />
            <span className="md:hidden lg:inline">My Tasks</span>
          </button>
        </nav>

        <div className="border-t border-line px-4 py-4">
          <div className="mb-3 flex items-center gap-3 md:justify-center lg:justify-start">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent-soft text-[12px] font-bold text-accent-strong">
              {currentUser ? initials(currentUser.name) : "--"}
            </div>
            <div className="min-w-0 md:hidden lg:block">
              <div className="truncate text-[13px] font-semibold">{currentUser?.name ?? "Loading…"}</div>
              <div className="truncate text-[11.5px] text-ink-faint">{currentUser?.email ?? ""}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-[13px] font-medium text-ink-muted hover:bg-surface-alt hover:text-destructive md:justify-center lg:justify-start"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 flex-shrink-0">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="md:hidden lg:inline">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
