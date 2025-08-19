import type { RenameWidget } from '../RenameWidget/RenameWidget.ts'
import * as AddWidget from '../AddWidget/AddWidget.ts'
import { createFns } from '../CreateFns/CreateFns.ts'
import * as RenderMethod from '../RenderMethod/RenderMethod.ts'
import * as RenderRename from '../RenderRename/RenderRename.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

export const render = (widget: RenameWidget) => {
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

export const add = (widget: RenameWidget) => {
  return AddWidget.addWidget(widget, 'EditorRename', render)
}

export const remove = (widget: RenameWidget) => {
  return [['Viewlet.dispose', widget.newState.uid]]
}

export const { handleInput, close, accept } = createFns(['handleInput', 'close', 'accept'], 'Rename', WidgetId.Rename)
