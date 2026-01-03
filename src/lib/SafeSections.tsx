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
  KallitechniaForm,
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
  'kallitechnia.form': KallitechniaForm,
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
      // Special logging for form blocks to help debug
      if (blockType === 'kallitechnia.form') {
        console.log(`[SafeSections] Rendering form block at index ${i}:`, {
          blockType,
          hasForm: !!(section as any).form,
          formType: typeof (section as any).form,
          formValue: typeof (section as any).form === 'object' 
            ? JSON.stringify((section as any).form, null, 2).substring(0, 200)
            : (section as any).form,
          title: (section as any).title,
          sectionKeys: Object.keys(section),
        })
      }
      
      renderedSections.push(
        <Renderer
          key={`section-${i}-${blockType}`}
          blockType={blockType}
          {...section}
          _context={{
            ...context,
            sectionIndex: i,
          }}
        />,
      )
    } catch (error) {
      console.error(`[SafeSections] Error rendering ${blockType} at index ${i}:`, error)
      if (error instanceof Error) {
        console.error(`[SafeSections] Error message: ${error.message}`)
        console.error(`[SafeSections] Error stack: ${error.stack}`)
        console.error(`[SafeSections] Section data:`, JSON.stringify(section, null, 2))
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

