import * as AddWidget from '../AddWidget/AddWidget.ts'
import * as EditorColorPickerRender from '../EditorColorPickerRender/EditorColorPickerRender.ts'
import { IFindWidget } from '../IFindWidget/IFindWidget.ts'
import * as RemoveWidget from '../RemoveWidget/RemoveWidget.ts'
import * as FindWidgetRender from '../FindWidgetRender/FindWidgetRender.ts'

export const render = (widget: IFindWidget) => {
  const commands: readonly any[] = FindWidgetRender.apply(widget.oldState, widget.newState)
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
  return AddWidget.addWidget(widget, 'FindWidget', render)
}

export const remove = RemoveWidget.removeWidget
