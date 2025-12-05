export interface Bounds {
  readonly height: number
  readonly width: number
  readonly x: number
  readonly y: number
}

export const getCompletionDetailBounds = (completionBounds: Bounds, borderSize: number) => {
  return {
    height: 100,
    width: 100,
    x: completionBounds.x + completionBounds.width - borderSize,
    y: completionBounds.y,
  }
}
