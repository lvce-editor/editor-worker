import * as GetCompletionState from '../GetCompletionState/GetCompletionState.ts'

export const openDetails = (editor: any) => {
  const child = GetCompletionState.getCompletionState(editor)
  if (!child) {
    return editor
  }
  console.log('open details')
  // TODO when completion details are open, close them
  // TODO when completion details are opening, close them
  // TODO when completion details are closed, open them
  return editor
}
