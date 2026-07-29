import { editorDiagnosticEffect } from '../EditorDiagnosticEffect/EditorDiagnosticEffect.ts'
import * as Editors from '../EditorStates/EditorStates.ts'
import { syncEditorStates } from '../SyncEditorStates/SyncEditorStates.ts'
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
      await syncEditorStates(uid, state, finalEditor)
      return finalEditor
    } finally {
      resolve()
      if (queues[queueKey] === next) {
        delete queues[queueKey]
      }
    }
  }
