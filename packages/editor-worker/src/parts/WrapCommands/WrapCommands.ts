import { editorDiagnosticEffect } from '../EditorDiagnosticEffect/EditorDiagnosticEffect.ts'
import * as Editors from '../EditorStates/EditorStates.ts'
import * as UpdateDerivedState from '../UpdateDerivedState/UpdateDerivedState.ts'

const queues: (Promise<void> | undefined)[] = []

// TODO wrap commands globally, not per editor
// TODO only store editor state in editor worker, not in renderer worker also

export const wrapCommand =
  (fn: any) =>
  async (uid: number, ...args: any[]) => {
    const previous = queues[uid]
    const { promise: next, resolve } = Promise.withResolvers<void>()
    queues[uid] = next
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
      if (!editorDiagnosticEffect.isActive(state, newEditorWithDerivedState)) {
        return newEditorWithDerivedState
      }
      const newEditorWithDiagnostics = await editorDiagnosticEffect.apply(newEditorWithDerivedState)
      if (!Editors.get(uid)) {
        return newEditorWithDiagnostics
      }
      Editors.set(uid, state, newEditorWithDiagnostics)
      return newEditorWithDiagnostics
    } finally {
      resolve()
      if (queues[uid] === next) {
        queues[uid] = undefined
      }
    }
  }
