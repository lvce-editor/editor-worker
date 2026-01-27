import * as DecorationType from '../DecorationType/DecorationType.ts'
import * as LinkDetection from '../LinkDetection/LinkDetection.ts'

/**
 * Detects links in all lines and merges them into the decorations array.
 * The decorations array format for text-level decorations is:
 * [offset, length, type, modifiers, offset, length, type, modifiers, ...]
 * But currently this function only uses the offset and length from detected links.
 */
export const mergeLinksIntoDecorations = (lines: readonly string[]): number[] => {
  const decorations: number[] = []
  let lineOffset = 0

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex]
    const links = LinkDetection.detectLinks(line)

    // Add link decorations for this line
    for (const link of links) {
      const linkOffset = lineOffset + link.start
      decorations.push(linkOffset)
      decorations.push(link.length)
      decorations.push(DecorationType.Link)
      decorations.push(0) // modifiers
    }

    lineOffset += line.length + 1 // +1 for newline
  }

  return decorations
}
