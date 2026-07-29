import type { EditorState } from '../State/State.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'
import { emptyIncrementalEdits } from '../EmptyIncrementalEdits/EmptyIncrementalEdits.ts'
import * as UpdateDerivedState from '../UpdateDerivedState/UpdateDerivedState.ts'

export const syncEditorStates = async (sourceUid: number, oldState: EditorState, newState: EditorState): Promise<void> => {
  if (
    oldState.initial ||
    oldState.uri !== newState.uri ||
    (oldState.lines === newState.lines &&
      oldState.modified === newState.modified &&
      oldState.redoStack === newState.redoStack &&
      oldState.undoStack === newState.undoStack)
  ) {
    return
  }

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
      undoStack: newState.undoStack,
      visualDecorations: newState.visualDecorations,
    }
    const derivedEditor = await UpdateDerivedState.updateDerivedState(editor, synchronizedEditor)
    EditorStates.set(uid, instance.oldState, derivedEditor)
  }
}
