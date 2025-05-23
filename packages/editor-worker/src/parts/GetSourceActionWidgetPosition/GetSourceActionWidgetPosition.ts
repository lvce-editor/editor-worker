import * as GetPositionAtCursor from '../GetPositionAtCursor/GetPositionAtCursor.ts'

const getHeight = (sourceActionCount: number): number => {
  if (sourceActionCount === 0) {
    return 45
  }
  return 150
}

export const getSourceActionWidgetPosition = (editor: any, sourceActionCount: number) => {
  const width = 300
  const height = getHeight(sourceActionCount)
  const cursor = GetPositionAtCursor.getPositionAtCursor(editor)
  const { x } = cursor
  const { y } = cursor
  // TODO support virtual list
  return {
    x,
    y,
    width,
    height,
  }
}
