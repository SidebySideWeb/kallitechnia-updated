import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { PageHeaderGradient } from '@/components/PageHeaderGradient'
import { getTenant, getPageBySlug } from '@/lib/api'
import SafeSections from '@/lib/SafeSections'
import PageClient from '../PageClient'

/**
 * Registration page
 * Can fetch from CMS or use static content
 */
export default async function RegistrationPage() {
  let sections: any[] = []

  try {
    const tenant = await getTenant()
    if (tenant) {
      const page = await getPageBySlug('registration', tenant.id)
      if (page) {
        sections = page.sections || []
        // Debug: Log sections for troubleshooting
        if (process.env.NODE_ENV === 'development') {
          console.log('[RegistrationPage] Fetched page:', page.slug)
          console.log('[RegistrationPage] Sections count:', sections.length)
          console.log('[RegistrationPage] Section types:', sections.map(s => s.blockType || s.block_type || s.type))
          const formSections = sections.filter(s => 
            (s.blockType || s.block_type || s.type) === 'kallitechnia.form'
          )
          console.log('[RegistrationPage] Form blocks found:', formSections.length)
          if (formSections.length > 0) {
            console.log('[RegistrationPage] Form block data:', JSON.stringify(formSections[0], null, 2))
          }
        }
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[RegistrationPage] Page not found in CMS for slug: registration')
        }
      }
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[RegistrationPage] Tenant not found')
      }
    }
  } catch (error) {
    console.warn('[RegistrationPage] Failed to fetch CMS data:', error)
  }
  return (
    <div className="min-h-screen">
      <Navigation />
      <PageHeaderGradient
        title="Εγγραφές"
        subtitle="Γίνε μέλος της οικογένειας της Καλλιτεχνίας!"
      />

      {/* CMS Sections - All content comes from CMS */}
      <main>
        <PageClient>
          {sections.length > 0 ? (
            <SafeSections
              sections={sections}
              tenantCode="kallitechnia"
              context={{
                pageSlug: 'registration',
                isHomepage: false,
              }}
            />
          ) : (
            <section className="py-16 bg-muted/30">
              <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center">
                  <p className="text-lg text-muted-foreground">
                    Η φόρμα εγγραφής θα εμφανιστεί εδώ όταν ρυθμιστεί στο CMS.
                  </p>
                  {process.env.NODE_ENV === 'development' && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Debug: No sections found. Check CMS for registration page.
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}
        </PageClient>
      </main>

      <Footer />
    </div>
  )
}

