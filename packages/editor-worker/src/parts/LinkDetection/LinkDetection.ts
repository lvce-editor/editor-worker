import type { Link } from './Link.js'
import * as DecorationType from '../DecorationType/DecorationType.ts'
import { getRegexMatches } from './getRegexMatches.ts'

// URL matching regex pattern - matches common URL schemes
// Supports: http://, https://, ftp://, ftps://, file://
// Also matches URLs without explicit scheme (www.example.com)
const URL_PATTERN =
  /(?:(?:https?|ftp|ftps|file):\/\/)?(?:www\.)?(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\/[^\s]*)?/g

// Regex to check if URL has a scheme (http://, https://, ftp://, etc.)
const HAS_SCHEME_PATTERN = /^(?:https?|ftp|ftps|file):\/\//

// Regex to check if URL starts with www.
const HAS_WWW_PATTERN = /^www\./

/**
 * Detects links in a given text and returns their positions
 * @param text The text to scan for links
 * @returns Array of links with their start position and length
 */
export const detectLinks = (text: string): Link[] => {
  const matches = getRegexMatches(text, URL_PATTERN)
  const links: Link[] = []

  for (const match of matches) {
    const url = match[0]
    // Only consider as link if it has a scheme or starts with www.
    if (HAS_SCHEME_PATTERN.test(url) || HAS_WWW_PATTERN.test(url)) {
      links.push({
        length: url.length,
        start: match.index ?? 0,
      })
    }
  }

  return links
}

/**
 * Detects all links in an editor and returns them as decorations
 * @param editor The editor containing lines to scan
 * @returns Flat array of decorations in format [offset, length, type, modifiers, ...]
 */
export const detectAllLinksAsDecorations = (editor: any): number[] => {
  const decorations: number[] = []
  const { lines } = editor
  let offset = 0

  for (const line of lines) {
    const links = detectLinks(line)
    for (const link of links) {
      const linkOffset = offset + link.start
      // Add link decoration: offset, length, type, modifiers
      decorations.push(linkOffset, link.length, DecorationType.Link, 0)
    }
    offset += line.length + 1 // +1 for newline
  }

  return decorations
}
