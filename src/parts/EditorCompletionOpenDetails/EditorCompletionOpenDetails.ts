import * as GetCompletionState from '../GetCompletionState/GetCompletionState.ts'
import * as GetCompletionDetailState from '../GetCompletionDetailState/GetCompletionDetailState.ts'

export const openDetails = (editor: any) => {
  const child = GetCompletionState.getCompletionState(editor)
  if (!child) {
    return editor
  }
  const detailState = GetCompletionDetailState.getCompletionDetailState(editor)
  if (detailState) {
    return editor
  }
  console.log('open details')
  // TODO when completion details are open, close them
  // TODO when completion details are opening, close them
  // TODO when completion details are closed, open them
  return editor
}
