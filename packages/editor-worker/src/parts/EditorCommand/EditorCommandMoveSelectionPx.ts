import * as Assert from '../Assert/Assert.ts'
import * as EditorMoveSelectionAnchorState from '../EditorMoveSelectionAnchorState/EditorMoveSelectionAnchorState.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as RequestAnimationFrame from '../RequestAnimationFrame/RequestAnimationFrame.ts'
import * as EditorMoveSelection from './EditorCommandMoveSelection.ts'
import * as EditorPosition from './EditorCommandPosition.ts'

// @ts-ignore
const getNewEditor = (editor, position) => {
  const { maxLineY, minLineY, rowHeight } = editor
  const diff = maxLineY - minLineY
  if (position.rowIndex < minLineY) {
    const newMinLineY = position.rowIndex
    const newMaxLineY = position.rowIndex + diff
    const newDeltaY = position.rowIndex * rowHeight
    const anchor = EditorMoveSelectionAnchorState.getPosition()
    const newSelections = new Uint32Array([position.rowIndex - 1, position.columnIndex, anchor.rowIndex, anchor.columnIndex])
    return {
      ...editor,
      deltaY: newDeltaY,
      maxLineY: newMaxLineY,
      minLineY: newMinLineY,
      selections: newSelections,
    }
  }
  if (position.rowIndex > maxLineY) {
    const diff = maxLineY - minLineY
    const newMinLineY = position.rowIndex - diff
    const newMaxLineY = position.rowIndex
    const newDeltaY = newMinLineY * rowHeight
    const anchor = EditorMoveSelectionAnchorState.getPosition()
    const newSelections = new Uint32Array([anchor.rowIndex, anchor.columnIndex, position.rowIndex + 1, position.columnIndex])
    return {
      ...editor,
      deltaY: newDeltaY,
      maxLineY: newMaxLineY,
      minLineY: newMinLineY,
      selections: newSelections,
    }
  }
  return editor
}

const getCurrentEditor = (uid: number) => {
  const currentState = EditorStates.get(uid)
  return currentState?.newState
}

const continueScrollingAndMovingSelection = async (uid: number) => {
  const editor = getCurrentEditor(uid)
  if (!editor || !editor.autoMoveSelectionState?.hasListener) {
    return
  }
  const { position } = editor.autoMoveSelectionState
  if (position.rowIndex === 0) {
    return
  }
  const newEditor = getNewEditor(editor, position)
  if (editor === newEditor) {
    return
  }
  // @ts-ignore
  const delta = position.rowIndex < editor.minLineY ? -1 : 1
  const updatedEditor = {
    ...newEditor,
    autoMoveSelectionState: {
      hasListener: true,
      position: {
        columnIndex: position.columnIndex,
        rowIndex: position.rowIndex + delta,
      },
    },
  }
  EditorStates.set(editor.uid, editor, updatedEditor)
  RequestAnimationFrame.requestAnimationFrame(() => continueScrollingAndMovingSelection(uid))
  // TODO get editor state
  // if editor is disposed, return and remove animation frame
  // on cursor up, remove animation frame
  //
}

// @ts-ignore
export const moveSelectionPx = async (editor, x, y) => {
  Assert.object(editor)
  Assert.number(x)
  Assert.number(y)
  const position = await EditorPosition.at(editor, x, y)
  const hasAutoMoveSelectionListener = editor.autoMoveSelectionState?.hasListener
  let editorWithAutoMoveSelectionState = editor
  if (!hasAutoMoveSelectionListener && (position.rowIndex < editor.minLineY || position.rowIndex > editor.maxLineY)) {
    editorWithAutoMoveSelectionState = {
      ...editor,
      autoMoveSelectionState: {
        hasListener: true,
        position,
      },
    }
    RequestAnimationFrame.requestAnimationFrame(() => continueScrollingAndMovingSelection(editor.uid))
  }
  return EditorMoveSelection.editorMoveSelection(editorWithAutoMoveSelectionState, position)
}
