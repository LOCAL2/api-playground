import { useState, useCallback } from 'react'
import { copyToClipboard } from '@/utils/clipboard'

/**
 * Custom hook for clipboard copy with feedback state
 * Returns copy function and a boolean indicating recent copy success
 */
export function useCopy(timeout = 2000) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async (text: string) => {
    const success = await copyToClipboard(text)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), timeout)
    }
    return success
  }, [timeout])

  return { copy, copied }
}
