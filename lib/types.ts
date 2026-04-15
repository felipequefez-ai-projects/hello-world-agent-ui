export type ToolCallEvent = {
    type: 'tool_call'
    name: string
    args: Record<string, unknown>
}

export type ToolResultEvent = {
    type: 'tool_result'
    name: string
    result: string
}

export type TokenEvent = {
    type: 'token'
    content: string
}

export type DoneEvent = {
    type: 'done'
    response: string
    tools_called: string[]
    elapsed: number
    prompt_tokens: number
    completion_tokens: number
}

export type SseEvent = ToolCallEvent | ToolResultEvent | TokenEvent | DoneEvent

export type ToolAction = {
    type: 'tool_call' | 'tool_result'
    name: string
    value: string
}

export type ChatMessage = {
    id: string
    role: 'user' | 'assistant'
    content: string
    toolActions: ToolAction[]
    isStreaming: boolean
}

export type HistoryItem = {
    role: string
    content: string | null
}

export type HistoryResponse = {
    session_id: string
    messages: HistoryItem[]
}
