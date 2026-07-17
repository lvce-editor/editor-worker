import * as Editor from '../Editor/Editor.ts'

export const cursorDocumentStart = (editor: any) => {
  const newSelections = new Uint32Array(editor.selections.length)
  return Editor.scheduleSelections(editor, newSelections)
}
