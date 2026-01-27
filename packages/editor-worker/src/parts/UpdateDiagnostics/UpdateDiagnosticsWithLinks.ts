import * as LinkDetection from '../LinkDetection/LinkDetection.ts'

/**
 * Merges link decorations with diagnostic decorations
 * Links should always be present, but we also need to include any diagnostic decorations
 */
export const mergeLinksWithDiagnosticDecorations = (editor: any, diagnosticDecorations: number[]): number[] => {
  // Get link decorations
  const linkDecorations = LinkDetection.detectAllLinksAsDecorations(editor)

  // Merge with diagnostic decorations
  const allDecorations = [...linkDecorations, ...diagnosticDecorations]

  // Sort by offset to maintain proper order
  const sortedDecorations: Array<{ offset: number; length: number; type: number; modifiers: number }> = []
  for (let i = 0; i < allDecorations.length; i += 4) {
    sortedDecorations.push({
      length: allDecorations[i + 1],
      modifiers: allDecorations[i + 3],
      offset: allDecorations[i],
      type: allDecorations[i + 2],
    })
  }
  sortedDecorations.sort((a, b) => a.offset - b.offset)

  // Flatten back to array format
  const result: number[] = []
  for (const dec of sortedDecorations) {
    result.push(dec.offset, dec.length, dec.type, dec.modifiers)
  }

  return result
}
