import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { EditorLifecycle } from '../EditorLifecycle/EditorLifecycle.ts'
import type { EditorState } from '../State/State.ts'
import * as EditorCommandQueue from '../EditorCommandQueue/EditorCommandQueue.ts'
import * as Editors from '../EditorStates/EditorStates.ts'
import { getEditorGutterDecorations } from '../GetEditorGutterDecorations/GetEditorGutterDecorations.ts'
import { updateDerivedState } from '../UpdateDerivedState/UpdateDerivedState.ts'

interface Refresh {
  pending: EditorState | undefined
  running: boolean
}

const refreshes = new WeakMap<EditorLifecycle, Refresh>()

const isCurrent = (editor: EditorState | undefined, snapshot: EditorState): editor is EditorState =>
  Boolean(
    editor &&
    editor.lifecycle === snapshot.lifecycle &&
    !editor.lifecycle?.disposed &&
    editor.lines === snapshot.lines &&
    editor.gutterDecorations === snapshot.gutterDecorations &&
    editor.uri === snapshot.uri &&
    editor.languageId === snapshot.languageId &&
    editor.applicationId === snapshot.applicationId,
  )

const refresh = async (request: Refresh): Promise<void> => {
  try {
    while (request.pending) {
      const snapshot = request.pending
      request.pending = undefined
      if (snapshot.lifecycle?.disposed) {
        continue
      }
      const gutterDecorations = await getEditorGutterDecorations(snapshot)
      const changed = await EditorCommandQueue.enqueue(snapshot.uid, async () => {
        const current = Editors.get(snapshot.uid)?.newState
        if (
          !isCurrent(current, snapshot) ||
          (current.gutterDecorations.length === gutterDecorations.length &&
            gutterDecorations.every(
              (item, index) => item.rowIndex === current.gutterDecorations[index].rowIndex && item.type === current.gutterDecorations[index].type,
            ))
        ) {
          return false
        }
        const next = await updateDerivedState(current, { ...current, gutterDecorations })
        // Derived state may await layout RPCs while an asynchronous render consumes the baseline.
        const latest = Editors.get(snapshot.uid)
        if (!isCurrent(latest?.newState, snapshot)) {
          return false
        }
        Editors.set(snapshot.uid, latest.oldState, next)
        return true
      })
      if (changed) {
        await RendererWorker.invoke('Editor.renderPending', snapshot.uid)
      }
    }
  } catch (error) {
    console.warn('Failed to refresh gutter decorations:', error)
  } finally {
    request.running = false
    if (request.pending) {
      request.running = true
      void refresh(request)
    }
  }
}

export const schedule = (editor: EditorState): void => {
  const { lifecycle } = editor
  if (!lifecycle || lifecycle.disposed) {
    return
  }
  let request = refreshes.get(lifecycle)
  if (!request) {
    request = { pending: undefined, running: false }
    refreshes.set(lifecycle, request)
  }
  request.pending = editor
  if (!request.running) {
    request.running = true
    void refresh(request)
  }
}
