# hello-world-agent-ui

> [Versão em português](./README.md)

Chat interface for the [hello-world-agent-api](../hello-world-agent-api). Built with Next.js 16 + Tailwind CSS v4.

Messages stream token-by-token via Server-Sent Events. When the agent calls a tool (weather, calculator, fun facts), a badge appears inline before the answer. Sessions persist across page reloads via `localStorage`.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** with class-based dark mode
- **No component libraries** — custom components only

## Features

- Real-time token streaming (SSE)
- Tool call visibility — badges for `tool_call` and `tool_result` events
- Persistent session ID — conversations survive page reloads
- Dark mode with `localStorage` persistence and no flash on load
- Mobile-safe layout (iOS Safari `h-dvh` fix + safe-area bottom padding)

## Project Structure

```
app/
  globals.css         # Tailwind v4 + class-based dark mode variant
  layout.tsx          # h-dvh body, viewport-fit=cover, anti-flash script
  page.tsx            # renders <ChatWindow />
components/
  ChatWindow.tsx      # core state: messages, session, streaming loop
  MessageBubble.tsx   # user / assistant bubbles + tool badges
  ToolCallBadge.tsx   # amber pill (tool_call) / green pill (tool_result)
  InputBar.tsx        # auto-resize textarea, Enter to send, safe-area padding
  SessionControls.tsx # header: History modal, Clear button, dark mode toggle
lib/
  api.ts              # streamChat(), getHistory(), clearSession()
  types.ts            # SseEvent discriminated union, ChatMessage, HistoryResponse
```

## Getting Started

### 1. Set the API URL

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production, replace with the deployed API URL (e.g. `https://hello-world-agent-api.vercel.app`).

### 2. Start the API

The UI requires [hello-world-agent-api](../hello-world-agent-api) to be running. See its README for setup instructions.

```bash
cd ../hello-world-agent-api
python main.py
```

### 3. Run the dev server

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

```bash
vercel --prod
```

Set the environment variable in the Vercel dashboard:

```
NEXT_PUBLIC_API_URL=https://hello-world-agent-api.vercel.app
```
