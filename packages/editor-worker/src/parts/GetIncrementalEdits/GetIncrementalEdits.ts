import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import * as SyntaxHighlightingWorker from '../SyntaxHighlightingWorker/SyntaxHighlightingWorker.ts'

export const getIncrementalEdits = async (oldState: any, newState: any) => {
  if (!newState.undoStack) {
    return undefined
  }
  const lastChanges = newState.undoStack.at(-1)
  if (lastChanges && lastChanges.length === 1) {
    const lastChange = lastChanges[0]
    if (lastChange.origin === EditOrigin.EditorType) {
      const { rowIndex } = lastChange.start
      const { lines } = newState
      const oldLine = oldState.lines[rowIndex]
      const newLine = lines[rowIndex]
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
  return undefined
}
