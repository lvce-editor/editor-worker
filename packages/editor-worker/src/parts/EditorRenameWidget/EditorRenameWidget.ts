import * as AddWidget from '../AddWidget/AddWidget.ts'
import * as RemoveWidget from '../RemoveWidget/RemoveWidget.ts'
import type { RenameWidget } from '../RenameWidget/RenameWidget.ts'

export const render = (widget: RenameWidget) => {
  const commands: readonly any[] = []
  const wrappedCommands = []
  const uid = widget.newState.uid
  for (const command of commands) {
    if (command[0] === 'Viewlet.setDom2') {
      wrappedCommands.push(command)
    } else {
      wrappedCommands.push(['Viewlet.send', uid, ...command])
    }
  }
  return wrappedCommands
}

export const add = (widget: RenameWidget) => {
  return AddWidget.addWidget(widget, 'EditorRename', render)
}

export const remove = RemoveWidget.removeWidget
