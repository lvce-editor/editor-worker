import * as AddWidget from '../AddWidget/AddWidget.ts'
import type { CompletionDetailState } from '../CompletionDetailState/CompletionDetailState.ts'
import type { CompletionDetailWidget } from '../CompletionDetailWidget/CompletionDetailWidget.ts'
import * as EditorCompletionDetailRender from '../EditorCompletionDetailRender/EditorCompletionDetailRender.ts'
import * as GetCompletionState from '../GetCompletionState/GetCompletionState.ts'
import * as GetPositionAtCursor from '../GetPositionAtCursor/GetPositionAtCursor.ts'
import * as RemoveWidget from '../RemoveWidget/RemoveWidget.ts'
import * as RenderMethod from '../RenderMethod/RenderMethod.ts'

export const render = (widget: CompletionDetailWidget) => {
  const commands: readonly any[] = EditorCompletionDetailRender.renderFull(widget.oldState, widget.newState)
  const wrappedCommands = []
  const uid = widget.newState.uid
  for (const command of commands) {
    if (command[0] === RenderMethod.SetDom2) {
      wrappedCommands.push(command)
    } else {
      wrappedCommands.push(['Viewlet.send', uid, ...command])
    }
  }
  return wrappedCommands
}

export const add = (widget: CompletionDetailWidget) => {
  return AddWidget.addWidget(widget, 'EditorCompletionDetails', render)
}

export const remove = RemoveWidget.removeWidget

export const handleEditorType = (editor: any, state: CompletionDetailState): CompletionDetailState => {
  const completionState = GetCompletionState.getCompletionState(editor)
  if (!completionState) {
    return editor
  }
  const { x } = GetPositionAtCursor.getPositionAtCursor(editor)
  const detailX = x + completionState.width - state.borderSize
  return {
    ...state,
    x: detailX,
  }
}

export const handleEditorDeleteLeft = (editor: any, state: CompletionDetailState): CompletionDetailState => {
  const completionState = GetCompletionState.getCompletionState(editor)
  if (!completionState) {
    return editor
  }
  const { x } = GetPositionAtCursor.getPositionAtCursor(editor)
  const detailX = x + completionState.width - state.borderSize
  return {
    ...state,
    x: detailX,
  }
}
