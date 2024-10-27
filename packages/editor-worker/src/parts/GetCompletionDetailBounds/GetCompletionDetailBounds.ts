export interface Bounds {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}

export const getCompletionDetailBounds = (completionBounds: Bounds, borderSize: number) => {
  return {
    x: completionBounds.x + completionBounds.width - borderSize,
    y: completionBounds.y,
    width: 100,
    height: 100,
  }
}
