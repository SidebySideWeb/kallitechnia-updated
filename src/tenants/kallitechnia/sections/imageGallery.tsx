'use client'

import Image from 'next/image'
import { extractText, type LexicalDocument, type LexicalNode } from '@/lib/lexical'
import { extractImageUrl } from '@/lib/imageUtils'

/**
 * DESIGN-LOCKED Image Gallery Section
 * 
 * EXACT copy from v0.app - DO NOT MODIFY layout classes
 * CMS provides: title, subtitle, images array
 * Frontend controls: ALL spacing, sizing, layout, typography
 */
interface GalleryItem {
  image?: string | null
  imageAlt?: string
  title?: string
  description?: string | LexicalDocument | LexicalNode[]
}

interface ImageGalleryProps {
  title?: string
  subtitle?: string
  images?: GalleryItem[]
}

export function KallitechniaImageGallery({ title, subtitle, images }: ImageGalleryProps) {
  // Safe content extraction - layout is locked
  const safeTitle = title || ''
  const safeSubtitle = subtitle || ''
  const safeImages = Array.isArray(images) ? images : []

  if (safeImages.length === 0) {
    return null
  }

  // EXACT v0.app structure - DO NOT MODIFY
  return (
    <section className="py-20 bg-white fade-in-section opacity-0">
      <div className="container mx-auto px-4">
        {safeTitle && (
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-balance">{safeTitle}</h2>
        )}
        {safeSubtitle && (
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {safeSubtitle}
          </p>
        )}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {safeImages.map((item, index) => {
            const safeImage = item.image || null
            const safeImageAlt = item.imageAlt || item.title || `Gallery image ${index + 1}`
            const safeTitle = item.title || ''
            // Extract text from Lexical format if needed
            const safeDescription = extractText(item.description)

            // Extract and normalize image URL to absolute URL for Next.js Image component
            const normalizedImage = extractImageUrl(safeImage)
            
            return (
              <div key={index} className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer">
                {normalizedImage ? (
                  <Image
                    src={normalizedImage}
                    alt={safeImageAlt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
                )}
                {(safeTitle || safeDescription) && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute bottom-6 left-6 text-white">
                      {safeTitle && <h3 className="text-2xl font-bold mb-2">{safeTitle}</h3>}
                      {safeDescription && <p className="text-sm">{safeDescription}</p>}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
