export const getScrollBarWidth = (width: number, longestLineWidth: number) => {
  if (width > longestLineWidth) {
    return 0
  }
  return width ** 2 / longestLineWidth
}
