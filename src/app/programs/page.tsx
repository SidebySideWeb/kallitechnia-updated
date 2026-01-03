import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { PageHeaderGradient } from '@/components/PageHeaderGradient'
import SafeSections from '@/lib/SafeSections'
import { getTenant, getPageBySlug } from '@/lib/api'
import PageClient from '../PageClient'

/**
 * Programs page route
 * Fetches page data from CMS and renders sections
 * Falls back to empty state if CMS data is not available
 */
export default async function ProgramsPage() {
  let pageTitle = 'Τμήματα'
  let sections: any[] = []

  try {
    const tenant = await getTenant()
    if (tenant) {
      const page = await getPageBySlug('programs', tenant.id)
      if (page) {
        pageTitle = page.title || pageTitle
        sections = page.sections || []
      }
    }
  } catch (error) {
    console.warn('[ProgramsPage] Failed to fetch CMS data:', error)
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <PageHeaderGradient
        title={pageTitle}
        subtitle="Ανακαλύψτε τα προγράμματά μας και βρείτε το ιδανικό τμήμα για εσάς ή το παιδί σας"
      />
      <main>
        {sections.length > 0 ? (
          <PageClient>
            <SafeSections
              sections={sections}
              tenantCode="kallitechnia"
              context={{
                pageSlug: 'programs',
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
