import type { ToolAction } from '@/lib/types'

interface Props {
    action: ToolAction
}

const toolIcons: Record<string, string> = {
    get_weather: '🌤',
    calculate: '🧮',
    get_fun_fact: '💡',
}

export default function ToolCallBadge({ action }: Props) {
    const icon = toolIcons[action.name] ?? '🔧'

    if (action.type === 'tool_call') {
        return (
            <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                {icon} calling {action.name}
            </span>
        )
    }

    return (
        <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
            {icon} {action.name} → {action.value}
        </span>
    )
}
