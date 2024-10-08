import * as EditorCompletionCloseDetails from '../EditorCompletionCloseDetails/EditorCompletionCloseDetails.ts'
import * as EditorCompletionOpenDetails from '../EditorCompletionOpenDetails/EditorCompletionOpenDetails.ts'
import * as GetCompletionDetailState from '../GetCompletionDetailState/GetCompletionDetailState.ts'

export const toggleDetails = (editor: any) => {
  const child = GetCompletionDetailState.getCompletionDetailState(editor)
  if (!child) {
    return EditorCompletionOpenDetails.openDetails(editor)
  }
  return EditorCompletionCloseDetails.closeDetails(editor)
}
