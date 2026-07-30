import { WidgetId } from '@lvce-editor/constants'
import * as ColorPickerWorker from '../ColorPickerWorker/ColorPickerWorker.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as RenderWidgets from '../RenderWidgets/RenderWidgets.ts'
import * as WidgetRevision from '../WidgetRevision/WidgetRevision.ts'

export const disposeEditor = async (editorUid: number): Promise<readonly any[]> => {
  const editor = EditorStates.get(editorUid)?.newState
  if (!editor) {
    return []
  }
  for (const widget of editor.widgets) {
    if (widget.id === WidgetId.ColorPicker) {
      await ColorPickerWorker.invoke('ColorPicker.dispose', widget.newState.uid)
    }
  }
  const commands = RenderWidgets.renderWidgets(editor, {
    ...editor,
    widgets: [],
  })
  WidgetRevision.dispose(editorUid)
  EditorStates.dispose(editorUid)
  return commands
}
