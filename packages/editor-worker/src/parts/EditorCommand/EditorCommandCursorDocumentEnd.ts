import * as Editor from '../Editor/Editor.ts'

export const cursorDocumentEnd = (editor: any) => {
  const { lines, selections } = editor
  const rowIndex = lines.length - 1
  const columnIndex = lines[rowIndex].length
  const newSelections = new Uint32Array(selections.length)
  for (let i = 0; i < newSelections.length; i += 4) {
    newSelections[i] = rowIndex
    newSelections[i + 1] = columnIndex
    newSelections[i + 2] = rowIndex
    newSelections[i + 3] = columnIndex
  }
  return Editor.scheduleSelections(editor, newSelections)
}
