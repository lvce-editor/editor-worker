import { editorDiagnosticEffect } from '../EditorDiagnosticEffect/EditorDiagnosticEffect.ts'
import * as Editors from '../EditorStates/EditorStates.ts'
import { emptyIncrementalEdits } from '../EmptyIncrementalEdits/EmptyIncrementalEdits.ts'
import * as UpdateDerivedState from '../UpdateDerivedState/UpdateDerivedState.ts'

const queues: Record<string, Promise<void> | undefined> = {}

// TODO wrap commands globally, not per editor
// TODO only store editor state in editor worker, not in renderer worker also

export const wrapCommand =
  (fn: any) =>
  async (uid: number, ...args: any[]) => {
    const initialInstance = Editors.get(uid)
    const queueKey = initialInstance?.newState.uri || uid
    const previous = queues[queueKey]
    const { promise: next, resolve } = Promise.withResolvers<void>()
    queues[queueKey] = next
    if (previous) {
      await previous
    }
    try {
      const oldInstance = Editors.get(uid)
      const state = oldInstance.newState
      const newEditor = await fn(state, ...args)
      if (state === newEditor) {
        return newEditor
      }
      const newEditorWithDerivedState = await UpdateDerivedState.updateDerivedState(state, newEditor)
      Editors.set(uid, state, newEditorWithDerivedState)
      let finalEditor = newEditorWithDerivedState
      if (editorDiagnosticEffect.isActive(state, newEditorWithDerivedState)) {
        finalEditor = await editorDiagnosticEffect.apply(newEditorWithDerivedState)
        if (!Editors.get(uid)) {
          return finalEditor
        }
        Editors.set(uid, state, finalEditor)
      }
      const { initial, lines, modified, redoStack, undoStack, uri } = state
      if (
        !initial &&
        uri === finalEditor.uri &&
        (lines !== finalEditor.lines ||
          modified !== finalEditor.modified ||
          redoStack !== finalEditor.redoStack ||
          undoStack !== finalEditor.undoStack)
      ) {
        for (const key of Editors.getKeys()) {
          const otherUid = Number(key)
          const instance = Editors.get(otherUid)
          const editor = instance?.newState
          if (otherUid === uid || !instance || !editor || editor.initial || editor.uri !== finalEditor.uri) {
            continue
          }
          const synchronizedEditor = await UpdateDerivedState.updateDerivedState(editor, {
            ...editor,
            decorations: finalEditor.decorations,
            diagnostics: finalEditor.diagnostics,
            incrementalEdits: emptyIncrementalEdits,
            invalidStartIndex: Math.min(editor.invalidStartIndex, finalEditor.invalidStartIndex),
            lines: finalEditor.lines,
            modified: finalEditor.modified,
            redoStack: finalEditor.redoStack,
            undoStack: finalEditor.undoStack,
            visualDecorations: finalEditor.visualDecorations,
          })
          Editors.set(otherUid, instance.oldState, synchronizedEditor)
        }
      }
      return finalEditor
    } finally {
      resolve()
      if (queues[queueKey] === next) {
        delete queues[queueKey]
      }
    }
  }
