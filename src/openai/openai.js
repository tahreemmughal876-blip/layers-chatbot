import OpenAI from "openai";
import bakery from "../data/cakes.json";

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

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
 * Sends a user message (plus optional prior turns) to the model and
 * returns the assistant's reply as plain text.
 *
 * @param {string} userMessage
 * @param {{role: "user"|"assistant", content: string}[]} history
 */
export async function sendMessage(userMessage, history = []) {
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: [
      { role: "system", content: SYSTEM_PROMPT },
      ...history,
      { role: "user", content: userMessage },
    ],
  });

  return response.output_text;
}
