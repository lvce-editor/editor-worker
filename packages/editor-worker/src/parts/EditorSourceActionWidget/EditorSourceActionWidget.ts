import type { SourceActionWidget } from '../SourceActionWidget/SourceActionWidget.ts'
import * as AddWidget from '../AddWidget/AddWidget.ts'
import { createFns } from '../CreateFns/CreateFns.ts'
import * as RemoveWidget from '../RemoveWidget/RemoveWidget.ts'
import * as RenderMethod from '../RenderMethod/RenderMethod.ts'
import * as RenderRename from '../RenderRename/RenderRename.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

export const render = (widget: SourceActionWidget) => {
  const commands: readonly any[] = RenderRename.renderFull(widget.oldState, widget.newState)
  const wrappedCommands = []
  const { uid } = widget.newState
  for (const command of commands) {
    if (
      command[0] === RenderMethod.SetDom2 ||
      command[0] === RenderMethod.SetCss ||
      command[0] === RenderMethod.AppendToBody ||
      command[0] === RenderMethod.SetBounds2 ||
      command[0] === RenderMethod.RegisterEventListeners ||
      command[0] === RenderMethod.SetSelectionByName ||
      command[0] === RenderMethod.SetValueByName ||
      command[0] === RenderMethod.SetFocusContext ||
      command[0] === RenderMethod.SetUid ||
      command[0] === 'Viewlet.focusSelector'
    ) {
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
