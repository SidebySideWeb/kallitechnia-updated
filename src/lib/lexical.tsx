/**
 * Lexical Editor Data Utilities
 * Handles rendering and extracting text from Lexical editor format
 */

import React from 'react'

/**
 * Lexical node structure from Payload CMS
 */
export interface LexicalNode {
  type?: string
  text?: string
  format?: number
  children?: LexicalNode[]
  [key: string]: any
}

export interface LexicalDocument {
  root?: {
    children?: LexicalNode[]
    [key: string]: any
  }
  [key: string]: any
}

/**
 * Extract plain text from a Lexical node
 */
export function extractTextFromLexical(node: LexicalNode | string | null | undefined): string {
  if (!node) {
    return ''
  }

  if (typeof node === 'string') {
    return node
  }

  if (node.text !== undefined) {
    return node.text || ''
  }

  if (node.children && Array.isArray(node.children)) {
    return node.children
      .filter((child) => child !== null && child !== undefined)
      .map(extractTextFromLexical)
      .join('')
  }

  return ''
}

/**
 * Extract plain text from Lexical document or array
 */
export function extractText(
  content: LexicalDocument | LexicalNode[] | string[] | string | null | undefined
): string {
  if (!content) {
    return ''
  }

  if (typeof content === 'string') {
    return content
  }

  if (Array.isArray(content)) {
    return content.map(extractTextFromLexical).join(' ')
  }

  // Handle Lexical document structure
  if (typeof content === 'object' && content !== null) {
    if ('root' in content && content.root) {
      const root = content.root as { children?: LexicalNode[] }
      if (root.children && Array.isArray(root.children)) {
        return root.children.map(extractTextFromLexical).join(' ')
      }
    }
    // If it's a single node
    return extractTextFromLexical(content as LexicalNode)
  }

  return ''
}

/**
 * Extract array of paragraphs from Lexical content
 * Properly handles paragraph nodes in Lexical structure
 */
export function extractParagraphs(
  content: LexicalDocument | LexicalNode[] | string[] | string | null | undefined
): string[] {
  if (!content) {
    return []
  }

  if (typeof content === 'string') {
    return [content]
  }

  if (Array.isArray(content)) {
    // Check if it's an array of strings
    if (content.length > 0 && typeof content[0] === 'string') {
      return content as string[]
    }
    // Check if nodes are paragraph nodes - extract text from each paragraph separately
    const paragraphs: string[] = []
    for (const node of content) {
      if (node && typeof node === 'object' && node !== null) {
        // If it's a paragraph node, extract text from its children
        if (node.type === 'paragraph' && node.children && Array.isArray(node.children)) {
          const paragraphText = node.children.map(extractTextFromLexical).join('').trim()
          if (paragraphText) {
            paragraphs.push(paragraphText)
          }
        } else {
          // Otherwise extract text from the node itself
          const text = extractTextFromLexical(node)
          if (text) {
            paragraphs.push(text)
          }
        }
      }
    }
    return paragraphs.filter(Boolean)
  }

  // Handle Lexical document structure
  if (typeof content === 'object' && content !== null) {
    if ('root' in content && content.root) {
      const root = content.root as { children?: LexicalNode[] }
      if (root.children && Array.isArray(root.children)) {
        const paragraphs: string[] = []
        for (const node of root.children) {
          if (node && typeof node === 'object' && node !== null) {
            // If it's a paragraph node, extract text from its children
            if (node.type === 'paragraph' && node.children && Array.isArray(node.children)) {
              const paragraphText = node.children.map(extractTextFromLexical).join('').trim()
              if (paragraphText) {
                paragraphs.push(paragraphText)
              }
            } else {
              // Otherwise extract text from the node itself
              const text = extractTextFromLexical(node)
              if (text) {
                paragraphs.push(text)
              }
            }
          }
        }
        return paragraphs.filter(Boolean)
      }
    }
  }

  return []
}

/**
 * Render Lexical node with formatting
 */
function renderLexicalNode(node: LexicalNode, index: number = 0): React.ReactNode {
  if (!node || typeof node !== 'object' || node === null) {
    return null
  }

  const { type, text, format, children, ...rest } = node

  // Text node
  if (text !== undefined || type === 'text') {
    const textContent = text || ''
    if (!textContent) {
      return null
    }

    let element: React.ReactNode = textContent

    // Apply formatting (bit flags)
    if (format !== undefined && typeof format === 'number') {
      if (format & 1) {
        // Bold
        element = <strong>{element}</strong>
      }
      if (format & 2) {
        // Italic
        element = <em>{element}</em>
      }
      if (format & 4) {
        // Strikethrough
        element = <del>{element}</del>
      }
      if (format & 8) {
        // Underline
        element = <u>{element}</u>
      }
      if (format & 16) {
        // Code
        element = <code>{element}</code>
      }
    }

    return <React.Fragment key={index}>{element}</React.Fragment>
  }

  // Element nodes with children
  if (children && Array.isArray(children)) {
    const childElements = children
      .map((child, idx) => renderLexicalNode(child, idx))
      .filter(Boolean)

    if (childElements.length === 0) {
      return null
    }

    switch (type) {
      case 'paragraph':
        return (
          <p key={index} className="text-lg leading-relaxed text-muted-foreground">
            {childElements}
          </p>
        )
      case 'heading':
        const level = rest.tag || rest.level || 1
        const HeadingTag = `h${Math.min(Math.max(level, 1), 6)}` as keyof React.JSX.IntrinsicElements
        return (
          <HeadingTag key={index} className="text-2xl font-bold text-primary mb-4">
            {childElements}
          </HeadingTag>
        )
      case 'list':
        const ListTag = rest.listType === 'number' ? 'ol' : 'ul'
        return (
          <ListTag key={index} className="list-disc list-inside space-y-2 mb-4">
            {childElements}
          </ListTag>
        )
      case 'listitem':
        return (
          <li key={index} className="mb-2">
            {childElements}
          </li>
        )
      case 'link':
        // Lexical link nodes can have URL in various properties
        const url = rest.url || rest.href || rest.fields?.url || rest.fields?.href || '#'
        const isExternal = url && (url.startsWith('http://') || url.startsWith('https://'))
        const isInternal = url && url.startsWith('/')
        
        // For external links, open in new tab with security attributes
        if (isExternal) {
          return (
            <a
              key={index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {childElements}
            </a>
          )
        }
        
        // For internal links, use Next.js Link for better performance
        // But since we're in a server component context, we'll use regular <a> for now
        return (
          <a key={index} href={url} className="text-primary hover:underline">
            {childElements}
          </a>
        )
      default:
        return (
          <div key={index} className="mb-4">
            {childElements}
          </div>
        )
    }
  }

  return null
}

/**
 * Render Lexical content as React nodes
 */
export function renderLexicalContent(
  content: LexicalDocument | LexicalNode[] | string[] | string | null | undefined
): React.ReactNode[] {
  if (!content) {
    return []
  }

  // Handle string
  if (typeof content === 'string') {
    return [
      <p key="0" className="text-lg leading-relaxed text-muted-foreground">
        {content}
      </p>,
    ]
  }

  // Handle array of strings
  if (Array.isArray(content) && content.length > 0 && typeof content[0] === 'string') {
    return (content as string[]).map((text, index) => (
      <p key={index} className="text-lg leading-relaxed text-muted-foreground">
        {text}
      </p>
    ))
  }

  // Handle Lexical document structure
  let nodes: LexicalNode[] = []
  if (Array.isArray(content)) {
    nodes = content as LexicalNode[]
  } else if (typeof content === 'object' && content !== null) {
    if ('root' in content && content.root) {
      const root = content.root as { children?: LexicalNode[] }
      nodes = root.children || []
    } else {
      // Single node
      nodes = [content as LexicalNode]
    }
  }

  return nodes
    .filter((node) => node && typeof node === 'object' && node !== null)
    .map((node, index) => renderLexicalNode(node, index))
    .filter(Boolean)
}
