import * as EditorCursorVertical from './EditorCommandCursorVertical.ts'

const getEdgePosition = (editor: any) => {
  return {
    rowIndex: 0,
    columnIndex: 0,
  }
}

const getPosition = (selection: any) => {
  return selection.start
}

export const cursorUp = (editor: any) => {
  return EditorCursorVertical.cursorVertical(editor, getPosition, getEdgePosition, -1)
}
