import * as AddWidget from '../AddWidget/AddWidget.ts'
import * as FindWidgetRender from '../FindWidgetRender/FindWidgetRender.ts'
import { IFindWidget } from '../IFindWidget/IFindWidget.ts'
import * as RemoveWidget from '../RemoveWidget/RemoveWidget.ts'
import * as FindWidgetFunctions from '../FindWidgetFunctions/FindWidgetFunctions.ts'

export const render = (widget: IFindWidget) => {
  const commands: readonly any[] = FindWidgetRender.apply(widget.oldState, widget.newState)
  const wrappedCommands = []
  const uid = widget.newState.uid
  for (const command of commands) {
    if (command[0] === 'Viewlet.setDom2') {
      wrappedCommands.push([command[0], uid, ...command.slice(1)])
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

export const Commands = {
  'FindWidget.close': FindWidgetFunctions.close,
  'FindWidget.focusNext': FindWidgetFunctions.focusNext,
  'FindWidget.focusPrevious': FindWidgetFunctions.focusPrevious,
  'FindWidget.focusIndex': FindWidgetFunctions.focusIndex,
  'FindWidget.focusLast': FindWidgetFunctions.focusLast,
  'FindWidget.toggleReplace': FindWidgetFunctions.toggleReplace,
  'FindWidget.handleFocus': FindWidgetFunctions.handleFocus,
  'FindWidget.handleBlur': FindWidgetFunctions.handleBlur,
}
