import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import * as Widgets from '../Widgets/Widgets.ts'

export const applyWidgetChange = (editor: any, widget: any, changes: any[]) => {
  const module = Widgets.getModule(widget.id)
  console.log({ module })
  if (changes.length === 1 && changes[0].origin === EditOrigin.EditorType && module.handleEditorType) {
    const newState = module.handleEditorType(editor, widget.newState)
    console.log('if 1')
    return {
      ...widget,
      newState,
    }
  }
  console.log({ changes })
  if (changes.length === 1 && changes[0].origin === EditOrigin.DeleteLeft && module.handleEditorDeleteLeft) {
    const newState = module.handleEditorDeleteLeft(editor, widget.newState)
    return {
      ...widget,
      newState,
    }
  }
  return widget
}
