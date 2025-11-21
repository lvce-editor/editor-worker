import * as Editor from '../Editor/Editor.ts'
import { getNewSelectionsWordRight } from '../GetNewSelectionsWordRight/GetNewSelectionsWordRight.ts'

export const editorCursorHorizontalRight = (editor: any, getDelta: any) => {
  const { lines, selections } = editor
  const newSelections = getNewSelectionsWordRight(selections, lines, getDelta)
  return Editor.scheduleSelections(editor, newSelections)
}
