'use client'

import { useRef } from 'react'

interface Props {
    onSend: (text: string) => void
    disabled: boolean
}

export default function InputBar({ onSend, disabled }: Props) {
    const ref = useRef<HTMLTextAreaElement>(null)

    const handleSend = () => {
        const value = ref.current?.value.trim()
        if (!value || disabled) return
        onSend(value)
        if (ref.current) {
            ref.current.value = ''
            ref.current.style.height = 'auto'
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="flex items-end gap-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 pb-[max(12px,env(safe-area-inset-bottom))]">
            <textarea
                ref={ref}
                rows={1}
                disabled={disabled}
                onKeyDown={handleKeyDown}
                placeholder="Write here..."
                className="flex-1 resize-none rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                style={{ maxHeight: '120px', overflowY: 'auto' }}
                onInput={(e) => {
                    const el = e.currentTarget
                    el.style.height = 'auto'
                    el.style.height = `${el.scrollHeight}px`
                }}
            />
            <button
                onClick={handleSend}
                disabled={disabled}
                className="shrink-0 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
                {disabled ? '…' : 'Send'}
            </button>
        </div>
    )
}
