# 🚀 How to Run This Project (Beginner Guide)

This guide assumes you've never run a React/Vite project before. Follow it top to bottom.

---

## 1. Install Node.js

You need Node.js installed on your computer first — it's what runs the project.

1. Go to **https://nodejs.org**
2. Download the **LTS** version (the big recommended button)
3. Install it like any normal program (keep clicking Next)
4. Check it worked — open a terminal (Command Prompt / PowerShell / Terminal) and run:

```bash
node -v
npm -v
```

If both print a version number, you're good.

---

## 2. Open the project folder in a terminal

- Unzip the project folder somewhere, e.g. `Downloads/bakery-chatbot`
- Open your terminal
- Navigate into the folder:

```bash
cd Downloads/bakery-chatbot
```

(Change the path to wherever you actually put it.)

---

## 3. Install the project's dependencies

This downloads React, Vite, Tailwind, and everything else the code needs.

```bash
npm install
```

This can take a minute. It creates a `node_modules` folder — don't touch it, don't delete it, don't upload it anywhere.

---

## 4. Add your API keys

1. Find the file called **`.env.sample`** in the project folder
2. Make a **copy** of it and rename the copy to **`.env.local`**
3. Open `.env.local` in any text editor and replace the placeholders with your real keys:

```
VITE_OPENAI_API_KEY=sk-your-real-openai-key
VITE_GEMINI_API_KEY=AQ.your-real-gemini-key
```

- Get an OpenAI key from **platform.openai.com/api-keys**
- Get a Gemini key from **aistudio.google.com/apikey**

You only strictly need one of the two working — the app lets you switch between them, but only the one with a valid key will actually reply.

⚠️ Never share `.env.local` or paste its contents anywhere public — it holds real secret keys.

---

## 5. Run the project

```bash
npm run dev
```

Your terminal will print something like:

```
  ➜  Local:   http://localhost:5173/
```

Hold `Ctrl` and click that link (or copy it into your browser). The chatbot should load.

---

## 6. Using the chatbot

- Type a question in the input box, or tap one of the quick-question chips
- Use the **Gemini / OpenAI** switch just above the input box to choose which AI answers
- To stop the app, go back to the terminal and press `Ctrl + C`

---

## Troubleshooting

**Nothing loads / blank page**
Check the terminal for red error text — it usually tells you exactly what's wrong (missing file, typo, etc).

**"Missing VITE_GEMINI_API_KEY" or similar error in the chat**
Your `.env.local` doesn't have that key set, or you forgot to restart the server after adding it. Env files are only read when the server _starts_, so:

```bash
# stop it (Ctrl + C), then:
npm run dev
```

**A UI change (like a new button) isn't showing up**

1. Stop the server (`Ctrl + C`)
2. Run `npm run dev` again
3. Hard-refresh the browser tab: `Ctrl + Shift + R`

**"rate limit" or "quota" error**
That's the AI provider (OpenAI/Gemini) telling you you've sent too many requests for your free plan. Wait a bit, or switch to the other provider using the toggle.

**`npm install` fails or `npm run dev` says "command not found"**
Make sure you're actually inside the project folder in your terminal (step 2), and that Node.js installed correctly (step 1).
