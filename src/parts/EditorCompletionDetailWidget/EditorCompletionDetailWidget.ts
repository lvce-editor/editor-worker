import * as AddWidget from '../AddWidget/AddWidget.ts'
import type { CompletionDetailWidget } from '../CompletionDetailWidget/CompletionDetailWidget.ts'
import * as EditorCompletionDetailRender from '../EditorCompletionDetailRender/EditorCompletionDetailRender.ts'
import * as RemoveWidget from '../RemoveWidget/RemoveWidget.ts'

export const render = (widget: CompletionDetailWidget) => {
  const commands: readonly any[] = EditorCompletionDetailRender.renderFull(widget.oldState, widget.newState)
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

export const add = (widget: CompletionDetailWidget) => {
  return AddWidget.addWidget(widget, 'EditorCompletionDetails', render)
}

export const remove = RemoveWidget.removeWidget
