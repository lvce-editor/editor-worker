import * as EditorCommandGetWordAt from '../EditorCommand/EditorCommandGetWordAt.ts'
import * as FilterCompletionItems from '../FilterCompletionItems/FilterCompletionItems.ts'
import * as GetListHeight from '../GetListHeight/GetListHeight.ts'
import * as GetPositionAtCursor from '../GetPositionAtCursor/GetPositionAtCursor.ts'
import * as RemoveWidget from '../RemoveWidget/RemoveWidget.ts'
import * as AddWidget from '../AddWidget/AddWidget.ts'
import type { CompletionWidget } from '../CompletionWidget/CompletionWidget.ts'
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
  return AddWidget.addWidget(widget, 'EditorRename', render)
}

export const remove = RemoveWidget.removeWidget

export const handleEditorType = (editor: any, state: any) => {
  const { unfilteredItems, itemHeight, maxHeight } = state
  const { x, y, rowIndex, columnIndex } = GetPositionAtCursor.getPositionAtCursor(editor)
  const wordAtOffset = EditorCommandGetWordAt.getWordBefore(editor, rowIndex, columnIndex)
  const items = FilterCompletionItems.filterCompletionItems(unfilteredItems, wordAtOffset)
  const newMinLineY = 0
  const newMaxLineY = Math.min(items.length, 8)
  const height = GetListHeight.getListHeight(items.length, itemHeight, maxHeight)
  const finalDeltaY = items.length * itemHeight - height
  return {
    ...state,
    items,
    x,
    y,
    minLineY: newMinLineY,
    maxLineY: newMaxLineY,
    leadingWord: wordAtOffset,
    height,
    finalDeltaY,
  }
}

export const handleEditorDeleteLeft = (editor: any, state: any) => {
  const { unfilteredItems, itemHeight, maxHeight } = state
  const { x, y, rowIndex, columnIndex } = GetPositionAtCursor.getPositionAtCursor(editor)
  const wordAtOffset = EditorCommandGetWordAt.getWordBefore(editor, rowIndex, columnIndex)
  if (!wordAtOffset) {
    return undefined
  }
  const items = FilterCompletionItems.filterCompletionItems(unfilteredItems, wordAtOffset)
  const newMaxLineY = Math.min(items.length, 8)
  const height = GetListHeight.getListHeight(items.length, itemHeight, maxHeight)
  return {
    ...state,
    items,
    x,
    y,
    maxLineY: newMaxLineY,
    leadingWord: wordAtOffset,
    height,
  }
}
