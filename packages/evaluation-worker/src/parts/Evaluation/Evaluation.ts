import * as EvaluateText from '../EvaluateText/EvaluateText.ts'
import * as ParentRpc from '../ParentRpc/ParentRpc.ts'

const debounceMs = 120

interface PendingEvaluation {
  readonly languageId: string
  readonly runId: number
  readonly text: string
  readonly timer: ReturnType<typeof setTimeout>
}

const pendingByEditor = new Map<number, PendingEvaluation>()

const isJavaScriptLanguage = (languageId: string): boolean => {
  return languageId === 'javascript' || languageId === 'js' || languageId === 'mjs'
}

const flush = async (editorUid: number): Promise<void> => {
  const pending = pendingByEditor.get(editorUid)
  if (!pending) {
    return
  }
  pendingByEditor.delete(editorUid)
  const previews = isJavaScriptLanguage(pending.languageId) ? await EvaluateText.evaluateText(pending.text) : []
  await ParentRpc.invoke('Evaluation.applyResult', editorUid, pending.runId, previews)
}

export const initialize = async (listenerRpcId: number, listenerType: number): Promise<void> => {
  await ParentRpc.invoke('Listener.registerListener', listenerType, listenerRpcId)
}

export const handleEditorChanged = async (
  editorUid: number,
  _uri: string,
  _changes: readonly unknown[],
  text: string,
  languageId: string,
  runId: number,
): Promise<void> => {
  const previous = pendingByEditor.get(editorUid)
  if (previous) {
    clearTimeout(previous.timer)
  }
  const timer = setTimeout(() => {
    flush(editorUid).catch((error) => {
      console.error('Failed to evaluate previews', error)
    })
  }, debounceMs)
  pendingByEditor.set(editorUid, {
    languageId,
    runId,
    text,
    timer,
  })
}
