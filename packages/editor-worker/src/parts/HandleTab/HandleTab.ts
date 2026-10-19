import * as ApplyTabCompletion from '../ApplyTabCompletion/ApplyTabCompletion.ts'
import * as EditorIndentMore from '../EditorCommand/EditorCommandIndentMore.ts'
import * as EditorType from '../EditorCommand/EditorCommandType.ts'
import * as EditorSelection from '../EditorSelection/EditorSelection.ts'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.ts'
import { getIndentString } from '../GetIndentString/GetIndentString.ts'
import * as TabCompletion from '../TabCompletion/TabCompletion.ts'
import * as Editor from '../Editor/Editor.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

const insertTab = (editor: any) => {
  return EditorType.type(editor, getIndentString(editor))
}

export const handleTab = async (editor: any) => {
  if (!EditorSelection.isEverySelectionEmpty(editor.selections)) {
    return EditorIndentMore.indentMore(editor)
  }
  if (editor.snippetTabStops) {
    const { activeOffset, stops } = editor.snippetTabStops
    if (stops.length > 0 && editor.selections.length === 4) {
      const offset = TextDocument.offsetAt(editor, editor.selections[2], editor.selections[3])
      const delta = offset - activeOffset
      if (delta >= 0) {
        const [nextStop, ...remainingStops] = stops
        const position = TextDocument.positionAt(editor, nextStop.offset + delta)
        const newEditor = Editor.scheduleSelections(
          editor,
          new Uint32Array([position.rowIndex, position.columnIndex, position.rowIndex, position.columnIndex]),
        )
        return {
          ...newEditor,
          snippetTabStops:
            remainingStops.length > 0
              ? { activeOffset: nextStop.offset + delta, stops: remainingStops.map((stop: any) => ({ offset: stop.offset + delta })) }
              : undefined,
        }
      }
    }
    editor = { ...editor, snippetTabStops: undefined }
  }
  try {
    const result = await TabCompletion.getTabCompletion(editor)
    if (!result) {
      return insertTab(editor)
    }
    return ApplyTabCompletion.applyTabCompletion(editor, result)
  } catch (error) {
    await ErrorHandling.handleError(error, 'Failed to execute tab completion provider: ')
    return insertTab(editor)
  }
}
