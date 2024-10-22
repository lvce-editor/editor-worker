import * as EditorCommandApplyEdit from '../EditorCommand/EditorCommandApplyEdit.ts'
import * as FindWidgetRefreshWithEditor from '../FindWidgetRefreshWithEditor/FindWidgetRefreshWithEditor.ts'
import * as GetFindState from '../GetFindState/GetFindState.ts'
import * as ReplaceTextOccurrences from '../ReplaceTextOccurrences/ReplaceTextOccurrences.ts'
import * as UpdateWidget from '../UpdateWidget/UpdateWidget.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

export const replaceAll = async (editor: any): Promise<any> => {
  const state = GetFindState.getFindState(editor)
  if (!state) {
    return editor
  }
  const { matches, value, replacement } = state
  const edits = ReplaceTextOccurrences.replaceTextOccurrences(editor, matches, value, replacement)
  const newEditor = await EditorCommandApplyEdit.applyEdit(editor, edits)
  const newState = FindWidgetRefreshWithEditor.refresh(newEditor, state, value)
  const newestEditor = UpdateWidget.updateWidget(newEditor, WidgetId.Find, newState)
  return newestEditor
}
