import { WidgetId } from '@lvce-editor/constants'
import type { RenameWidget } from '../RenameWidget/RenameWidget.ts'
import * as AddWidget from '../AddWidget/AddWidget.ts'
import { createFns } from '../CreateFns/CreateFns.ts'
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

export const render = (widget: RenameWidget) => {
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

export const add = (widget: RenameWidget) => {
  return AddWidget.addWidget(widget, 'EditorRename', render)
}

export const remove = (widget: RenameWidget) => {
  return [['Viewlet.dispose', widget.newState.uid]]
}

export const { accept, close, handleInput } = createFns(['handleInput', 'close', 'accept'], 'Rename', WidgetId.Rename)
