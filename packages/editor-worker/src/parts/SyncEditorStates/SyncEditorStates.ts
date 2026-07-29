import type { EditorState } from '../State/State.ts'
import { emptyIncrementalEdits } from '../EmptyIncrementalEdits/EmptyIncrementalEdits.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as InverseChange from '../InverseChange/InverseChange.ts'
import { transformSelections } from '../TransformSelections/TransformSelections.ts'
import * as UpdateDerivedState from '../UpdateDerivedState/UpdateDerivedState.ts'

const hasDocumentChange = (oldState: EditorState, newState: EditorState): boolean => {
  return (
    oldState.lines !== newState.lines ||
    oldState.modified !== newState.modified ||
    oldState.redoStack !== newState.redoStack ||
    oldState.undoStack !== newState.undoStack
  )
}

const getAppliedChanges = (oldState: EditorState, newState: EditorState): readonly any[] => {
  const oldUndoStack = oldState.undoStack || []
  const newUndoStack = newState.undoStack || []
  const oldRedoStack = oldState.redoStack || []
  const newRedoStack = newState.redoStack || []
  if (newUndoStack.length > oldUndoStack.length) {
    return newUndoStack.at(-1) || []
  }
  if (newRedoStack.length > oldRedoStack.length) {
    const undoneChanges = newRedoStack.at(-1) || []
    return undoneChanges.map(InverseChange.inverseChange)
  }
  return []
}

export const syncEditorStates = async (sourceUid: number, oldState: EditorState, newState: EditorState): Promise<void> => {
  if (oldState.initial || oldState.uri !== newState.uri || !hasDocumentChange(oldState, newState)) {
    return
  }

  const changes = oldState.lines === newState.lines ? [] : getAppliedChanges(oldState, newState)
  for (const key of EditorStates.getKeys()) {
    const uid = Number(key)
    if (uid === sourceUid) {
      continue
    }
    const instance = EditorStates.get(uid)
    const editor = instance?.newState
    if (!instance || !editor || editor.initial || editor.uri !== newState.uri) {
      continue
    }
    const synchronizedEditor: EditorState = {
      ...editor,
      decorations: newState.decorations,
      diagnostics: newState.diagnostics,
      incrementalEdits: emptyIncrementalEdits,
      invalidStartIndex: Math.min(editor.invalidStartIndex, newState.invalidStartIndex),
      lines: newState.lines,
      modified: newState.modified,
      redoStack: newState.redoStack,
      selections: changes.length === 0 ? editor.selections : transformSelections(editor.selections, changes),
      undoStack: newState.undoStack,
      visualDecorations: newState.visualDecorations,
    }
    const derivedEditor = await UpdateDerivedState.updateDerivedState(editor, synchronizedEditor)
    EditorStates.set(uid, instance.oldState, derivedEditor)
  }
}
