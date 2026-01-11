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
    // Note: We don't filter by status here because tenantAccess already filters published content for public users
    const response = await fetch(
      `${CMS_API_URL}/api/homepages?where[tenant][equals]=${tenantId}&limit=1&depth=2`,
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
  tenantId: string | number
): Promise<Page | null> {
  // Try multiple query formats to handle different tenant ID types
  // Note: We don't filter by status here because tenantAccess already filters published content for public users
  const tenantIdStr = String(tenantId)
  const apiUrl = `${CMS_API_URL}/api/pages?where[and][0][slug][equals]=${slug}&where[and][1][tenant][equals]=${tenantIdStr}&limit=1&depth=2`
  
  try {
    console.log(`[API] Fetching page:`, { slug, tenantId, tenantIdStr, apiUrl })
    
    const response = await fetch(apiUrl, {
      next: { revalidate: 0 }, // Always fetch fresh data for form updates
      cache: 'no-store', // Ensure no caching
    })

    console.log(`[API] Page response status: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unable to read error response')
      console.error(`[API] Failed to fetch page (${response.status}): ${response.statusText}`)
      console.error(`[API] Error response: ${errorText}`)
      return null
    }

    const rawResponse = await response.text()
    console.log(`[API] Raw API response:`, rawResponse.substring(0, 500))
    
    let data: CMSResponse<Page>
    try {
      data = JSON.parse(rawResponse)
    } catch (e) {
      console.error('[API] Failed to parse JSON response:', e)
      console.error('[API] Raw response:', rawResponse)
      return null
    }
    
    console.log(`[API] Page data received:`, {
      totalDocs: data.totalDocs,
      docsLength: data.docs?.length || 0,
      found: data.docs && data.docs.length > 0,
      pageSlug: data.docs[0]?.slug,
      sectionsCount: data.docs[0]?.sections?.length || 0,
      pageId: data.docs[0]?.id,
      pageStatus: (data.docs[0] as any)?.status,
    })
    
    // If page not found, try different queries to debug
    if (!data.docs || data.docs.length === 0) {
      console.warn(`[API] Page with slug "${slug}" not found. Trying alternative queries...`)
      
      // Try 1: Without status filter (to see if it's a draft)
      try {
        const draftUrl = `${CMS_API_URL}/api/pages?where[and][0][slug][equals]=${slug}&where[and][1][tenant][equals]=${tenantId}&limit=1&depth=0`
        const draftResponse = await fetch(draftUrl, { cache: 'no-store' })
        if (draftResponse.ok) {
          const draftData: CMSResponse<Page> = await draftResponse.json()
          if (draftData.docs.length > 0) {
            console.warn(`[API] Found page but status is:`, (draftData.docs[0] as any).status)
          }
        }
      } catch (e) {
        console.warn('[API] Could not check draft status:', e)
      }
      
      // Try 2: List all pages for this tenant
      try {
        const allPagesUrl = `${CMS_API_URL}/api/pages?where[tenant][equals]=${tenantId}&limit=50&depth=0`
        const allPagesResponse = await fetch(allPagesUrl, { cache: 'no-store' })
        if (allPagesResponse.ok) {
          const allPagesData: CMSResponse<Page> = await allPagesResponse.json()
          console.warn(`[API] Available pages for tenant ${tenantId}:`, 
            allPagesData.docs.map(p => ({ 
              id: p.id, 
              slug: p.slug, 
              status: (p as any).status,
              title: (p as any).title || 'Untitled'
            }))
          )
        }
      } catch (e) {
        console.warn('[API] Could not fetch all pages for debugging:', e)
      }
    }
    
    return data.docs[0] || null
  } catch (error) {
    console.error('[API] Error fetching page:', error)
    if (error instanceof Error) {
      console.error('[API] Error message:', error.message)
      console.error('[API] Error stack:', error.stack)
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
    // Note: We don't filter by status here because tenantAccess already filters published content for public users
    const response = await fetch(
      `${CMS_API_URL}/api/posts?where[tenant][equals]=${tenantId}&limit=${limit}&page=${page}&sort=-publishedAt&depth=2`,
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
    // Note: We don't filter by status here because tenantAccess already filters published content for public users
    const response = await fetch(
      `${CMS_API_URL}/api/posts?where[and][0][slug][equals]=${slug}&where[and][1][tenant][equals]=${tenantId}&limit=1&depth=2`,
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

export interface FormField {
  type: 'text' | 'email' | 'tel' | 'textarea' | 'number' | 'select' | 'checkbox'
  label: string
  name: string
  required: boolean
  placeholder?: string
  options?: Array<{ label: string; value: string }>
}

export interface Form {
  id: string
  name: string
  slug: string
  fields: FormField[]
  successMessage?: string
  redirectUrl?: string
  status: 'active' | 'inactive'
}

/**
 * Fetch form by slug or ID
 */
export async function getFormBySlug(slugOrId: string | number): Promise<Form | null> {
  try {
    // Add timestamp to bust cache (for client-side calls)
    const timestamp = Date.now()
    const slugOrIdStr = String(slugOrId)
    
    // Check if slugOrId looks like a number (ID) or string (slug)
    const isNumericId = /^\d+$/.test(slugOrIdStr)
    
    let response
    
    if (isNumericId) {
      // If it's numeric, fetch by ID directly (faster)
      console.log('[API] Fetching form by ID:', slugOrIdStr)
      response = await fetch(
        `${CMS_API_URL}/api/forms/${slugOrIdStr}?depth=2&_t=${timestamp}`,
        {
          cache: 'no-store', // No caching for client components
          // Removed Cache-Control headers to avoid CORS issues
        }
      )
    } else {
      // Try fetching by slug first
      // Note: We don't filter by status here because tenantAccess already filters active forms for public users
      console.log('[API] Fetching form by slug:', slugOrIdStr)
      response = await fetch(
        `${CMS_API_URL}/api/forms?where[slug][equals]=${slugOrIdStr}&limit=1&depth=2&_t=${timestamp}`,
        {
          cache: 'no-store', // No caching for client components
          // Removed Cache-Control headers to avoid CORS issues
        }
      )

      if (response.ok) {
        const data: CMSResponse<Form> = await response.json()
        if (data.docs.length > 0) {
          return data.docs[0]
        }
      }

      // If not found by slug, try fetching by ID
      console.log('[API] Form not found by slug, trying by ID:', slugOrIdStr)
      response = await fetch(
        `${CMS_API_URL}/api/forms/${slugOrIdStr}?depth=2&_t=${timestamp}`,
        {
          cache: 'no-store', // No caching for client components
          // Removed Cache-Control headers to avoid CORS issues
        }
      )
    }

    if (response.ok) {
      const form: Form = await response.json()
      console.log('[API] ✅ Form fetched successfully:', form.name || form.slug, 'Fields:', form.fields?.length || 0)
      return form
    }

    // Log detailed error information
    const errorText = await response.text().catch(() => 'Unable to read error response')
    console.error(`[API] ❌ Failed to fetch form (${response.status}): ${response.statusText}`)
    console.error(`[API] Error response:`, errorText)
    return null
  } catch (error) {
    console.error('[API] ❌ Error fetching form:', error)
    if (error instanceof Error) {
      console.error('[API] Error message:', error.message)
      console.error('[API] Error stack:', error.stack)
    }
    return null
  }
}

/**
 * Submit form data
 */
export async function submitForm(
  formSlug: string,
  data: Record<string, any>
): Promise<{ success: boolean; message?: string; redirectUrl?: string; errors?: Record<string, string> }> {
  try {
    console.log('[API] Submitting form to:', `${CMS_API_URL}/api/forms/submit`)
    console.log('[API] Form slug:', formSlug)
    console.log('[API] Form data:', data)
    
    const response = await fetch(`${CMS_API_URL}/api/forms/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formSlug, data }),
    })

    console.log('[API] Response status:', response.status, response.statusText)
    
    const result = await response.json()
    console.log('[API] Response data:', result)

    if (!response.ok) {
      console.error('[API] Submission failed:', result)
      return {
        success: false,
        message: result.error || 'Failed to submit form',
        errors: result.errors,
      }
    }

    console.log('[API] Submission successful')
    return {
      success: true,
      message: result.message,
      redirectUrl: result.redirectUrl,
    }
  } catch (error) {
    console.error('[API] Error submitting form:', error)
    if (error instanceof Error) {
      console.error('[API] Error message:', error.message)
      console.error('[API] Error stack:', error.stack)
    }
    return {
      success: false,
      message: 'An error occurred while submitting the form. Please try again.',
    }
  }
}
