import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { PageHeaderGradient } from '@/components/PageHeaderGradient'
import SafeSections from '@/lib/SafeSections'
import { getTenant, getPageBySlug } from '@/lib/api'
import PageClient from '../PageClient'

/**
 * About page route
 * Fetches page data from CMS and renders sections
 * Falls back to empty state if CMS data is not available
 */
export default async function AboutPage() {
  let pageTitle = 'Ο Σύλλογος'
  let sections: any[] = []

  try {
    const tenant = await getTenant()
    if (!tenant) {
      console.error('[AboutPage] Tenant not found. CMS URL:', process.env.NEXT_PUBLIC_CMS_URL || 'https://cms.ftiaxesite.gr')
    } else {
      const page = await getPageBySlug('about', tenant.id)
      if (!page) {
        console.warn('[AboutPage] Page "about" not found for tenant:', tenant.id)
      } else {
        pageTitle = page.title || pageTitle
        sections = page.sections || []
      }
    }
  } catch (error) {
    console.error('[AboutPage] Failed to fetch CMS data:', error)
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <PageHeaderGradient title={pageTitle} />
      <main>
        {sections.length > 0 ? (
          <PageClient>
            <SafeSections
              sections={sections}
              tenantCode="kallitechnia"
              context={{
                pageSlug: 'about',
                isHomepage: false,
              }}
            />
          </PageClient>
        ) : (
          <div className="container mx-auto px-4 py-20 text-center">
            <p className="text-muted-foreground">Το περιεχόμενο αυτής της σελίδας προετοιμάζεται.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
