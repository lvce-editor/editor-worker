import type { ColorPickerWidget } from '../ColorPickerWidget/ColorPickerWidget.ts'
import * as AddWidget from '../AddWidget/AddWidget.ts'
import * as EditorColorPickerRender from '../EditorColorPickerRender/EditorColorPickerRender.ts'
import * as RemoveWidget from '../RemoveWidget/RemoveWidget.ts'
import * as RenderMethod from '../RenderMethod/RenderMethod.ts'

const commandsToForward = [
  RenderMethod.SetDom2,
  RenderMethod.SetCss,
  RenderMethod.AppendToBody,
  RenderMethod.FocusSelector,
  RenderMethod.SetBounds2,
  RenderMethod.RegisterEventListeners,
  RenderMethod.SetUid,
]

export const render = (widget: ColorPickerWidget) => {
  const commands: any[] = EditorColorPickerRender.renderFull(widget.oldState, widget.newState)
  const wrappedCommands = []
  const { uid } = widget.newState
  for (const command of commands) {
    if (commandsToForward.includes(command[0])) {
      wrappedCommands.push(command)
    } else {
      wrappedCommands.push(['Viewlet.send', uid, ...command])
    }
  }
  return wrappedCommands
}

export const add = (widget: ColorPickerWidget) => {
  return AddWidget.addWidget(widget, 'ColorPicker', render)
}

export const remove = RemoveWidget.removeWidget

export const Commands = {}
