import type { EditorState } from '../State/State.ts'
import * as RenderWidget from '../RenderWidget/RenderWidget.ts'
import * as WidgetRevision from '../WidgetRevision/WidgetRevision.ts'

export const renderWidgets = (oldState: EditorState, newState: EditorState): readonly any[] => {
  const addedWidgets = []
  const changedWidgets = []
  const oldWidgets = oldState.widgets || []
  const newWidgets = newState.widgets || []
  const oldWidgetMap = Object.create(null)
  const newWidgetMap = Object.create(null)
  for (const oldWidget of oldWidgets) {
    oldWidgetMap[oldWidget.id] = oldWidget
  }
  for (const newWidget of newWidgets) {
    newWidgetMap[newWidget.id] = newWidget
  }
  for (const oldWidget of oldWidgets) {
    if (Object.hasOwn(newWidgetMap, oldWidget.id)) {
      changedWidgets.push(newWidgetMap[oldWidget.id])
    } else {
      // Layout disposes widgets that are absent from the complete declaration.
    }
  }
  for (const newWidget of newWidgets) {
    if (Object.hasOwn(oldWidgetMap, newWidget.id)) {
      // ignore
    } else {
      addedWidgets.push(newWidget)
    }
  }
  const addCommands = []
  for (const addedWidget of addedWidgets) {
    const childCommands = RenderWidget.addWidget(addedWidget)
    if (childCommands.length > 0) {
      addCommands.push(...childCommands)
    }
  }
  const changeCommands: any[] = []
  for (const changedWidget of changedWidgets) {
    const childCommands = RenderWidget.renderWidget(changedWidget)
    if (childCommands.length > 0) {
      changeCommands.push(...childCommands)
    }
  }
  const hasDeclaredRevision = typeof newState.widgetRevision === 'number' && newState.widgetRevision > (oldState.widgetRevision || 0)
  const declaredRevision = hasDeclaredRevision ? newState.widgetRevision : WidgetRevision.next(newState.uid)
  WidgetRevision.record(newState.uid, declaredRevision)
  const widgetUids = newWidgets.map((widget) => widget.newState.uid)
  const allCommands = [...addCommands, ...changeCommands, ['Viewlet.setWidgets', newState.uid, declaredRevision, widgetUids]]
  return allCommands.filter((item) => item[0] !== 'Viewlet.appendToBody')
}
