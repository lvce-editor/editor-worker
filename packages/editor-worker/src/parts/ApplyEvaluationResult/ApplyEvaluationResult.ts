import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as EditorState from '../EditorStates/EditorStates.ts'

export const applyEvaluationResult = async (editorUid: number, runId: number, previews: readonly any[]): Promise<void> => {
  const latest = EditorState.get(editorUid)
  if (!latest) {
    return
  }
  if (latest.newState.evaluationRunId !== runId) {
    return
  }
  const newEditor = {
    ...latest.newState,
    evaluationPreviews: previews,
  }
  EditorState.set(editorUid, latest.oldState, newEditor)
  await RendererWorker.invoke('Editor.rerender', editorUid)
}
