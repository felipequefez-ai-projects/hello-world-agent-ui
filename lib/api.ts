import type { SseEvent, HistoryResponse } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export async function streamChat(
    sessionId: string,
    message: string,
    onEvent: (event: SseEvent) => void,
): Promise<void> {
    const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, message, stream: true }),
    })

    if (!res.ok) throw new Error(`API error: ${res.status}`)
    if (!res.body) throw new Error('No response body')

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''
        for (const line of lines) {
            if (line.startsWith('data: ')) {
                try {
                    const event = JSON.parse(line.slice(6)) as SseEvent
                    onEvent(event)
                } catch {
                    // ignore parse errors on partial lines
                }
            }
        }
    }
}

export async function getHistory(sessionId: string): Promise<HistoryResponse> {
    const res = await fetch(`${API_URL}/sessions/${sessionId}/history`)
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    return res.json() as Promise<HistoryResponse>
}

export async function clearSession(sessionId: string): Promise<void> {
    await fetch(`${API_URL}/sessions/${sessionId}`, { method: 'DELETE' })
}
