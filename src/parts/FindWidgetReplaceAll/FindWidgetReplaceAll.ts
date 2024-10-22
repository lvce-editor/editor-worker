import * as GetFindState from '../GetFindState/GetFindState.ts'
import * as EditorCommandApplyEdit from '../EditorCommand/EditorCommandApplyEdit.ts'
import * as ReplaceTextOccurrences from '../ReplaceTextOccurrences/ReplaceTextOccurrences.ts'

export const replaceAll = (editor: any): any => {
  const state = GetFindState.getFindState(editor)
  if (!state) {
    return editor
  }
  const { matches, value, replacement } = state
  const edits = ReplaceTextOccurrences.replaceTextOccurrences(editor, matches, value, replacement)
  const newEditor = EditorCommandApplyEdit.applyEdit(editor, edits)
  return newEditor
}
