/**
 * Image URL Utilities
 * Normalizes Payload CMS image URLs to absolute URLs for Next.js Image component
 */

const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_URL || 'https://cms.ftiaxesite.gr'

// Debug logging (only in development)
const DEBUG = process.env.NODE_ENV === 'development'

function debugLog(message: string, data?: any) {
  if (DEBUG) {
    console.log(`[imageUtils] ${message}`, data || '')
  }
}

/**
 * Normalizes an image URL to an absolute URL
 * Handles:
 * - Relative URLs (e.g., /api/media/file/image.jpg)
 * - Absolute URLs (e.g., https://cms.ftiaxesite.gr/api/media/file/image.jpg)
 * - Payload media objects (e.g., { url: '/api/media/file/image.jpg', filename: 'image.jpg', id: '...' })
 * - Filenames only (e.g., 'image.jpg')
 * - Relationship objects with _id or id
 */
export function normalizeImageUrl(
  image: string | { url?: string; filename?: string; id?: string; _id?: string } | null | undefined
): string | null {
  if (!image) {
    debugLog('normalizeImageUrl: null/undefined image')
    return null
  }

  // Handle object (Payload CMS media object)
  if (typeof image === 'object' && image !== null) {
    debugLog('normalizeImageUrl: processing object', image)
    
    // Check for direct url property (most common)
    if (image.url && typeof image.url === 'string') {
      debugLog('normalizeImageUrl: found url property', image.url)
      return normalizeImageUrl(image.url)
    }
    
    // Check for filename property
    if (image.filename && typeof image.filename === 'string') {
      debugLog('normalizeImageUrl: found filename property', image.filename)
      return normalizeImageUrl(image.filename)
    }
    
    // If we have an ID but no URL/filename, construct URL from ID
    // Payload CMS serves media at /api/media/file/{filename} or /api/media/{id}
    const id = image.id || image._id
    if (id && typeof id === 'string') {
      debugLog('normalizeImageUrl: found id, constructing URL', id)
      // Try to extract filename from ID if it looks like a filename
      // Otherwise, use the ID directly
      if (id.includes('.') || id.match(/^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        const result = `${CMS_API_URL}/api/media/file/${id}`
        debugLog('normalizeImageUrl: constructed URL from id (filename-like)', result)
        return result
      }
      // For document IDs, we'd need to fetch the media, but let's try the file endpoint first
      const result = `${CMS_API_URL}/api/media/file/${id}`
      debugLog('normalizeImageUrl: constructed URL from id (document-id)', result)
      return result
    }
    
    debugLog('normalizeImageUrl: object has no url, filename, or id')
    return null
  }

  // Handle string URLs
  if (typeof image !== 'string') {
    debugLog('normalizeImageUrl: not a string or object', typeof image)
    return null
  }

  const url = image.trim()

  if (!url) {
    debugLog('normalizeImageUrl: empty string')
    return null
  }

  // Already absolute URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    debugLog('normalizeImageUrl: already absolute URL', url)
    return url
  }

  // Relative URL starting with /
  if (url.startsWith('/')) {
    const result = `${CMS_API_URL}${url}`
    debugLog('normalizeImageUrl: relative URL converted', { input: url, output: result })
    return result
  }

  // Filename only - construct full URL
  // Payload CMS media files are served at /api/media/file/{filename}
  const result = `${CMS_API_URL}/api/media/file/${url}`
  debugLog('normalizeImageUrl: filename converted to URL', { input: url, output: result })
  return result
}

/**
 * Extracts image URL from various Payload CMS media formats
 * Supports:
 * - Direct string URLs
 * - Media objects with url/filename/id
 * - Nested media references
 * - Relationship objects
 */
export function extractImageUrl(
  image: any
): string | null {
  if (!image) {
    return null
  }

  // Already a string URL - normalize it
  if (typeof image === 'string') {
    return normalizeImageUrl(image)
  }

  // Handle object (Payload CMS media object or relationship)
  if (typeof image === 'object' && image !== null) {
    // Try direct properties first
    if (image.url && typeof image.url === 'string') {
      return normalizeImageUrl(image.url)
    }
    
    if (image.filename && typeof image.filename === 'string') {
      return normalizeImageUrl(image.filename)
    }
    
    // Check for ID-based references
    const id = image.id || image._id || image._ref
    if (id && typeof id === 'string') {
      // If ID looks like a filename, use it directly
      if (id.includes('.') || id.match(/^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        return normalizeImageUrl(id)
      }
      // Otherwise try to construct URL from ID
      return normalizeImageUrl(id)
    }
    
    // Try nested paths (for deeply nested structures)
    const paths = [
      'url',
      'filename', 
      'image.url',
      'image.filename',
      'media.url',
      'media.filename',
      'backgroundImage.url',
      'backgroundImage.filename',
      'logo.url',
      'logo.filename',
      'photo.url',
      'photo.filename',
    ]
    
    for (const path of paths) {
      const parts = path.split('.')
      let value = image
      
      for (const part of parts) {
        if (value && typeof value === 'object' && part in value) {
          value = value[part]
        } else {
          value = null
          break
        }
      }
      
      if (value && typeof value === 'string') {
        return normalizeImageUrl(value)
      }
      
      // If nested value is an object, try to extract from it
      if (value && typeof value === 'object') {
        const nestedResult = extractImageUrl(value)
        if (nestedResult) {
          return nestedResult
        }
      }
    }
  }

  return null
}

/**
 * Converts a CMS file URL to a frontend proxy URL
 * Masks the CMS domain so users see the frontend domain instead
 * 
 * Examples:
 * - `/api/media/file/document.pdf` → `/api/download/document.pdf`
 * - `https://cms.ftiaxesite.gr/api/media/file/document.pdf` → `/api/download/document.pdf`
 * - `document.pdf` → `/api/download/document.pdf`
 */
export function getProxyDownloadUrl(
  fileUrl: string | { url?: string; filename?: string } | null | undefined
): string | null {
  if (!fileUrl) {
    return null
  }

  // Handle object (Payload CMS media object)
  if (typeof fileUrl === 'object' && fileUrl !== null) {
    if (fileUrl.url && typeof fileUrl.url === 'string') {
      return getProxyDownloadUrl(fileUrl.url)
    }
    if (fileUrl.filename && typeof fileUrl.filename === 'string') {
      return getProxyDownloadUrl(fileUrl.filename)
    }
    return null
  }

  // Handle string URLs
  if (typeof fileUrl !== 'string') {
    return null
  }

  const url = fileUrl.trim()
  if (!url) {
    return null
  }

  // Extract filename from various URL formats
  let filename = url

  // If it's an absolute URL, extract the path
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      const urlObj = new URL(url)
      filename = urlObj.pathname
    } catch {
      // Invalid URL, use as-is
      filename = url
    }
  }

  // Extract filename from path
  // Handle paths like: /api/media/file/document.pdf or media/file/document.pdf
  if (filename.includes('/api/media/file/')) {
    filename = filename.split('/api/media/file/')[1]
  } else if (filename.includes('media/file/')) {
    filename = filename.split('media/file/')[1]
  } else if (filename.startsWith('/api/')) {
    filename = filename.replace('/api/', '')
  } else if (filename.startsWith('/')) {
    filename = filename.substring(1)
  }

  // Clean up filename (remove query params if any)
  if (filename.includes('?')) {
    filename = filename.split('?')[0]
  }

  if (!filename) {
    return null
  }

  // Return proxy URL
  return `/api/download/${filename}`
}
