import bakery from "../data/cakes.json";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = "gemini-2.0-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

// Turn the mock menu data into plain text the model can read.
function buildMenuText() {
  return bakery.categories
    .map((category) => {
      const items = category.items
        .map((item) => {
          const flavors = item.flavors.join(", ");
          const sizes = item.sizes
            .map((s) => `${s.size}: ${bakery.currency} ${s.price}`)
            .join(" | ");
          return `- ${item.name}\n    Flavors: ${flavors}\n    Prices: ${sizes}`;
        })
        .join("\n");
      return `${category.name}:\n${items}`;
    })
    .join("\n\n");
}

function buildSystemPrompt() {
  return `You are the friendly customer support assistant for ${bakery.bakeryName}.

Only answer questions about the bakery: cakes, flavors, sizes, prices, delivery, and opening hours.
If asked about anything unrelated, politely steer the customer back to bakery topics.

Opening Hours: ${bakery.hours}
Delivery Time: ${bakery.deliveryTime}

Menu:
${buildMenuText()}

Rules:
- Only quote prices and flavors that appear above. Never invent new items.
- Keep replies short, warm, and easy to scan (use line breaks or a short list for menu items).
- If a customer asks for something not on the menu, say so and suggest the closest match.`;
}

const SYSTEM_PROMPT = buildSystemPrompt();

/**
 * Sends a user message (plus optional prior turns) to Gemini and
 * returns the assistant's reply as plain text.
 *
 * @param {string} userMessage
 * @param {{role: "user"|"assistant", content: string}[]} history
 */
export async function sendMessage(userMessage, history = []) {
  if (!API_KEY) {
    throw new Error(
      "Missing VITE_GEMINI_API_KEY — add it to .env.local and restart the dev server.",
    );
  }

  // Gemini expects "model" instead of "assistant", and content in `parts`.
  const contents = [
    ...history.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    { role: "user", parts: [{ text: userMessage }] },
  ];

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Gemini request failed.");
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}
