/**
 * CMS API Client
 * Handles all requests to the Payload CMS API
 */

const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_URL || 'https://cms.ftiaxesite.gr'
const TENANT_CODE = 'kallitechnia'

interface CMSResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

interface Tenant {
  id: string
  code: string
  name: string
}

interface Homepage {
  id: string
  sections: any[]
  tenant: string | Tenant
  status: 'draft' | 'published'
}

interface Page {
  id: string
  title: string
  slug: string
  sections: any[]
  tenant: string | Tenant
  status: 'draft' | 'published'
}

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  content?: any
  publishedAt?: string
  featuredImage?: any
  tenant: string | Tenant
  status: 'draft' | 'published'
}

/**
 * Fetch tenant by code
 */
export async function getTenant(code: string = TENANT_CODE): Promise<Tenant | null> {
  const apiUrl = `${CMS_API_URL}/api/tenants?where[code][equals]=${code}&limit=1&depth=0`
  
  try {
    console.log(`[API] Fetching tenant from: ${apiUrl}`)
    console.log(`[API] CMS_API_URL: ${CMS_API_URL}`)
    
    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    console.log(`[API] Tenant response status: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unable to read error response')
      console.error(`[API] Failed to fetch tenant (${response.status}): ${response.statusText}`)
      console.error(`[API] Error response: ${errorText}`)
      return null
    }

    const data: CMSResponse<Tenant> = await response.json()
    console.log(`[API] Tenant data received:`, data.docs.length > 0 ? 'Found tenant' : 'No tenant found')
    return data.docs[0] || null
  } catch (error) {
    console.error('[API] Error fetching tenant:', error)
    if (error instanceof Error) {
      console.error('[API] Error message:', error.message)
      console.error('[API] Error stack:', error.stack)
    }
    return null
  }
}

/**
 * Fetch homepage for a tenant
 */
export async function getHomepage(tenantId: string): Promise<Homepage | null> {
  try {
    const response = await fetch(
      `${CMS_API_URL}/api/homepages?where[and][0][tenant][equals]=${tenantId}&where[and][1][status][equals]=published&limit=1&depth=2`,
      {
        next: { revalidate: 60 }, // Revalidate every minute
      }
    )

    if (!response.ok) {
      // Don't throw error, just return null to allow fallback
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[API] Failed to fetch homepage (${response.status}): ${response.statusText}`)
      }
      return null
    }

    const data: CMSResponse<Homepage> = await response.json()
    return data.docs[0] || null
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[API] Error fetching homepage:', error)
    }
    return null
  }
}

/**
 * Fetch page by slug
 */
export async function getPageBySlug(
  slug: string,
  tenantId: string
): Promise<Page | null> {
  try {
    const response = await fetch(
      `${CMS_API_URL}/api/pages?where[and][0][slug][equals]=${slug}&where[and][1][tenant][equals]=${tenantId}&where[and][2][status][equals]=published&limit=1&depth=2`,
      {
        next: { revalidate: 60 }, // Revalidate every minute
      }
    )

    if (!response.ok) {
      // Don't throw error, just return null to allow fallback
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[API] Failed to fetch page (${response.status}): ${response.statusText}`)
      }
      return null
    }

    const data: CMSResponse<Page> = await response.json()
    return data.docs[0] || null
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[API] Error fetching page:', error)
    }
    return null
  }
}

/**
 * Fetch all posts/news for a tenant
 */
export async function getPosts(
  tenantId: string,
  limit: number = 10,
  page: number = 1
): Promise<CMSResponse<Post>> {
  try {
    const response = await fetch(
      `${CMS_API_URL}/api/posts?where[and][0][tenant][equals]=${tenantId}&where[and][1][status][equals]=published&limit=${limit}&page=${page}&sort=-publishedAt&depth=2`,
      {
        next: { revalidate: 60 }, // Revalidate every minute
      }
    )

    if (!response.ok) {
      // Don't throw error, return empty result to allow fallback
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[API] Failed to fetch posts (${response.status}): ${response.statusText}`)
      }
      return {
        docs: [],
        totalDocs: 0,
        limit,
        totalPages: 0,
        page,
        pagingCounter: 0,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null,
      }
    }

    const data: CMSResponse<Post> = await response.json()
    return data
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[API] Error fetching posts:', error)
    }
    return {
      docs: [],
      totalDocs: 0,
      limit,
      totalPages: 0,
      page,
      pagingCounter: 0,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    }
  }
}

/**
 * Fetch single post by slug
 */
export async function getPostBySlug(
  slug: string,
  tenantId: string
): Promise<Post | null> {
  try {
    const response = await fetch(
      `${CMS_API_URL}/api/posts?where[and][0][slug][equals]=${slug}&where[and][1][tenant][equals]=${tenantId}&where[and][2][status][equals]=published&limit=1&depth=2`,
      {
        next: { revalidate: 60 }, // Revalidate every minute
      }
    )

    if (!response.ok) {
      // Don't throw error, just return null to allow fallback
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[API] Failed to fetch post (${response.status}): ${response.statusText}`)
      }
      return null
    }

    const data: CMSResponse<Post> = await response.json()
    return data.docs[0] || null
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[API] Error fetching post:', error)
    }
    return null
  }
}

/**
 * Get homepage data (combines tenant + homepage fetch)
 */
export async function getHomepageData() {
  const tenant = await getTenant()
  if (!tenant) {
    return null
  }

  const homepage = await getHomepage(tenant.id)
  if (!homepage) {
    return null
  }

  return {
    tenant,
    sections: homepage.sections || [],
  }
}
