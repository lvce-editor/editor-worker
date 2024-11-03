import * as AddWidget from '../AddWidget/AddWidget.ts'
import { CodeGenratorWidget } from '../CodeGeneratorWidget/CodeGeneratorWidget.ts'
import * as RemoveWidget from '../RemoveWidget/RemoveWidget.ts'
import * as RenderCodeGeneratorWidget from '../RenderCodeGeneratorWidget/RenderCodeGeneratorWidget.ts'
import type { WidgetLifeCycleFunction } from '../WidgetLifeCycleFunction/WidgetLifeCycleFunction.ts'

export const render: WidgetLifeCycleFunction<CodeGenratorWidget> = (widget) => {
  const commands = RenderCodeGeneratorWidget.renderCodeGeneratorWidget(widget.oldState, widget.newState)
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

export const add = (widget: CodeGenratorWidget) => {
  return AddWidget.addWidget(widget, 'EditorCodeGenerator', render)
}

export const remove = RemoveWidget.removeWidget
