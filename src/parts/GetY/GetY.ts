export const getY = (row: number, minLineY: number, rowHeight: number) => {
  return (row - minLineY) * rowHeight
}
