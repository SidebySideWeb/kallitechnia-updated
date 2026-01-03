'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * DESIGN-LOCKED Navigation Component
 * 
 * This is a layout primitive - NOT a CMS block.
 * Structure, spacing, sizing are FIXED and cannot be changed by CMS.
 * CMS may only provide: logo image URL, nav items (href + label)
 * 
 * Exact copy from v0.app - DO NOT MODIFY layout classes
 */
interface NavItem {
  href?: string
  label?: string
}

interface NavigationProps {
  logo?: string | null
  logoAlt?: string
  items?: NavItem[]
}

export function Navigation({ logo, logoAlt, items }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Safe defaults - CMS can override but structure is locked
  const safeLogo = logo || 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo%20KGK%20%CF%85%CF%88%CE%B7%CE%BB%CE%AE%CF%82%20%CE%B1%CE%BD%CE%AC%CE%BB%CF%85%CF%83%CE%B7%CF%82-YP2dWdAD9HKxgCBQOBLccXnxTydRcQ.png'
  const safeLogoAlt = logoAlt || 'Kallitechnia Gymnastics Kefalonia'
  const safeItems = Array.isArray(items) && items.length > 0 ? items : [
    { href: '/', label: 'Αρχική' },
    { href: '/about', label: 'Ο Σύλλογος' },
    { href: '/news', label: 'Νέα' },
    { href: '/programs', label: 'Πρόγραμμα' },
    { href: '/registration', label: 'Εγγραφές' },
    { href: '/contact', label: 'Επικοινωνία' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-[#F5F5F5]/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={safeLogo}
              alt={safeLogoAlt}
              width={180}
              height={60}
              priority
              sizes="180px"
              className="h-16 w-auto"
            />
          </Link>

          {/* Desktop Navigation - EXACT v0.app structure */}
          <div className="hidden md:flex items-center gap-8">
            {safeItems.map((item) => {
              const safeHref = item.href || '#'
              const safeLabel = item.label || ''
              const sanitizedHref =
                safeHref && (safeHref.startsWith('http') || safeHref.startsWith('/'))
                  ? safeHref
                  : '#'

              return (
                <Link
                  key={safeHref}
                  href={sanitizedHref}
                  className="text-foreground hover:text-primary font-medium transition-colors text-lg"
                >
                  {safeLabel}
                </Link>
              )
            })}
          </div>

          {/* Mobile Menu Button - EXACT v0.app structure */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation - EXACT v0.app structure */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {safeItems.map((item) => {
                const safeHref = item.href || '#'
                const safeLabel = item.label || ''
                const sanitizedHref =
                  safeHref && (safeHref.startsWith('http') || safeHref.startsWith('/'))
                    ? safeHref
                    : '#'

                return (
                  <Link
                    key={safeHref}
                    href={sanitizedHref}
                    className="text-foreground hover:text-primary font-medium transition-colors text-lg py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {safeLabel}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
