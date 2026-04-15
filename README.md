# hello-world-agent-ui

> [English version](./README.en.md)

Interface de chat para o [hello-world-agent-api](../hello-world-agent-api). Construída com Next.js 16 + Tailwind CSS v4.

As mensagens são transmitidas token por token via Server-Sent Events. Quando o agente chama uma ferramenta (clima, calculadora, curiosidades), um badge aparece inline antes da resposta. As sessões persistem entre recarregamentos via `localStorage`.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** com dark mode baseado em classe
- **Sem bibliotecas de componentes** — componentes customizados

## Funcionalidades

- Streaming de tokens em tempo real (SSE)
- Visibilidade de tool calls — badges para eventos `tool_call` e `tool_result`
- Session ID persistente — conversas sobrevivem ao recarregamento da página
- Dark mode com persistência em `localStorage` e sem flash no carregamento
- Layout seguro para mobile (fix `h-dvh` do iOS Safari + padding safe-area)

## Estrutura do Projeto

```
app/
  globals.css         # Tailwind v4 + variante dark baseada em classe
  layout.tsx          # body com h-dvh, viewport-fit=cover, script anti-flash
  page.tsx            # renderiza <ChatWindow />
components/
  ChatWindow.tsx      # estado central: mensagens, sessão, loop de streaming
  MessageBubble.tsx   # bolhas de usuário / assistente + tool badges
  ToolCallBadge.tsx   # pílula âmbar (tool_call) / verde (tool_result)
  InputBar.tsx        # textarea auto-resize, Enter para enviar, padding safe-area
  SessionControls.tsx # header: modal de histórico, botão limpar, toggle dark mode
lib/
  api.ts              # streamChat(), getHistory(), clearSession()
  types.ts            # union SseEvent, ChatMessage, HistoryResponse
```

## Como Executar

### 1. Configurar a URL da API

Crie um arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Para produção, substitua pela URL da API publicada (ex: `https://hello-world-agent-api.vercel.app`).

### 2. Iniciar a API

A interface requer o [hello-world-agent-api](../hello-world-agent-api) em execução. Consulte o README do projeto para instruções de configuração.

```bash
cd ../hello-world-agent-api
python main.py
```

### 3. Iniciar o servidor de desenvolvimento

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Deploy na Vercel

```bash
vercel --prod
```

Configure a variável de ambiente no painel da Vercel:

```
NEXT_PUBLIC_API_URL=https://hello-world-agent-api.vercel.app
```
