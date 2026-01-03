'use client'

import { useEffect, useRef } from 'react'

/**
 * Fade-in animation hook
 * 
 * EXACT copy from v0.app - matches IntersectionObserver behavior
 * Observes elements with .fade-in-section class and adds .animate-in
 */
export function useFadeIn() {
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
            observerRef.current?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '50px' },
    )

    // Defer DOM query to avoid forced reflow during initial render
    requestAnimationFrame(() => {
      const elements = document.querySelectorAll('.fade-in-section')
      elements.forEach((el) => observerRef.current?.observe(el))
    })

    return () => observerRef.current?.disconnect()
  }, [])
}

