import * as EditorPosition from '../EditorCommand/EditorCommandPosition.ts'
import * as EditorCompletionRender from '../EditorCompletionRender/EditorCompletionRender.ts'
import * as FilterCompletionItems from '../FilterCompletionItems/FilterCompletionItems.ts'
import * as GetListHeight from '../GetListHeight/GetListHeight.ts'
import * as EditorCommandGetWordAt from '../EditorCommand/EditorCommandGetWordAt.ts'

export const render = (oldState: any, newState: any) => {
  const commands = EditorCompletionRender.renderCompletion(oldState, newState)
  const wrappedCommands = []
  const uid = newState.uid
  for (const command of commands) {
    wrappedCommands.push(['Viewlet.send', uid, ...command])
  }
  return wrappedCommands
}

export const add = (widget: any) => {
  const commands = render(widget.oldState, widget.newState)
  const id = 'EditorCompletion'
  // TODO how to generate a unique integer id
  // that doesn't collide with ids created in renderer worker?
  const uid = widget.newState.uid
  const allCommands: any[] = []
  allCommands.push(['Viewlet.create', id, uid])
  allCommands.push(...commands)
  return allCommands
}

export const remove = (widget: any) => {
  return [['Viewlet.send', widget.newState.uid, 'dispose']]
}

export const handleEditorType = (editor: any, state: any) => {
  const { unfilteredItems, itemHeight, maxHeight } = state
  const { selections } = editor
  const rowIndex = selections[0]
  const columnIndex = selections[1]
  const x = EditorPosition.x(editor, rowIndex, columnIndex)
  const y = EditorPosition.y(editor, rowIndex)
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
  const { selections } = editor
  const rowIndex = selections[0]
  const columnIndex = selections[1]
  const x = EditorPosition.x(editor, rowIndex, columnIndex)
  const y = EditorPosition.y(editor, rowIndex)
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
