import * as EndOfLine from '../EndOfLine/EndOfLine.ts'
import * as TabModifiedStatusChange from '../TabModifiedStatusChange/TabModifiedStatusChange.ts'

export const setEndOfLine = async (editor: any, endOfLine: EndOfLine.EndOfLine) => {
  if (endOfLine !== EndOfLine.Lf && endOfLine !== EndOfLine.Crlf) {
    throw new TypeError(`Unsupported end of line sequence: ${endOfLine}`)
  }
  if (editor.endOfLine === endOfLine) {
    return editor
  }
  if (!editor.modified) {
    await TabModifiedStatusChange.notifyTabModifiedStatusChange(editor.uri, true)
  }
  return {
    ...editor,
    endOfLine,
    focused: true,
    lines: [...editor.lines],
    modified: true,
  }
}
