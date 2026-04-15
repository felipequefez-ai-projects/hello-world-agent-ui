'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { streamChat } from '@/lib/api'
import type { ChatMessage, SseEvent } from '@/lib/types'
import InputBar from './InputBar'
import MessageBubble from './MessageBubble'
import SessionControls from './SessionControls'

function newId(): string {
    return typeof crypto !== 'undefined'
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2)
}

export default function ChatWindow() {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [sessionId, setSessionId] = useState<string>('')
    const [isStreaming, setIsStreaming] = useState(false)
    const [darkMode, setDarkMode] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)

    // Restore session ID and theme from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('agent-session-id')
        if (saved) {
            setSessionId(saved)
        } else {
            const id = newId()
            localStorage.setItem('agent-session-id', id)
            setSessionId(id)
        }

        const theme = localStorage.getItem('theme')
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
            setDarkMode(true)
        }
    }, [])

    // Auto-scroll on new content
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const toggleDark = () => {
        const next = !darkMode
        setDarkMode(next)
        document.documentElement.classList.toggle('dark', next)
        localStorage.setItem('theme', next ? 'dark' : 'light')
    }

    const handleClear = () => {
        setMessages([])
        const id = newId()
        setSessionId(id)
        localStorage.setItem('agent-session-id', id)
    }

    const handleSend = useCallback(
        async (text: string) => {
            if (isStreaming || !sessionId) return

            const userMsg: ChatMessage = {
                id: newId(),
                role: 'user',
                content: text,
                toolActions: [],
                isStreaming: false,
            }

            const assistantId = newId()
            const assistantMsg: ChatMessage = {
                id: assistantId,
                role: 'assistant',
                content: '',
                toolActions: [],
                isStreaming: true,
            }

            setMessages((prev) => [...prev, userMsg, assistantMsg])
            setIsStreaming(true)

            try {
                await streamChat(sessionId, text, (event: SseEvent) => {
                    setMessages((prev) => {
                        const idx = prev.findIndex((m) => m.id === assistantId)
                        if (idx === -1) return prev
                        const updated = { ...prev[idx] }

                        if (event.type === 'tool_call') {
                            updated.toolActions = [
                                ...updated.toolActions,
                                { type: 'tool_call', name: event.name, value: JSON.stringify(event.args) },
                            ]
                        } else if (event.type === 'tool_result') {
                            updated.toolActions = [
                                ...updated.toolActions,
                                { type: 'tool_result', name: event.name, value: event.result },
                            ]
                        } else if (event.type === 'token') {
                            updated.content += event.content
                        } else if (event.type === 'done') {
                            updated.content = event.response
                            updated.isStreaming = false
                        }

                        const next = [...prev]
                        next[idx] = updated
                        return next
                    })
                })
            } catch {
                setMessages((prev) => {
                    const idx = prev.findIndex((m) => m.id === assistantId)
                    if (idx === -1) return prev
                    const next = [...prev]
                    next[idx] = {
                        ...next[idx],
                        content: '⚠️ Error connecting to the API. Is the backend running?',
                        isStreaming: false,
                    }
                    return next
                })
            } finally {
                setIsStreaming(false)
            }
        },
        [isStreaming, sessionId],
    )

    // Avoid hydration mismatch — sessionId is only known client-side
    if (!sessionId) return null

    return (
        <div className="flex flex-col h-full">
            <SessionControls
                sessionId={sessionId}
                onClear={handleClear}
                darkMode={darkMode}
                onToggleDark={toggleDark}
            />
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-gray-50 dark:bg-gray-950">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center flex-1 gap-3 text-gray-400 dark:text-gray-600 select-none py-20">
                        <span className="text-5xl">🤖</span>
                        <p className="text-sm text-center">
                            Ask me about the weather, do some math, or request a fun fact.
                        </p>
                    </div>
                )}
                {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}
                <div ref={bottomRef} />
            </div>
            <InputBar onSend={handleSend} disabled={isStreaming} />
        </div>
    )
}
