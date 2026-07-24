import { useState } from "react";

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  return (
    <form
      onSubmit={submit}
      className="flex items-center gap-2 p-3 bg-[#FFFBF3] border-t border-[#F0E2C8]"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ask about our cakes, flavors, prices…"
        disabled={disabled}
        className="flex-1 rounded-full px-4 py-2 text-sm bg-white border border-[#E8D9BE] text-[#3C2A21] placeholder-[#B8A891] focus:outline-none focus:ring-2 focus:ring-[#F5C563] disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="rounded-full bg-[#3C2A21] text-[#F5C563] w-10 h-10 flex items-center justify-center shrink-0 hover:bg-[#2B1D16] disabled:opacity-40 disabled:hover:bg-[#3C2A21] transition-colors"
        aria-label="Send message"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4 rotate-90"
        >
          <path d="M2.94 2.94a1.5 1.5 0 0 1 1.62-.33l17.5 7a1.5 1.5 0 0 1 0 2.78l-17.5 7a1.5 1.5 0 0 1-2.06-1.78L4.5 12 2.5 4.72a1.5 1.5 0 0 1 .44-1.78Z" />
        </svg>
      </button>
    </form>
  );
}
