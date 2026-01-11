'use client'

import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface DownloadButtonProps {
  fileUrl: string
  fileName?: string
  buttonLabel?: string
  className?: string
}

/**
 * Client component that handles file downloads
 * Fetches the file and triggers a download to avoid opening in browser
 */
export function DownloadButton({
  fileUrl,
  fileName,
  buttonLabel = 'Download',
  className,
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    
    if (!fileUrl) return

    setIsDownloading(true)

    try {
      // Fetch the file
      const response = await fetch(fileUrl, {
        method: 'GET',
        headers: {
          'Accept': '*/*',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status}`)
      }

      // Get file as blob
      const blob = await response.blob()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName || 'download'
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
      // Fallback: open in new tab if download fails
      window.open(fileUrl, '_blank')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button
      className={className}
      onClick={handleDownload}
      disabled={isDownloading}
    >
      <Download className="mr-2 h-4 w-4" />
      {isDownloading ? 'Downloading...' : buttonLabel}
    </Button>
  )
}
