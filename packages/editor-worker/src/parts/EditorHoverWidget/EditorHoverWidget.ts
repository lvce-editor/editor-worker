import * as AddWidget from '../AddWidget/AddWidget.ts'
import * as EditorHoverRender from '../EditorHoverRender/EditorHoverRender.ts'
import type { HoverWidget } from '../HoverWidget/HoverWidget.ts'
import * as RemoveWidget from '../RemoveWidget/RemoveWidget.ts'
import * as RenderMethod from '../RenderMethod/RenderMethod.ts'
import type { WidgetLifeCycleFunction } from '../WidgetLifeCycleFunction/WidgetLifeCycleFunction.ts'

export const render: WidgetLifeCycleFunction<HoverWidget> = (widget) => {
  const commands: readonly any[] = EditorHoverRender.renderHover(widget.oldState, widget.newState)
  const wrappedCommands = []
  const uid = widget.newState.uid
  for (const command of commands) {
    if (command[0] === RenderMethod.SetDom2) {
      wrappedCommands.push([command[0], uid, ...command.slice(1)])
    } else {
      wrappedCommands.push(['Viewlet.send', uid, ...command])
    }
  }
  return wrappedCommands
}

export const add: WidgetLifeCycleFunction<HoverWidget> = (widget) => {
  return AddWidget.addWidget(widget, 'EditorHover', render)
}

export const remove = RemoveWidget.removeWidget
