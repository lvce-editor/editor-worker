import * as ReplaceRanges from '../EditorCommand/EditorCommandReplaceRange.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'

export const replaceTextOccurrences = (editor: any, matches: Uint32Array, oldValue: string, newValue: string): readonly any[] => {
  const ranges = []
  const oldValueLength = oldValue.length
  for (let i = 0; i < matches.length; i += 2) {
    const startRowIndex = matches[i]
    const startColumnIndex = matches[i + 1]
    const endRowIndex = matches[i]
    const endColumnIndex = matches[i] + oldValueLength
    ranges.push(startRowIndex, startColumnIndex, endRowIndex, endColumnIndex)
  }
  return ReplaceRanges.replaceRange(editor, ranges, [newValue], EditOrigin.ReplaceAll)
}
