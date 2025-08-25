import * as AddWidget from '../AddWidget/AddWidget.ts'
import { createFns } from '../CreateFns/CreateFns.ts'
import * as RemoveWidget from '../RemoveWidget/RemoveWidget.ts'
import * as RenderMethod from '../RenderMethod/RenderMethod.ts'
import * as RenderSourceActions from '../RenderSourceActions/RenderSourceActions.ts'
import type { SourceActionWidget } from '../SourceActionWidget/SourceActionWidget.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'
import type { WidgetLifeCycleFunction } from '../WidgetLifeCycleFunction/WidgetLifeCycleFunction.ts'

export const render: WidgetLifeCycleFunction<SourceActionWidget> = (widget) => {
  const commands = RenderSourceActions.doRender(widget.oldState, widget.newState)
  const wrappedCommands = []
  const { uid } = widget.newState
  for (const command of commands) {
    if (command[0] === RenderMethod.SetDom2) {
      wrappedCommands.push(command)
    } else {
      wrappedCommands.push(['Viewlet.send', uid, ...command])
    }
  }
  return wrappedCommands
}

export const add = (widget: SourceActionWidget) => {
  return AddWidget.addWidget(widget, 'EditorSourceActions', render)
}

export const remove = RemoveWidget.removeWidget

export const {
  focusFirst,
  focusIndex,
  focusLast,
  focusNext,
  focusPrevious,
  selectCurrent,
  selectIndex,
  selectItem,
  toggleDetails,
  closeDetails,
  handleWheel,
  close,
} = createFns(
  [
    'focusFirst',
    'focusIndex',
    'focusLast',
    'focusNext',
    'focusPrevious',
    'selectCurrent',
    'selectIndex',
    'selectItem',
    'toggleDetails',
    'closeDetails',
    'handleWheel',
    'close',
  ],
  'SourceActions',
  WidgetId.SourceAction,
)
