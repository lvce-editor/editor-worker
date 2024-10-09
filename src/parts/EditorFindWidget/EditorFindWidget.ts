import type { ColorPickerWidget } from '../ColorPickerWidget/ColorPickerWidget.ts'
import * as EditorColorPickerRender from '../EditorColorPickerRender/EditorColorPickerRender.ts'
import * as AddWidget from '../AddWidget/AddWidget.ts'
import { IFindWidget } from '../IFindWidget/IFindWidget.ts'

export const render = (widget: IFindWidget) => {
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

export const add = (widget: IFindWidget) => {
  const commands = render(widget)
  const id = 'FindWidget'
  // TODO how to generate a unique integer id
  // that doesn't collide with ids created in renderer worker?
  const uid = widget.newState.uid
  const allCommands: any[] = []
  allCommands.push(['Viewlet.createFunctionalRoot', id, uid])
  allCommands.push(...commands)
  allCommands.push(['Viewlet.send', uid, 'appendWidget'])
  return allCommands
}

export const remove = (widget: IFindWidget) => {
  return [['Viewlet.send', widget.newState.uid, 'dispose']]
}
