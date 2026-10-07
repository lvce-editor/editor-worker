import type { EditorState } from '../State/State.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import { emptyIncrementalEdits } from '../EmptyIncrementalEdits/EmptyIncrementalEdits.ts'
import * as SyntaxHighlightingWorker from '../SyntaxHighlightingWorker/SyntaxHighlightingWorker.ts'

export const getIncrementalEdits = async (oldState: EditorState, newState: EditorState) => {
  if (newState.lifecycle?.disposed || !newState.undoStack) {
    return emptyIncrementalEdits
  }
  if (oldState.undoStack === newState.undoStack) {
    return emptyIncrementalEdits
  }
  const lastChanges = newState.undoStack.at(-1)
  if (lastChanges && lastChanges.length === 1) {
    const lastChange = lastChanges[0]
    if (lastChange.origin === EditOrigin.EditorType) {
      const { rowIndex } = lastChange.start
      const { lines } = newState
      const oldLine = oldState.lines[rowIndex]
      const newLine = lines[rowIndex]
      // Renderer edit offsets address full lines, so clipped rows need a fresh visible window.
      const threshold = newState.horizontalVirtualizationThreshold ?? 500
      if (newState.deltaX !== 0 || oldLine.length > threshold || newLine.length > threshold) {
        return emptyIncrementalEdits
      }
      // @ts-ignore
      const incrementalEdits = await SyntaxHighlightingWorker.invoke(
        // @ts-ignore
        'TokenizeIncremental.tokenizeIncremental',
        newState.uid,
        // @ts-ignore
        newState.languageId,
        oldLine,
        newLine,
        rowIndex,
        newState.minLineY,
      )
      if (incrementalEdits && incrementalEdits.length === 1) {
        return incrementalEdits
      }
    }
  }
  return emptyIncrementalEdits
}
