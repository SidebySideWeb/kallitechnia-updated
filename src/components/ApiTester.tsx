'use client'

import { useEffect, useState } from 'react'

export function ApiTester() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const testApi = async () => {
      try {
        const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_URL || 'https://cms.ftiaxesite.gr'
        const tenantId = 1
        const slug = 'contact'
        
        // Test 1: Get tenant
        console.log('[ApiTester] Testing tenant fetch...')
        const tenantUrl = `${CMS_API_URL}/api/tenants?where[code][equals]=kallitechnia&limit=1&depth=0`
        const tenantRes = await fetch(tenantUrl)
        const tenantData = await tenantRes.json()
        console.log('[ApiTester] Tenant:', tenantData)
        
        // Test 2: Get all pages for tenant (no filters)
        console.log('[ApiTester] Testing all pages fetch...')
        const allPagesUrl = `${CMS_API_URL}/api/pages?where[tenant][equals]=${tenantId}&limit=50&depth=0`
        const allPagesRes = await fetch(allPagesUrl)
        const allPagesData = await allPagesRes.json()
        console.log('[ApiTester] All pages:', allPagesData)
        
        // Test 3: Get page by slug (no status filter)
        console.log('[ApiTester] Testing page by slug (no status)...')
        const pageUrlNoStatus = `${CMS_API_URL}/api/pages?where[and][0][slug][equals]=${slug}&where[and][1][tenant][equals]=${tenantId}&limit=1&depth=0`
        const pageResNoStatus = await fetch(pageUrlNoStatus)
        const pageDataNoStatus = await pageResNoStatus.json()
        console.log('[ApiTester] Page (no status filter):', pageDataNoStatus)
        
        // Test 4: Get page by slug (with status filter)
        console.log('[ApiTester] Testing page by slug (with status)...')
        const pageUrl = `${CMS_API_URL}/api/pages?where[and][0][slug][equals]=${slug}&where[and][1][tenant][equals]=${tenantId}&where[and][2][status][equals]=published&limit=1&depth=2`
        const pageRes = await fetch(pageUrl)
        const pageData = await pageRes.json()
        console.log('[ApiTester] Page (with status filter):', pageData)
        
        setResult({
          tenant: tenantData,
          allPages: allPagesData,
          pageNoStatus: pageDataNoStatus,
          pageWithStatus: pageData,
        })
      } catch (error) {
        console.error('[ApiTester] Error:', error)
        setResult({ error: String(error) })
      } finally {
        setLoading(false)
      }
    }
    
    testApi()
  }, [])

  if (loading) {
    return (
      <div className="fixed bottom-4 left-4 bg-blue-500 text-white p-4 rounded-lg text-xs z-50">
        Testing API...
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-2xl z-50 overflow-auto max-h-96">
      <div className="font-bold mb-2">API Test Results</div>
      <pre className="whitespace-pre-wrap break-words text-[10px]">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  )
}
