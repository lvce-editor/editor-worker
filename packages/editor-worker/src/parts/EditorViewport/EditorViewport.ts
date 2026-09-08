export const getScrollOffset = (deltaY: number, rowHeight: number): number => {
  return rowHeight > 0 ? deltaY % rowHeight : 0
}

export const getRenderedLineCount = (height: number, rowHeight: number, deltaY: number): number => {
  return rowHeight > 0 ? Math.ceil((height + getScrollOffset(deltaY, rowHeight)) / rowHeight) : 0
}
