import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import * as Widgets from '../Widgets/Widgets.ts'

export const applyWidgetChange = async (editor: any, widget: any, changes: any[]) => {
  const module = Widgets.getModule(widget.id)
  if (changes.length === 1 && changes[0].origin === EditOrigin.EditorType && module.handleEditorType) {
    const newState = await module.handleEditorType(widget.newState)
    return {
      ...widget,
      newState,
    }
  }
  if (changes.length === 1 && changes[0].origin === EditOrigin.DeleteLeft && module.handleEditorDeleteLeft) {
    const newState = await module.handleEditorDeleteLeft(widget.newState)
    return {
      ...widget,
      newState,
    }
  }
  return widget
}
