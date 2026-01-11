import { NextRequest, NextResponse } from 'next/server'

const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_URL || 'https://cms.ftiaxesite.gr'

/**
 * Proxy file downloads from CMS
 * Masks the CMS URL so users see the frontend domain instead
 * 
 * Usage: /api/download/[filename] or /api/download/media/file/[filename]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params
    const filename = Array.isArray(path) ? path.join('/') : path

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      )
    }

    // Construct CMS URL
    // Handle both direct filenames and paths like "media/file/filename.pdf"
    const cmsUrl = filename.startsWith('media/file/')
      ? `${CMS_API_URL}/api/${filename}`
      : `${CMS_API_URL}/api/media/file/${filename}`

    console.log(`[Download Proxy] Fetching file from CMS: ${cmsUrl}`)

    // Fetch file from CMS
    const response = await fetch(cmsUrl, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
      },
    })

    if (!response.ok) {
      console.error(`[Download Proxy] CMS returned error: ${response.status} ${response.statusText}`)
      return NextResponse.json(
        { error: 'File not found' },
        { status: response.status }
      )
    }

    // Get file content and headers
    const fileBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    const contentDisposition = response.headers.get('content-disposition') || `attachment; filename="${filename}"`

    // Extract filename from content-disposition if available
    let downloadFilename = filename
    const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
    if (filenameMatch && filenameMatch[1]) {
      downloadFilename = filenameMatch[1].replace(/['"]/g, '')
    }

    console.log(`[Download Proxy] Serving file: ${downloadFilename} (${contentType})`)

    // Return file with appropriate headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${downloadFilename}"`,
        'Content-Length': fileBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=3600, must-revalidate',
      },
    })
  } catch (error) {
    console.error('[Download Proxy] Error:', error)
    return NextResponse.json(
      { error: 'Failed to download file' },
      { status: 500 }
    )
  }
}
