import * as EditorSelection from '../EditorSelection/EditorSelection.ts'
import * as EditorCommandCutLine from './EditorCommandCutLine.ts'
import * as EditorCommandCutSelectedText from './EditorCommandCutSelectedText.ts'

export const cut = async (editor: any) => {
  const { selections } = editor
  if (EditorSelection.isEverySelectionEmpty(selections)) {
    return EditorCommandCutLine.cutLine(editor)
  }
  return EditorCommandCutSelectedText.cutSelectedText(editor)
}
