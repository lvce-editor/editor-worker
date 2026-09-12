import { diffChars, type ChangeObject } from 'diff'
import * as TextDocument from '../TextDocument/TextDocument.ts'

const mapOffset = (offset: number, changes: readonly ChangeObject<string>[]): number => {
  let oldOffset = 0
  let newOffset = 0
  for (const change of changes) {
    const { length } = change.value
    if (change.added) {
      newOffset += length
    } else if (change.removed) {
      if (offset < oldOffset + length) {
        return newOffset
      }
      oldOffset += length
    } else {
      if (offset < oldOffset + length) {
        return newOffset + offset - oldOffset
      }
      oldOffset += length
      newOffset += length
    }
  }
  return newOffset
}

export const getFormattingSelections = (lines: readonly string[], newLines: readonly string[], selections: Uint32Array): Uint32Array => {
  const text = lines.join('\n')
  const newText = newLines.join('\n')
  if (text === newText) {
    return selections
  }
  // Bound expensive diffs of unrelated documents; preserve valid coordinates if the limit is reached.
  const changes = diffChars(text, newText, { maxEditLength: 1000 })
  const result = new Uint32Array(selections.length)
  for (let i = 0; i < selections.length; i += 2) {
    if (!changes) {
      const row = Math.min(selections[i], newLines.length - 1)
      result[i] = row
      result[i + 1] = Math.min(selections[i + 1], newLines[row].length)
      continue
    }
    const offset = TextDocument.offsetAt({ lines }, selections[i], selections[i + 1])
    const position = TextDocument.positionAt({ lines: newLines }, mapOffset(offset, changes))
    result[i] = position.rowIndex
    result[i + 1] = position.columnIndex
  }
  return result
}
