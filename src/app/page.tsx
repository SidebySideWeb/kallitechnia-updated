import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import SafeSections from '@/lib/SafeSections'
import { getHomepageData } from '@/lib/api'
import { defaultHomepageSections } from '@/lib/defaultSections'
import HomePageClient from './HomePageClient'

/**
 * Homepage route
 * Fetches homepage data from CMS and renders sections
 * Falls back to default sections if CMS data is not available
 */
export default async function HomePage() {
  let homepageData
  let sections = defaultHomepageSections

  try {
    homepageData = await getHomepageData()
    if (homepageData && homepageData.sections && homepageData.sections.length > 0) {
      sections = homepageData.sections
    }
  } catch (error) {
    // If CMS fetch fails, use default sections
    console.warn('[HomePage] Failed to fetch CMS data, using default sections:', error)
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HomePageClient>
          <SafeSections
            sections={sections}
            tenantCode="kallitechnia"
            context={{
              isHomepage: true,
            }}
          />
        </HomePageClient>
      </main>
      <Footer />
    </div>
  )
}
