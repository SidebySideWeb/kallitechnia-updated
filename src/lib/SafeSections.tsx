/**
 * Safe Sections Renderer
 * 
 * Server component that safely renders CMS blocks with tenant isolation
 * For now, renders static sections - will be connected to CMS later
 */

import {
  KallitechniaHero,
  KallitechniaWelcome,
  KallitechniaProgramsGrid,
  KallitechniaImageGallery,
  KallitechniaNewsGrid,
  KallitechniaSponsors,
  KallitechniaCtaBanner,
  KallitechniaRichText,
  KallitechniaQuote,
  KallitechniaSlogan,
  KallitechniaImageText,
  KallitechniaProgramDetail,
} from '@/tenants/kallitechnia/sections'

interface SafeSectionsProps {
  sections: any[] | null | undefined
  tenantCode: string
  context?: {
    pageSlug?: string
    isHomepage?: boolean
  }
}

// Registry of block types to components
const BLOCK_REGISTRY: Record<string, React.ComponentType<any>> = {
  'kallitechnia.hero': KallitechniaHero,
  'kallitechnia.welcome': KallitechniaWelcome,
  'kallitechnia.programsGrid': KallitechniaProgramsGrid,
  'kallitechnia.imageGallery': KallitechniaImageGallery,
  'kallitechnia.newsGrid': KallitechniaNewsGrid,
  'kallitechnia.sponsors': KallitechniaSponsors,
  'kallitechnia.cta': KallitechniaCtaBanner, // CMS uses 'cta', frontend component is CtaBanner
  'kallitechnia.ctaBanner': KallitechniaCtaBanner, // Keep for backward compatibility
  'kallitechnia.richText': KallitechniaRichText,
  'kallitechnia.quote': KallitechniaQuote,
  'kallitechnia.slogan': KallitechniaSlogan,
  'kallitechnia.imageText': KallitechniaImageText,
  'kallitechnia.programDetail': KallitechniaProgramDetail,
}

// Track logged warnings per request (dev only)
const loggedWarnings = new Set<string>()

function logWarningOnce(message: string, key: string) {
  if (process.env.NODE_ENV === 'development' && !loggedWarnings.has(key)) {
    console.warn(`[SafeSections] ${message}`)
    loggedWarnings.add(key)
  }
}

export default function SafeSections({
  sections,
  tenantCode,
  context,
}: SafeSectionsProps) {
  // Handle empty/null sections
  if (!sections || !Array.isArray(sections) || sections.length === 0) {
    return null
  }

  const renderedSections: React.ReactNode[] = []

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]

    // Skip invalid sections
    if (!section || typeof section !== 'object') {
      logWarningOnce(
        `Skipping invalid section at index ${i}`,
        `invalid-section-${i}`,
      )
      continue
    }

    // Safely extract blockType
    const blockType = section.blockType || section.block_type || section.type

    if (!blockType || typeof blockType !== 'string') {
      logWarningOnce(
        `Skipping section at index ${i} - missing blockType`,
        `missing-blocktype-${i}`,
      )
      continue
    }

    // Verify tenant prefix matches
    const expectedPrefix = `${tenantCode}.`
    if (!blockType.startsWith(expectedPrefix)) {
      logWarningOnce(
        `Block type "${blockType}" does not match tenant "${tenantCode}" - skipping`,
        `tenant-mismatch-${blockType}`,
      )
      continue
    }

    // Get renderer
    const Renderer = BLOCK_REGISTRY[blockType]

    if (!Renderer) {
      logWarningOnce(
        `No renderer found for block type: ${blockType} - skipping`,
        `no-renderer-${blockType}`,
      )
      continue
    }

    // Render with safe props
    try {
      renderedSections.push(
        <Renderer
          key={`section-${i}-${blockType}`}
          blockType={blockType}
          {...section}
          _context={context}
        />,
      )
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`[SafeSections] Error rendering ${blockType}:`, error)
      }
      // Continue rendering other sections
      continue
    }
  }

  if (renderedSections.length === 0) {
    return null
  }

  return <>{renderedSections}</>
}

