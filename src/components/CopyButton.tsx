import { Check, Copy } from 'lucide-react'
import { useCopy } from '@/hooks/useCopy'
import { cn } from '@/utils/cn'

interface CopyButtonProps {
  text: string
  label?: string
  className?: string
  size?: 'sm' | 'md'
}

/**
 * Button component that copies text to clipboard and shows a checkmark on success
 */
export function CopyButton({ text, label, className, size = 'sm' }: CopyButtonProps) {
  const { copy, copied } = useCopy()

  return (
    <button
      onClick={() => copy(text)}
      className={cn(
        'inline-flex cursor-pointer items-center gap-1.5 rounded-md border font-medium transition-all select-none',
        copied
          ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
          : 'border-zinc-300 bg-white text-zinc-600 hover:border-zinc-400 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-700 dark:hover:text-zinc-100',
        size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        className
      )}
      title={copied ? 'Copied!' : `Copy ${label ?? ''}`}
      aria-label={copied ? 'Copied to clipboard' : `Copy ${label ?? 'to clipboard'}`}
    >
      {copied ? (
        <Check className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      ) : (
        <Copy className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      )}
      <span>{copied ? 'Copied!' : (label ?? 'Copy')}</span>
    </button>
  )
}
