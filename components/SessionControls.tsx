'use client'

import { useState } from 'react'
import { getHistory, clearSession } from '@/lib/api'
import type { HistoryItem } from '@/lib/types'

interface Props {
    sessionId: string
    onClear: () => void
    darkMode: boolean
    onToggleDark: () => void
}

export default function SessionControls({ sessionId, onClear, darkMode, onToggleDark }: Props) {
    const [history, setHistory] = useState<HistoryItem[] | null>(null)
    const [open, setOpen] = useState(false)

    const handleHistory = async () => {
        try {
            const data = await getHistory(sessionId)
            setHistory(data.messages)
            setOpen(true)
        } catch (e) {
            console.error(e)
        }
    }

    const handleClear = async () => {
        await clearSession(sessionId)
        onClear()
    }

    return (
        <>
            <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Agent Chat</span>
                    <span className="text-xs text-gray-400 font-mono">
                        {sessionId.slice(0, 8)}…
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleHistory}
                        className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        History
                    </button>
                    <button
                        onClick={handleClear}
                        className="text-xs px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                        Clear
                    </button>
                    <button
                        onClick={onToggleDark}
                        className="text-lg w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Toggle dark mode"
                    >
                        {darkMode ? '☀️' : '🌙'}
                    </button>
                </div>
            </header>

            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md max-h-[70vh] flex flex-col overflow-hidden mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                Session History
                            </span>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg leading-none"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="overflow-y-auto flex-1 px-4 py-3 flex flex-col gap-3">
                            {history?.length === 0 && (
                                <p className="text-sm text-gray-400 text-center py-4">No messages yet</p>
                            )}
                            {history?.map((msg, i) => (
                                <div key={i} className="text-xs">
                                    <span className="font-semibold text-indigo-500 uppercase tracking-wide">
                                        {msg.role}
                                    </span>
                                    <p className="mt-0.5 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                        {msg.content ?? '(tool call)'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
