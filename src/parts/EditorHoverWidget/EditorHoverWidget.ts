import * as AddWidget from '../AddWidget/AddWidget.ts'
import * as EditorHoverRender from '../EditorHoverRender/EditorHoverRender.ts'
import { HoverWidget } from '../HoverWidget/HoverWidget.ts'
import * as RemoveWidget from '../RemoveWidget/RemoveWidget.ts'

export const render = (widget: HoverWidget): readonly any[] => {
  const commands: readonly any[] = EditorHoverRender.renderHover(widget.oldState, widget.newState)
  const wrappedCommands = []
  const uid = widget.newState.uid
  for (const command of commands) {
    if (command[0] === 'Viewlet.setDom2') {
      wrappedCommands.push([command[0], uid, ...command.slice(1)])
    } else {
      wrappedCommands.push(['Viewlet.send', uid, ...command])
    }
  }
  return wrappedCommands
}

export const add = (widget: HoverWidget): readonly any[] => {
  return AddWidget.addWidget(widget, 'HoverWidget', render)
}

export const remove = RemoveWidget.removeWidget
