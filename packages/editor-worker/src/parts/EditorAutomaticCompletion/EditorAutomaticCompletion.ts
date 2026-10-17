import { WidgetId } from '@lvce-editor/constants'
import { closeCompletion } from '../EditorCommand/EditorCommandCloseCompletion.ts'
import { openCompletion } from '../EditorCommand/EditorCommandOpenCompletion.ts'
import { shouldOpenAutomaticCompletion } from '../ShouldOpenAutomaticCompletion/ShouldOpenAutomaticCompletion.ts'

export const updateAutomaticCompletion = async (editor: any) => {
  const widget = (editor.widgets || []).find((candidate: any) => candidate.id === WidgetId.Completion)
  if (widget && !widget.newState.automatic) {
    return editor
  }
  if (!shouldOpenAutomaticCompletion(editor)) {
    return widget ? closeCompletion(editor) : editor
  }
  return openCompletion(editor, true)
}
