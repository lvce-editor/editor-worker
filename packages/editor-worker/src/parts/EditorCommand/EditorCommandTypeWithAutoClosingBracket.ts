import * as Bracket from '../Bracket/Bracket.ts'
import * as Editor from '../Editor/Editor.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.ts'

const getMatchingClosingBrace = (brace: string) => {
  switch (brace) {
    case Bracket.CurlyOpen:
      return Bracket.CurlyClose
    case Bracket.RoundOpen:
      return Bracket.RoundClose
    case Bracket.SquareOpen:
      return Bracket.SquareClose
    default:
      return Bracket.Unknown
  }
}

export const typeWithAutoClosingBracket = (editor: any, text: string) => {
  const closingBracket = getMatchingClosingBrace(text)
  const changes = editorReplaceSelections(editor, [text + closingBracket], EditOrigin.EditorTypeWithAutoClosing)
  const selectionChanges = new Uint32Array(editor.selections.length)
  let lineDelta = 0
  for (let i = 0; i < changes.length; i++) {
    const selectionIndex = i * 4
    const change = changes[i]
    const isEmptySelection = change.start.rowIndex === change.end.rowIndex && change.start.columnIndex === change.end.columnIndex
    const selection = editor.selections.subarray(selectionIndex, selectionIndex + 4)
    const isReversedSelection = selection[0] > selection[2] || (selection[0] === selection[2] && selection[1] > selection[3])
    if (isEmptySelection) {
      selectionChanges[selectionIndex] = change.start.rowIndex + lineDelta
      selectionChanges[selectionIndex + 1] = change.start.columnIndex + 1
      selectionChanges[selectionIndex + 2] = change.start.rowIndex + lineDelta
      selectionChanges[selectionIndex + 3] = change.start.columnIndex + 1
    } else {
      change.inserted =
        change.deleted.length === 1
          ? [text + change.deleted[0] + closingBracket]
          : [text + change.deleted[0], ...change.deleted.slice(1, -1), change.deleted.at(-1) + closingBracket]
      const start = {
        columnIndex: change.start.columnIndex + 1,
        rowIndex: change.start.rowIndex + lineDelta,
      }
      const end = {
        columnIndex: (change.inserted.length === 1 ? change.start.columnIndex + change.inserted[0].length : change.inserted.at(-1).length) - 1,
        rowIndex: start.rowIndex + change.inserted.length - 1,
      }
      const anchor = isReversedSelection ? end : start
      const active = isReversedSelection ? start : end
      selectionChanges[selectionIndex] = anchor.rowIndex
      selectionChanges[selectionIndex + 1] = anchor.columnIndex
      selectionChanges[selectionIndex + 2] = active.rowIndex
      selectionChanges[selectionIndex + 3] = active.columnIndex
    }
    lineDelta += change.inserted.length - change.deleted.length
  }
  // @ts-ignore
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes, selectionChanges)
}
