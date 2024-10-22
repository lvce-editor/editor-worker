import * as GetFindState from '../GetFindState/GetFindState.ts'
import * as EditorCommandApplyEdit from '../EditorCommand/EditorCommandApplyEdit.ts'
import * as ReplaceTextOccurrences from '../ReplaceTextOccurrences/ReplaceTextOccurrences.ts'

export const replaceAll = async (editor: any): Promise<any> => {
  const state = GetFindState.getFindState(editor)
  if (!state) {
    return editor
  }
  const { matches, value, replacement } = state
  const edits = ReplaceTextOccurrences.replaceTextOccurrences(editor, matches, value, replacement)
  const newEditor = await EditorCommandApplyEdit.applyEdit(editor, edits)
  return newEditor
}
