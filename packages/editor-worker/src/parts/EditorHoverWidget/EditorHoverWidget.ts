import { WidgetId } from '@lvce-editor/constants'
import type { HoverWidget } from '../HoverWidget/HoverWidget.ts'
import * as AddWidget from '../AddWidget/AddWidget.ts'
import { createFns } from '../CreateFns/CreateFns.ts'
import * as GetHoverVirtualDom from '../GetHoverVirtualDom/GetHoverVirtualDom.ts'
import * as RenderMethod from '../RenderMethod/RenderMethod.ts'
import * as RenderRename from '../RenderRename/RenderRename.ts'

const commandsToForward = [
  RenderMethod.SetDom2,
  RenderMethod.SetCss,
  RenderMethod.SetBounds2,
  RenderMethod.RegisterEventListeners,
  RenderMethod.SetSelectionByName,
  RenderMethod.SetValueByName,
  RenderMethod.SetFocusContext,
  RenderMethod.SetUid,
  'Viewlet.focusSelector',
]

export const render = (widget: HoverWidget) => {
  const { newState, oldState } = widget
  const commands: readonly any[] =
    newState.commands.length > 0
      ? RenderRename.renderFull(oldState, newState)
      : [
          [
            RenderMethod.SetDom2,
            newState.uid,
            GetHoverVirtualDom.getHoverVirtualDom(newState.lineInfos, newState.documentation, newState.diagnostics),
          ],
          [RenderMethod.SetBounds2, newState.uid, newState.x, newState.y, newState.width, newState.height],
        ]
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

export const add = (widget: HoverWidget) => {
  return AddWidget.addWidget(widget, 'EditorCompletion', render)
}

export const remove = (widget: HoverWidget) => {
  return []
}

export const { close } = createFns(['close'], '', WidgetId.Hover)
