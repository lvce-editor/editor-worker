import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.ts'

interface Dimensions {
  readonly height?: number
  readonly width?: number
  readonly x?: number
  readonly y?: number
}

interface ResizeState {
  readonly columnWidth: number
  readonly deltaY: number
  readonly height: number
  readonly itemHeight: number
  readonly lines: readonly string[]
  readonly minLineY: number
  readonly minimumSliderSize: number
  readonly rowHeight: number
  readonly width: number
  readonly x: number
  readonly y: number
}

export const resize = <T extends ResizeState>(state: T, dimensions: Dimensions, columnWidth: number = state.columnWidth): T => {
  const x = dimensions.x ?? state.x
  const y = dimensions.y ?? state.y
  const width = dimensions.width ?? state.width
  const height = dimensions.height ?? state.height
  const numberOfVisibleLines = Math.floor(height / state.itemHeight)
  const total = state.lines.length
  const finalY = Math.max(total - numberOfVisibleLines, 0)
  const finalDeltaY = finalY * state.itemHeight
  const deltaY = Math.min(state.deltaY, finalDeltaY)
  const minLineY = Math.floor(deltaY / state.itemHeight)
  const maxLineY = Math.min(minLineY + numberOfVisibleLines, total)
  const contentHeight = total * state.rowHeight
  const scrollBarHeight = ScrollBarFunctions.getScrollBarSize(height, contentHeight, state.minimumSliderSize)
  return {
    ...state,
    columnWidth,
    deltaY,
    finalDeltaY,
    finalY,
    height,
    maxLineY,
    minLineY,
    numberOfVisibleLines,
    scrollBarHeight,
    width,
    x,
    y,
  }
}
