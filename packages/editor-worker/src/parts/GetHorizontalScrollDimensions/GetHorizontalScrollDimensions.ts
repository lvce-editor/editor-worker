export const getHorizontalScrollDimensions = ({
  gutterWidth = 0,
  width,
  x = 0,
}: {
  readonly width: number
  readonly x?: number
  readonly gutterWidth?: number
}) => {
  return { width: Math.max(0, width - gutterWidth), x: x + gutterWidth }
}
