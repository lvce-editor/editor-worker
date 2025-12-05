import * as EditorCursorVertical from './EditorCommandCursorVertical.ts'

const getEdgePosition = (editor: any) => {
  return {
    columnIndex: 0,
    rowIndex: 0,
  }
}

const getPosition = (selection: any) => {
  return selection.start
}

export const cursorUp = (editor: any) => {
  return EditorCursorVertical.cursorVertical(editor, getPosition, getEdgePosition, -1)
}
