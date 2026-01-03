'use client'

import { useEffect } from 'react'

interface DebugInfoProps {
  data: any
  label: string
}

export function DebugInfo({ data, label }: DebugInfoProps) {
  useEffect(() => {
    console.log(`[DebugInfo] ${label}:`, data)
    console.log(`[DebugInfo] ${label} JSON:`, JSON.stringify(data, null, 2))
  }, [data, label])

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-md z-50 overflow-auto max-h-96">
      <div className="font-bold mb-2">{label}</div>
      <pre className="whitespace-pre-wrap break-words">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}
