import type { Link } from './Link.js'
import { getRegexMatches } from './getRegexMatches.js'

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
