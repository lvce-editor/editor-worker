import { WidgetId } from '@lvce-editor/constants'
import type { SourceActionWidget } from '../SourceActionWidget/SourceActionWidget.ts'
import * as AddWidget from '../AddWidget/AddWidget.ts'
import { createFns } from '../CreateFns/CreateFns.ts'
import * as RemoveWidget from '../RemoveWidget/RemoveWidget.ts'
import * as RenderMethod from '../RenderMethod/RenderMethod.ts'
import * as RenderRename from '../RenderRename/RenderRename.ts'

const commandsToForward = [
  RenderMethod.SetDom2,
  RenderMethod.SetCss,
  RenderMethod.AppendToBody,
  RenderMethod.SetBounds2,
  RenderMethod.RegisterEventListeners,
  RenderMethod.SetSelectionByName,
  RenderMethod.SetValueByName,
  RenderMethod.SetFocusContext,
  RenderMethod.SetUid,
  'Viewlet.focusSelector',
]

export const render = (widget: SourceActionWidget) => {
  const commands: readonly any[] = RenderRename.renderFull(widget.oldState, widget.newState)
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

export const add = (widget: SourceActionWidget) => {
  return AddWidget.addWidget(widget, 'EditorSourceActions', render)
}

export const remove = RemoveWidget.removeWidget

export const {
  close,
  closeDetails,
  focusFirst,
  focusIndex,
  focusLast,
  focusNext,
  focusPrevious,
  handleWheel,
  selectCurrent,
  selectIndex,
  selectItem,
  toggleDetails,
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
