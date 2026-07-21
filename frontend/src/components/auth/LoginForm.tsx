"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ListChecks } from "lucide-react";
import { ApiError, login } from "@/lib/api";
import { setSession } from "@/lib/auth";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { access_token } = await login(email.trim(), password);
      setSession(access_token, email.trim());
      router.push("/tasks");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="w-full max-w-[388px] rounded-lg border border-line bg-surface px-8 pt-8 pb-6 shadow-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-ink text-accent-soft">
            <ListChecks className="h-5 w-5" strokeWidth={2} />
          </div>
          <h1 className="text-[19px] font-bold tracking-tight">Task Management</h1>
          <p className="mt-2 text-[13px] text-ink-muted">Sign in to continue.</p>
        </div>

        <form className="flex flex-col" onSubmit={handleSubmit} noValidate>
          {error && (
            <div role="alert" className="mb-4 flex items-start gap-2 rounded-sm border border-destructive/20 bg-destructive-soft px-3 py-3 text-[12.5px] text-destructive">
              <svg className="mt-0.5 h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-[12.5px] font-semibold">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-[38px] w-full rounded-sm border border-line-strong bg-surface px-3 outline-none transition-colors hover:border-ink-faint focus:border-accent focus:ring-3 focus:ring-accent-soft"
            />
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <label htmlFor="password" className="text-[12.5px] font-semibold">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="h-[38px] w-full rounded-sm border border-line-strong bg-surface px-3 outline-none transition-colors hover:border-ink-faint focus:border-accent focus:ring-3 focus:ring-accent-soft"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="relative mt-6 flex h-[42px] w-full items-center justify-center gap-2 rounded-sm bg-accent text-[13.5px] font-semibold text-white transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className={loading ? "invisible" : ""}>Sign In</span>
            {loading && (
              <span className="absolute h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
          </button>
        </form>

        <div className="mt-6 rounded-sm border border-dashed border-line-strong bg-surface-alt p-4 text-[12px]">
          <span className="mb-2 block text-[11.5px] font-bold tracking-wide text-ink-muted uppercase">
            Demo credentials
          </span>
          <div>
            <span className="text-ink-muted">Email:</span>{" "}
            <code className="rounded border border-line bg-surface px-1.5 py-0.5 font-mono">demo@example.com</code>
          </div>
          <div className="mt-1">
            <span className="text-ink-muted">Password:</span>{" "}
            <code className="rounded border border-line bg-surface px-1.5 py-0.5 font-mono">password123</code>
          </div>
        </div>
      </div>
    </main>
  );
}
