import { WidgetId } from '@lvce-editor/constants'
import type { CompletionWidget } from '../CompletionWidget/CompletionWidget.ts'
import * as AddWidget from '../AddWidget/AddWidget.ts'
import { createFns } from '../CreateFns/CreateFns.ts'
import * as RenderMethod from '../RenderMethod/RenderMethod.ts'
import * as RenderRename from '../RenderRename/RenderRename.ts'

export const render = (widget: CompletionWidget) => {
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

export const add = (widget: CompletionWidget) => {
  return AddWidget.addWidget(widget, 'EditorCompletion', render)
}

export const remove = (widget: CompletionWidget) => {
  return [['Viewlet.dispose', widget.newState.uid]]
}

export const {
  close,
  closeDetails,
  focusFirst,
  focusIndex,
  focusLast,
  focusNext,
  focusPrevious,
  handleEditorBlur,
  handleEditorClick,
  handleEditorDeleteLeft,
  handleEditorType,
  handlePointerDown,
  handleWheel,
  openDetails,
  selectCurrent,
  selectIndex,
  toggleDetails,
} = createFns(
  [
    'handleEditorType',
    'focusFirst',
    'focusNext',
    'focusPrevious',
    'focusLast',
    'handleEditorDeleteLeft',
    'openDetails',
    'focusIndex',
    'handleEditorBlur',
    'handleEditorClick',
    'openDetails',
    'selectCurrent',
    'selectIndex',
    'toggleDetails',
    'closeDetails',
    'handleWheel',
    'close',
    'handlePointerDown',
  ],
  'Completions',
  WidgetId.Completion,
)
