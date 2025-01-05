import type { SourceActionWidget } from '../SourceActionWidget/SourceActionWidget.ts'
import type { WidgetLifeCycleFunction } from '../WidgetLifeCycleFunction/WidgetLifeCycleFunction.ts'
import * as AddWidget from '../AddWidget/AddWidget.ts'
import * as RemoveWidget from '../RemoveWidget/RemoveWidget.ts'
import * as RenderMethod from '../RenderMethod/RenderMethod.ts'
import * as RenderSourceActions from '../RenderSourceActions/RenderSourceActions.ts'

export const render: WidgetLifeCycleFunction<SourceActionWidget> = (widget) => {
  const commands = RenderSourceActions.doRender(widget.oldState, widget.newState)
  const wrappedCommands = []
  const uid = widget.newState.uid
  for (const command of commands) {
    if (command[0] === RenderMethod.SetDom2) {
      wrappedCommands.push(command)
    } else {
      wrappedCommands.push(['Viewlet.send', uid, ...command])
    }
  }
  return wrappedCommands
}

export const add = (widget: SourceActionWidget) => {
  return AddWidget.addWidget(widget, 'EditorSourceActions', render)
}

export const remove = RemoveWidget.removeWidget
