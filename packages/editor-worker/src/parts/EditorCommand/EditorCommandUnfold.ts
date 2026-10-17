import * as EditorFolding from '../EditorFolding/EditorFolding.ts'

export const unfold = (editor: any) => {
  const { foldingRanges = [], primarySelectionIndex = 0, selections } = editor
  const rowIndex = selections[primarySelectionIndex]
  const newRanges = EditorFolding.removeRangeAt(foldingRanges, rowIndex)
  if (newRanges === foldingRanges) {
    return editor
  }
  return EditorFolding.updateLayout(editor, newRanges)
}
