import * as AddWidget from '../AddWidget/AddWidget.ts'
import * as RemoveWidget from '../RemoveWidget/RemoveWidget.ts'
import * as RenderSourceActions from '../RenderSourceActions/RenderSourceActions.ts'
import type { SourceActionWidget } from '../SourceActionWidget/SourceActionWidget.ts'
import type { WidgetLifeCycleFunction } from '../WidgetLifeCycleFunction/WidgetLifeCycleFunction.ts'

export const render: WidgetLifeCycleFunction<SourceActionWidget> = (widget) => {
  const commands = RenderSourceActions.doRender(widget.oldState, widget.newState)
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

export const add = (widget: SourceActionWidget) => {
  return AddWidget.addWidget(widget, 'ColorPicker', render)
}

export const remove = RemoveWidget.removeWidget
