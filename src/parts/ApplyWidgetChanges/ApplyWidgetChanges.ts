import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import * as Widgets from '../Widgets/Widgets.ts'

export const applyWidgetChanges = (editor: any, changes: any) => {
  const widgets = editor.widgets || []
  if (widgets.length === 0) {
    return widgets
  }
  const newWidgets = widgets.map((widget: any) => {
    const module = Widgets.getModule(widget.id)
    if (changes.length === 1 && changes[0].origin === EditOrigin.EditorType && module.handleEditorType) {
      const newState = module.handleEditorType(editor, widget.newState)
      return {
        ...widget,
        newState,
      }
    }
    return widget
  })
  return newWidgets
}
