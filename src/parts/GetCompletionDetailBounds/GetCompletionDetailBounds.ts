export interface Bounds {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}

export const getCompletionDetailBounds = (completionBounds: Bounds) => {
  const borderWidth = 1
  return {
    x: completionBounds.x + completionBounds.width - borderWidth,
    y: completionBounds.y,
    width: 100,
    height: 100,
  }
}
