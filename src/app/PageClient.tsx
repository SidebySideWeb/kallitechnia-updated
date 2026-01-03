'use client'

import { useFadeIn } from '@/lib/useFadeIn'
import { ReactNode } from 'react'

/**
 * Client component wrapper for page animations
 * Separates client-side logic from server components
 */
export default function PageClient({ children }: { children: ReactNode }) {
  // Initialize fade-in animations
  useFadeIn()

  return <>{children}</>
}
