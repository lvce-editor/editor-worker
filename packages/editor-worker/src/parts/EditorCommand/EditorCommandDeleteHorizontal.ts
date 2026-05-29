// @ts-ignore
import * as Editor from './Editor.ts'

// @ts-ignore
export const editorDeleteHorizontalRight = (editor, getDelta) => {
  if (Editor.hasSelection(editor)) {
    return
  }
  const { lines } = editor
  const { rowIndex } = editor.cursor
  const { columnIndex } = editor.cursor
  if (columnIndex >= lines[rowIndex].length) {
    if (rowIndex >= lines.length) {
      return
    }
    return
  }
}
