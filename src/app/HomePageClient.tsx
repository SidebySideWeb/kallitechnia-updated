'use client'

import { useFadeIn } from '@/lib/useFadeIn'
import { ReactNode } from 'react'

/**
 * Client component wrapper for homepage animations
 * Separates client-side logic from server component
 */
export default function HomePageClient({ children }: { children: ReactNode }) {
  // Initialize fade-in animations
  useFadeIn()

  return <>{children}</>
}
