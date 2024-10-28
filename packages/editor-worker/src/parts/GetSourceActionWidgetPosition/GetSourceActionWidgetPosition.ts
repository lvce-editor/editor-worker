import * as GetPositionAtCursor from '../GetPositionAtCursor/GetPositionAtCursor.ts'

export const getSourceActionWidgetPosition = (editor: any) => {
  const width = 300
  const height = 150
  const cursor = GetPositionAtCursor.getPositionAtCursor(editor)
  const x = cursor.x
  const y = cursor.y
  return {
    x,
    y,
    width,
    height,
  }
}
