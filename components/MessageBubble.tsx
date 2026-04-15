import type { ChatMessage } from '@/lib/types'
import ToolCallBadge from './ToolCallBadge'

interface Props {
    message: ChatMessage
}

export default function MessageBubble({ message }: Props) {
    const isUser = message.role === 'user'

    return (
        <div className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
            {message.toolActions.length > 0 && (
                <div className="flex flex-wrap gap-1 px-1">
                    {message.toolActions.map((action, i) => (
                        <ToolCallBadge key={i} action={action} />
                    ))}
                </div>
            )}
            <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${isUser
                        ? 'bg-indigo-600 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-bl-sm'
                    }`}
            >
                {message.content}
                {message.isStreaming && (
                    <span className="inline-block w-1.5 h-4 ml-0.5 bg-current animate-pulse rounded-sm align-middle" />
                )}
            </div>
        </div>
    )
}
