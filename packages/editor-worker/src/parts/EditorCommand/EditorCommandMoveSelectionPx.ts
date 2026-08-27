import * as Assert from '../Assert/Assert.ts'
import * as EditorScrolling from '../EditorScrolling/EditorScrolling.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as RequestAnimationFrame from '../RequestAnimationFrame/RequestAnimationFrame.ts'
import * as UpdateDerivedState from '../UpdateDerivedState/UpdateDerivedState.ts'
import * as EditorMoveSelection from './EditorCommandMoveSelection.ts'
import * as EditorPosition from './EditorCommandPosition.ts'

const AutoScrollSpeed = 0.1

export const getSelectionAutoScrollDeltaY = (editor: any, pointerY: number): number => {
  const top = editor.y
  if (pointerY < top) {
    return (pointerY - top) * AutoScrollSpeed
  }
  const bottom = top + editor.height
  if (pointerY > bottom) {
    return (pointerY - bottom) * AutoScrollSpeed
  }
  return 0
}

const getSelectionPointerY = (editor: any, pointerY: number): number => {
  const bottom = editor.height > 0 ? editor.y + editor.height - 1 : editor.y
  return Math.max(editor.y, Math.min(pointerY, bottom))
}

const stopSelectionAutoScroll = (editor: any) => {
  return {
    ...editor,
    isSelectionAutoScrolling: false,
    selectionAutoScrollPointer: {
      x: 0,
      y: 0,
    },
  }
}

export const advanceSelectionAutoScroll = async (editor: any) => {
  const { x, y } = editor.selectionAutoScrollPointer
  const deltaY = getSelectionAutoScrollDeltaY(editor, y)
  if (deltaY === 0) {
    return stopSelectionAutoScroll(editor)
  }
  const scrolledEditor = await EditorScrolling.setDeltaY(editor, editor.deltaY + deltaY)
  if (scrolledEditor === editor) {
    return stopSelectionAutoScroll(editor)
  }
  const selectionY = getSelectionPointerY(scrolledEditor, y)
  const position = await EditorPosition.at(scrolledEditor, x, selectionY)
  return EditorMoveSelection.editorMoveSelectionWithoutScrolling(scrolledEditor, position)
}

const scheduleNextFrame = (editorUid: number): void => {
  RequestAnimationFrame.requestAnimationFrame(() => continueScrollingAndMovingSelection(editorUid))
}

const scheduleNextFrameIfNeeded = (editorUid: number, editor: any): void => {
  if (editor?.isSelecting && editor.isSelectionAutoScrolling) {
    scheduleNextFrame(editorUid)
  }
}

const continueScrollingAndMovingSelection = async (editorUid: number): Promise<void> => {
  const editor = EditorStates.get(editorUid)?.newState
  if (!editor?.isSelecting || !editor.isSelectionAutoScrolling) {
    return
  }
  const nextEditor = await advanceSelectionAutoScroll(editor)
  const currentEditor = EditorStates.get(editorUid)?.newState
  if (currentEditor !== editor) {
    scheduleNextFrameIfNeeded(editorUid, currentEditor)
    return
  }
  const derivedEditor = await UpdateDerivedState.updateDerivedState(editor, nextEditor)
  const latestEditor = EditorStates.get(editorUid)?.newState
  if (latestEditor !== editor) {
    scheduleNextFrameIfNeeded(editorUid, latestEditor)
    return
  }
  EditorStates.set(editor.uid, editor, derivedEditor)
  scheduleNextFrameIfNeeded(editorUid, derivedEditor)
}

export const moveSelectionPx = async (editor: any, x: number, y: number) => {
  Assert.object(editor)
  Assert.number(x)
  Assert.number(y)
  const selectionY = getSelectionPointerY(editor, y)
  const position = await EditorPosition.at(editor, x, selectionY)
  const newEditor = EditorMoveSelection.editorMoveSelection(editor, position)
  const deltaY = getSelectionAutoScrollDeltaY(editor, y)
  if (deltaY === 0) {
    return stopSelectionAutoScroll(newEditor)
  }
  if (!editor.isSelectionAutoScrolling) {
    scheduleNextFrame(editor.uid)
  }
  return {
    ...newEditor,
    isSelectionAutoScrolling: true,
    selectionAutoScrollPointer: { x, y },
  }
}
