import * as Editor from '../Editor/Editor.ts'
import * as EditorSelection from '../EditorSelection/EditorSelection.ts'

export const cancelSelection = (editor: any) => {
  const { selections } = editor
  if (selections.length === 4 && selections[0] === selections[2] && selections[1] === selections[3]) {
    return editor
  }
  const newSelections = EditorSelection.alloc(4)
  EditorSelection.moveRangeToPosition(newSelections, 0, selections[0], selections[1])
  return Editor.scheduleSelections(editor, newSelections)
}
