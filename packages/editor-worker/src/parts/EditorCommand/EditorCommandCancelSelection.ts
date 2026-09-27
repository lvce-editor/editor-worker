import { WidgetId } from '@lvce-editor/constants'
import * as Editor from '../Editor/Editor.ts'
import * as EditorSelection from '../EditorSelection/EditorSelection.ts'
import * as RemoveEditorWidget from '../RemoveEditorWidget/RemoveEditorWidget.ts'
import * as WidgetRevision from '../WidgetRevision/WidgetRevision.ts'

export const cancelSelection = (editor: any) => {
  const { selections, widgets = [] } = editor
  if (widgets.some((widget: any) => widget.id === WidgetId.Hover)) {
    return {
      ...editor,
      additionalFocus: 0,
      focused: true,
      widgetRevision: WidgetRevision.next(editor.uid),
      widgets: RemoveEditorWidget.removeEditorWidget(widgets, WidgetId.Hover),
    }
  }
  if (selections.length === 4 && selections[0] === selections[2] && selections[1] === selections[3]) {
    return editor
  }
  const newSelections = EditorSelection.alloc(4)
  EditorSelection.moveRangeToPosition(newSelections, 0, selections[0], selections[1])
  return Editor.scheduleSelections(editor, newSelections)
}
