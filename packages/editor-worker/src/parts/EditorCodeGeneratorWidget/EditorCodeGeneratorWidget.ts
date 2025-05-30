import type { CodeGeneratorWidget } from '../CodeGeneratorWidget/CodeGeneratorWidget.ts'
import type { WidgetLifeCycleFunction } from '../WidgetLifeCycleFunction/WidgetLifeCycleFunction.ts'
import * as AddWidget from '../AddWidget/AddWidget.ts'
import * as RemoveWidget from '../RemoveWidget/RemoveWidget.ts'
import * as RenderCodeGeneratorWidget from '../RenderCodeGeneratorWidget/RenderCodeGeneratorWidget.ts'
import * as RenderMethod from '../RenderMethod/RenderMethod.ts'

export const render: WidgetLifeCycleFunction<CodeGeneratorWidget> = (widget) => {
  const commands = RenderCodeGeneratorWidget.renderFull(widget.oldState, widget.newState)
  const wrappedCommands = []
  const { uid } = widget.newState
  for (const command of commands) {
    if (command[0] === RenderMethod.SetDom2) {
      wrappedCommands.push(command)
    } else {
      // @ts-ignore
      wrappedCommands.push(['Viewlet.send', uid, ...command])
    }
  }
  return wrappedCommands
}

export const add = (widget: CodeGeneratorWidget) => {
  return AddWidget.addWidget(widget, 'EditorCodeGenerator', render)
}

export const remove = RemoveWidget.removeWidget
