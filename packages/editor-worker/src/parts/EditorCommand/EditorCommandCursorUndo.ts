import type { EditorState } from '../State/State.ts'
import * as Editor from '../Editor/Editor.ts'

export const cursorUndo = (editor: EditorState): EditorState => {
  const { cursorUndoStack = [] } = editor
  if (cursorUndoStack.length === 0) {
    return editor
  }
  const selections = cursorUndoStack.at(-1)!
  const newEditor = {
    ...editor,
    cursorUndoStack: cursorUndoStack.slice(0, -1),
  }
  return Editor.scheduleSelections(newEditor, selections)
}
