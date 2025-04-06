import * as GetPositionAtCursor from '../GetPositionAtCursor/GetPositionAtCursor.ts'

export const getRenamePosition = (editor: any) => {
  const width = 300
  const height = 30
  const paddingTop = 10
  const cursor = GetPositionAtCursor.getPositionAtCursor(editor)
  const { x } = cursor
  const y = cursor.y + paddingTop
  return {
    y,
    x,
    width,
    height,
  }
}
