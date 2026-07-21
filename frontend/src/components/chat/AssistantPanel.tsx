"use client";

import { FormEvent, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { ApiError, askAssistant } from "@/lib/api";

interface ChatMessage {
  id: number;
  role: "user" | "assistant" | "error";
  text: string;
}

const SUGGESTED_QUESTIONS = [
  "Show unfinished tasks",
  "How many completed tasks?",
  "What tasks are due today?",
  "Who is assigned to [task title]?",
];

let messageId = 0;

export function AssistantPanel() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { id: ++messageId, role: "user", text: trimmed }]);
    setInput("");
    setLoading(true);
    try {
      const { answer } = await askAssistant(trimmed);
      setMessages((prev) => [...prev, { id: ++messageId, role: "assistant", text: answer }]);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      setMessages((prev) => [...prev, { id: ++messageId, role: "error", text: message }]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    sendMessage(input);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="fixed right-6 bottom-6 z-[45] flex h-11 items-center gap-2 rounded-full bg-ink pr-5 pl-4 text-[12.5px] font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5"
      >
        <MessageCircle className="h-[17px] w-[17px] text-[#8CA2FF]" strokeWidth={2} />
        Task Assistant
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="assistant-title"
          className="fixed right-6 bottom-24 z-[55] flex max-h-[540px] w-[352px] max-w-[calc(100vw-32px)] flex-col rounded-lg border border-line bg-surface shadow-lg"
        >
          <div className="flex items-start justify-between border-b border-line px-5 py-4">
            <div>
              <h2 id="assistant-title" className="flex items-center gap-1.5 text-[14px] font-bold">
                <MessageCircle className="h-[15px] w-[15px] text-accent" strokeWidth={2} />
                Task Assistant
              </h2>
              <p className="mt-0.5 text-[12px] text-ink-muted">Ask questions about your tasks.</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close Task Assistant"
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-sm text-ink-muted hover:bg-surface-alt hover:text-ink"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
            {messages.length === 0 && (
              <div className="flex flex-col gap-2">
                {SUGGESTED_QUESTIONS.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => sendMessage(question)}
                    className="rounded-sm border border-line-strong bg-surface px-3 py-2 text-left text-[12.5px] transition-colors hover:border-accent hover:bg-accent-soft"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex max-w-[90%] gap-2 ${msg.role === "user" ? "flex-row-reverse self-end" : ""}`}
              >
                <div
                  className={`rounded-md px-3 py-2 text-[12.5px] leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-br-[4px] bg-accent text-white"
                      : msg.role === "error"
                        ? "rounded-bl-[4px] bg-destructive-soft text-destructive"
                        : "rounded-bl-[4px] bg-surface-alt text-ink"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex max-w-[90%] gap-2">
                <div className="flex items-center gap-1 rounded-md rounded-bl-[4px] bg-surface-alt px-3 py-2.5">
                  <span className="h-[5px] w-[5px] animate-bounce rounded-full bg-ink-faint [animation-delay:-0.3s]" />
                  <span className="h-[5px] w-[5px] animate-bounce rounded-full bg-ink-faint [animation-delay:-0.15s]" />
                  <span className="h-[5px] w-[5px] animate-bounce rounded-full bg-ink-faint" />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-line p-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your tasks..."
              className="h-[38px] flex-1 rounded-sm border border-line-strong bg-surface px-3 outline-none focus:border-accent focus:ring-3 focus:ring-accent-soft"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-sm bg-accent text-white transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-4 w-4" strokeWidth={2} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
