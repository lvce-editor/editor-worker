import * as EditorSelection from '../EditorSelection/EditorSelection.ts'
import * as EditorCommandCutLine from './EditorCommandCutLine.ts'
import * as EditorCommandCutSelectedText from './EditorCommandCutSelectedText.ts'

export const cut = async (editor: any) => {
  const { selections } = editor
  const [startRowIndex, startColumnIndex, endRowIndex, endColumnIndex] = selections
  if (EditorSelection.isEmpty(startRowIndex, startColumnIndex, endRowIndex, endColumnIndex)) {
    return EditorCommandCutLine.cutLine(editor)
  }
  return EditorCommandCutSelectedText.cutSelectedText(editor)
}
