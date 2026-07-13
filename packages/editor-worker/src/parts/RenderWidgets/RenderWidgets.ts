import type { EditorState } from '../State/State.ts'
import * as RenderWidget from '../RenderWidget/RenderWidget.ts'

const normalizeWidgetCommand = (command: readonly any[], editorUid: number): readonly any[] => {
  if (command[0] === 'Viewlet.setFocusContext' && command.length === 2) {
    return [command[0], editorUid, command[1], 0, editorUid, 'Editor']
  }
  return command
}

export const renderWidgets = (oldState: EditorState, newState: EditorState): readonly any[] => {
  const addedWidgets = []
  const changedWidgets = []
  const removedWidgets = []
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
      removedWidgets.push(oldWidget)
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
  const removeCommands = []
  for (const removedWidget of removedWidgets) {
    const childCommands = RenderWidget.removeWidget(removedWidget)
    if (childCommands.length > 0) {
      removeCommands.push(...childCommands)
    }
  }
  const allCommands = [...addCommands, ...changeCommands, ...removeCommands]
  return allCommands.map((command) => normalizeWidgetCommand(command, newState.uid))
}
