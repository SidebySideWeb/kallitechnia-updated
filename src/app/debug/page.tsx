import { getTenant, getHomepage } from '@/lib/api'

/**
 * Debug page to test CMS connectivity
 * Remove this page after debugging
 */
export default async function DebugPage() {
  const cmsUrl = process.env.NEXT_PUBLIC_CMS_URL || 'https://cms.ftiaxesite.gr'
  
  let tenantResult = null
  let homepageResult = null
  let tenantError = null
  let homepageError = null

  // Test tenant fetch
  try {
    tenantResult = await getTenant()
  } catch (error) {
    tenantError = error instanceof Error ? error.message : String(error)
  }

  // Test homepage fetch if tenant exists
  if (tenantResult) {
    try {
      homepageResult = await getHomepage(tenantResult.id)
    } catch (error) {
      homepageError = error instanceof Error ? error.message : String(error)
    }
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">CMS Connection Debug</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2">
            <p><strong>NEXT_PUBLIC_CMS_URL:</strong> {cmsUrl || 'NOT SET'}</p>
            <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Tenant API Test</h2>
          <p><strong>Endpoint:</strong> {cmsUrl}/api/tenants?where[code][equals]=kallitechnia&limit=1</p>
          {tenantError ? (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
              <p className="text-red-800 font-semibold">Error:</p>
              <p className="text-red-600">{tenantError}</p>
            </div>
          ) : tenantResult ? (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
              <p className="text-green-800 font-semibold">✓ Success!</p>
              <pre className="mt-2 text-sm overflow-auto">{JSON.stringify(tenantResult, null, 2)}</pre>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-800">⚠ No tenant found (check CMS has tenant with code: kallitechnia)</p>
            </div>
          )}
        </div>

        {tenantResult && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Homepage API Test</h2>
            <p><strong>Endpoint:</strong> {cmsUrl}/api/homepages?where[and][0][tenant][equals]={tenantResult.id}&where[and][1][status][equals]=published</p>
            {homepageError ? (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                <p className="text-red-800 font-semibold">Error:</p>
                <p className="text-red-600">{homepageError}</p>
              </div>
            ) : homepageResult ? (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                <p className="text-green-800 font-semibold">✓ Success!</p>
                <p className="text-sm mt-2">Sections: {homepageResult.sections?.length || 0}</p>
              </div>
            ) : (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-yellow-800">⚠ No published homepage found</p>
              </div>
            )}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Troubleshooting Steps</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Verify <code>NEXT_PUBLIC_CMS_URL</code> is set in Vercel environment variables</li>
            <li>Check CMS is accessible: <a href={`${cmsUrl}/api/tenants`} target="_blank" className="text-blue-600 underline">{cmsUrl}/api/tenants</a></li>
            <li>Verify tenant exists in CMS with code: <code>kallitechnia</code></li>
            <li>Check CMS access control allows public read access</li>
            <li>Check browser console (F12) for CORS or network errors</li>
            <li>Check Vercel build logs for any API errors during build</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
