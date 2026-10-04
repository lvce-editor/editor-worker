import { WidgetId } from '@lvce-editor/constants'
import type { EditorState } from '../State/State.ts'
import * as CloseWidgetsMaybe from '../CloseWidgetsMaybe/CloseWidgetsMaybe.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as HasWidget from '../HasWidget/HasWidget.ts'
import * as Preferences from '../Preferences/Preferences.ts'
import * as WidgetRevision from '../WidgetRevision/WidgetRevision.ts'
import * as EditorCommandSave from './EditorCommandSave.ts'
import { isUntitledFile } from './EditorCommandSave/isUntitledFile.ts'

export const handleBlur = async (editor: EditorState): Promise<EditorState> => {
  if (!editor.focused) {
    return editor
  }
  const widgetRevision = WidgetRevision.next(editor.uid)
  const hoverWidget = editor.widgets?.find((widget) => widget.id === WidgetId.Hover)
  const completionWidgetDismissedOnBlur = HasWidget.hasWidget([...(editor.widgets || [])], WidgetId.Completion)
  const newEditor = {
    ...editor,
    additionalFocus: hoverWidget ? FocusKey.FocusEditorHover : 0,
    ...(completionWidgetDismissedOnBlur && { completionWidgetDismissedOnBlur: true }),
    ...(hoverWidget && { focus: FocusKey.Empty }),
    focused: false,
    widgetRevision,
    widgets: hoverWidget
      ? [...CloseWidgetsMaybe.closeWidgetsMaybe(editor.widgets || []), hoverWidget]
      : CloseWidgetsMaybe.closeWidgetsMaybe(editor.widgets || []),
  }
  if (!editor.modified || isUntitledFile(editor.uri)) {
    return newEditor
  }
  const autoSave = await Preferences.get('files.autoSave')
  if (autoSave !== 'onFocusChange') {
    return newEditor
  }
  return EditorCommandSave.save(newEditor)
}
