import { DragAndDropWorker } from '@lvce-editor/rpc-registry'
import type { EditorState } from '../State/State.ts'
import * as ClickDetailType from '../ClickDetailType/ClickDetailType.ts'
import * as GetModifier from '../GetModifier/GetModifier.ts'
import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'
import { handleClickAtPosition } from './EditorCommandHandleClickAtPosition.ts'
import * as EditorHandleDoubleClick from './EditorCommandHandleDoubleClick.ts'
import * as EditorHandleSingleClick from './EditorCommandHandleSingleClick.ts'
import * as EditorHandleTripleClick from './EditorCommandHandleTripleClick.ts'
import * as EditorPosition from './EditorCommandPosition.ts'

const PrimaryButton = 0
const SecondaryButton = 2

const isPositionBeforeOrEqual = (rowIndex: number, columnIndex: number, otherRowIndex: number, otherColumnIndex: number): boolean => {
  return rowIndex < otherRowIndex || (rowIndex === otherRowIndex && columnIndex <= otherColumnIndex)
}

const isPositionInSelection = (selections: Uint32Array, rowIndex: number, columnIndex: number): boolean => {
  for (let i = 0; i < selections.length; i += 4) {
    const [startRowIndex, startColumnIndex, endRowIndex, endColumnIndex] = GetSelectionPairs.getSelectionPairs(selections, i)
    if (
      isPositionBeforeOrEqual(startRowIndex, startColumnIndex, rowIndex, columnIndex) &&
      isPositionBeforeOrEqual(rowIndex, columnIndex, endRowIndex, endColumnIndex)
    ) {
      return true
    }
  }
  return false
}

const handleSecondaryMouseDown = async (state: EditorState, x: number, y: number): Promise<EditorState> => {
  const position = await EditorPosition.at(state, x, y)
  if (isPositionInSelection(state.selections, position.rowIndex, position.columnIndex)) {
    return state
  }
  return handleClickAtPosition(state, 0, position.rowIndex, position.columnIndex)
}

const startTextDrag = async (state: EditorState, x: number, y: number): Promise<EditorState | undefined> => {
  const position = await EditorPosition.at(state, x, y)
  const selectionIndex = state.primarySelectionIndex || 0
  const [startRowIndex, startColumnIndex, endRowIndex, endColumnIndex] = GetSelectionPairs.getSelectionPairs(state.selections, selectionIndex)
  const startOffset = TextDocument.offsetAt(state, startRowIndex, startColumnIndex)
  const endOffset = TextDocument.offsetAt(state, endRowIndex, endColumnIndex)
  const pointerOffset = TextDocument.offsetAt(state, position.rowIndex, position.columnIndex)
  if (startOffset === endOffset || pointerOffset < startOffset || pointerOffset >= endOffset) {
    return undefined
  }
  try {
    if (state.textDragId) {
      await DragAndDropWorker.invoke('DragAndDrop.discardTextDrag', state.textDragId)
    }
    const text = TextDocument.getText(state).slice(startOffset, endOffset)
    const textDragId = await DragAndDropWorker.invoke('DragAndDrop.createTextDrag', {
      endOffset,
      sourceUri: state.uri,
      startOffset,
      text,
    })
    return {
      ...state,
      isSelecting: false,
      textDragDropPosition: position,
      textDragId,
    }
  } catch {
    return undefined
  }
}

export const handleMouseDown = async (
  state: EditorState,
  button: number,
  altKey: boolean,
  ctrlKey: boolean,
  x: number,
  y: number,
  detail: any,
  shiftKey = false,
): Promise<EditorState> => {
  if (button === SecondaryButton) {
    return handleSecondaryMouseDown(state, x, y)
  }
  if (button !== PrimaryButton) {
    return state
  }
  if (shiftKey && state.dragAndDropEnabled && detail === ClickDetailType.Single) {
    const dragState = await startTextDrag(state, x, y)
    if (dragState) {
      return dragState
    }
  }
  const modifier = GetModifier.getModifier(altKey, ctrlKey)
  let newState
  switch (detail) {
    case ClickDetailType.Double:
      newState = await EditorHandleDoubleClick.handleDoubleClick(state, modifier, x, y)
      break
    case ClickDetailType.Single:
      newState = await EditorHandleSingleClick.handleSingleClick(state, modifier, x, y)
      break
    case ClickDetailType.Triple:
      newState = EditorHandleTripleClick.handleTripleClick(state, modifier, x, y)
      break
    default:
      return state
  }
  return {
    ...newState,
    isSelecting: true,
  }
}
