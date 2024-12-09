import * as AddWidget from '../AddWidget/AddWidget.ts'
import * as FindWidgetFunctions from '../FindWidgetFunctions/FindWidgetFunctions.ts'
import * as FindWidgetRender from '../FindWidgetRender/FindWidgetRender.ts'
import { renderEventListeners } from '../GetFindWidgetEventListeners/GetFindWidgetEventListeners.ts'
import type { IFindWidget } from '../IFindWidget/IFindWidget.ts'
import * as RemoveWidget from '../RemoveWidget/RemoveWidget.ts'
import * as RenderMethod from '../RenderMethod/RenderMethod.ts'

export const render = (widget: IFindWidget) => {
  const commands: readonly any[] = FindWidgetRender.apply(widget.oldState, widget.newState)
  const wrappedCommands = []
  wrappedCommands.push()
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

export const add = (widget: IFindWidget) => {
  return AddWidget.addWidget(widget, 'FindWidget', render, renderEventListeners)
}

export const remove = RemoveWidget.removeWidget

export const Commands = {
  'FindWidget.close': FindWidgetFunctions.close,
  'FindWidget.focusNext': FindWidgetFunctions.focusNext,
  'FindWidget.focusPrevious': FindWidgetFunctions.focusPrevious,
  'FindWidget.focusIndex': FindWidgetFunctions.focusIndex,
  'FindWidget.focusLast': FindWidgetFunctions.focusLast,
  'FindWidget.toggleReplace': FindWidgetFunctions.toggleReplace,
  'FindWidget.handleFocus': FindWidgetFunctions.focusFind,
  'FindWidget.handleBlur': FindWidgetFunctions.handleBlur,
}
