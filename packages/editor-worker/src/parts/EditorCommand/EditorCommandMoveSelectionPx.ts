import * as Assert from '../Assert/Assert.ts'
import * as EditorScrolling from '../EditorScrolling/EditorScrolling.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as RequestAnimationFrame from '../RequestAnimationFrame/RequestAnimationFrame.ts'
import * as UpdateDerivedState from '../UpdateDerivedState/UpdateDerivedState.ts'
import * as EditorMoveSelection from './EditorCommandMoveSelection.ts'
import * as EditorPosition from './EditorCommandPosition.ts'

export const advanceSelectionAutoScroll = async (editor: any) => {
  const { x, y } = editor.selectionAutoMovePosition
  const bottom = editor.y + editor.height
  if (y >= editor.y && y <= bottom) {
    return { ...editor, hasListener: false }
  }
  const deltaY = (y - (y < editor.y ? editor.y : bottom)) * 0.1
  const scrolledEditor = await EditorScrolling.setDeltaY(editor, editor.deltaY + deltaY)
  if (scrolledEditor === editor) {
    return { ...editor, hasListener: false }
  }
  const selectionY = Math.max(editor.y, Math.min(y, bottom - 1))
  const position = await EditorPosition.at(scrolledEditor, x, selectionY)
  return EditorMoveSelection.editorMoveSelection(scrolledEditor, position, false)
}

const continueScrollingAndMovingSelection = async (editorUid: number): Promise<void> => {
  const editor = EditorStates.get(editorUid)?.newState
  if (!editor?.isSelecting || !editor.hasListener) {
    return
  }
  const nextEditor = await advanceSelectionAutoScroll(editor)
  const derivedEditor = await UpdateDerivedState.updateDerivedState(editor, nextEditor)
  const currentEditor = EditorStates.get(editorUid)?.newState
  if (currentEditor !== editor) {
    if (currentEditor?.isSelecting && currentEditor.hasListener) {
      RequestAnimationFrame.requestAnimationFrame(() => continueScrollingAndMovingSelection(editorUid))
    }
    return
  }
  EditorStates.set(editor.uid, editor, derivedEditor)
  if (derivedEditor.hasListener) {
    RequestAnimationFrame.requestAnimationFrame(() => continueScrollingAndMovingSelection(editorUid))
  }
}

export const moveSelectionPx = async (editor: any, x: number, y: number) => {
  Assert.object(editor)
  Assert.number(x)
  Assert.number(y)
  const bottom = editor.y + editor.height
  const selectionY = Math.max(editor.y, Math.min(y, bottom - 1))
  const position = await EditorPosition.at(editor, x, selectionY)
  const newEditor = EditorMoveSelection.editorMoveSelection(editor, position)
  if (y >= editor.y && y <= bottom) {
    return { ...newEditor, hasListener: false }
  }
  if (!editor.hasListener) {
    RequestAnimationFrame.requestAnimationFrame(() => continueScrollingAndMovingSelection(editor.uid))
  }
  return {
    ...newEditor,
    hasListener: true,
    selectionAutoMovePosition: { x, y },
  }
}
