import { WidgetId } from '@lvce-editor/constants'
import * as HasWidget from '../HasWidget/HasWidget.ts'
import * as EditorCommandCloseCompletion from './EditorCommandCloseCompletion.ts'
import * as EditorCommandOpenCompletion from './EditorCommandOpenCompletion.ts'

export const toggleCompletion = async (editor: any) => {
  if (!editor) {
    return editor
  }
  const { widgets } = editor
  const isCompletionOpen = HasWidget.hasWidget(widgets, WidgetId.Completion)
  if (isCompletionOpen) {
    return EditorCommandCloseCompletion.closeCompletion(editor)
  }
  return EditorCommandOpenCompletion.openCompletion(editor)
}
