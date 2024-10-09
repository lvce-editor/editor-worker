import type { CompletionDetailWidget } from '../CompletionDetailWidget/CompletionDetailWidget.ts'
import * as EditorCompletionDetailRender from '../EditorCompletionDetailRender/EditorCompletionDetailRender.ts'
import * as AddWidget from '../AddWidget/AddWidget.ts'

export const render = (widget: CompletionDetailWidget) => {
  const commands: any[] = EditorCompletionDetailRender.renderFull(widget.oldState, widget.newState)
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

export const remove = (widget: any) => {
  return [['Viewlet.send', widget.newState.uid, 'dispose']]
}
