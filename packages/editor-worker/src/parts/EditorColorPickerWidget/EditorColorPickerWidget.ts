import * as AddWidget from '../AddWidget/AddWidget.ts'
import * as ColorPicker from '../ColorPicker/ColorPicker.ts'
import type { ColorPickerWidget } from '../ColorPickerWidget/ColorPickerWidget.ts'
import * as EditorColorPickerRender from '../EditorColorPickerRender/EditorColorPickerRender.ts'
import * as RemoveWidget from '../RemoveWidget/RemoveWidget.ts'

export const render = (widget: ColorPickerWidget) => {
  const commands: any[] = EditorColorPickerRender.renderFull(widget.oldState, widget.newState)
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

export const add = (widget: ColorPickerWidget) => {
  return AddWidget.addWidget(widget, 'ColorPicker', render)
}

export const remove = RemoveWidget.removeWidget

export const Commands = {
  'ColorPicker.handleSliderPointerDown': ColorPicker.handleSliderPointerDown,
  'ColorPicker.handleSliderPointerMove': ColorPicker.handleSliderPointerMove,
}
