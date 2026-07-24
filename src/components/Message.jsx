export default function Message({ sender, text }) {
  const isBot = sender === "bot";

  return (
    <div className={`flex mb-3 ${isBot ? "justify-start" : "justify-end"}`}>
      <div
        className={[
          "max-w-[80%] px-4 py-3 text-sm leading-relaxed whitespace-pre-line shadow-md",
          isBot
            ? "bg-[#FFFBF3] text-[#3C2A21] rounded-2xl rounded-bl-sm border border-[#F0E2C8] ticket-notch-left"
            : "bg-[#D88C9A] text-white rounded-2xl rounded-br-sm ticket-notch-right",
        ].join(" ")}
      >
        {text}
      </div>
    </div>
  );
}
