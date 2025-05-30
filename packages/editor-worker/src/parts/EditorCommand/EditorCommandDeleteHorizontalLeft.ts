import * as Editor from '../Editor/Editor.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import * as EditorSelection from '../EditorSelection/EditorSelection.ts'
import * as GetDeleteHorizontalLeftChanges from '../GetDeleteHorizonatlLeftChanges/GetDeleteHorizontalLeftChanges.ts'
import * as IsAllAutoClosingPairDelete from '../IsAllAutoClosingPairDelete/IsAllAutoClosingPairDelete.ts'
import * as EditorDelta from './EditorCommandDelta.ts'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.ts'

const deleteLeftWithAutoClose = (editor: any) => {
  const { selections, lines } = editor
  for (let i = 0; i < selections.length; i += 4) {
    selections[i + 1]++
    selections[i + 3]++
  }
  const changes = GetDeleteHorizontalLeftChanges.getChanges(lines, selections, EditorDelta.twoCharactersLeft)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}

export const editorDeleteHorizontalLeft = (editor: any, getDelta: any) => {
  const { autoClosingRanges = [], selections, lines } = editor
  if (IsAllAutoClosingPairDelete.isAllAutoClosingPairDelete(autoClosingRanges, selections)) {
    return deleteLeftWithAutoClose(editor)
  }
  if (EditorSelection.isEverySelectionEmpty(selections)) {
    const changes = GetDeleteHorizontalLeftChanges.getChanges(lines, selections, getDelta)
    return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
  }
  const changes = editorReplaceSelections(editor, [''], EditOrigin.DeleteLeft)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
