import { clamp } from '../Clamp/Clamp.ts'
import { getHorizontalScrollDimensions } from '../GetHorizontalScrollDimensions/GetHorizontalScrollDimensions.ts'
import { getScrollBarSize } from '../ScrollBarFunctions/ScrollBarFunctions.ts'

export const handleScrollBarHorizontalMove = (state: any, eventX: number) => {
  const { handleOffsetX, longestLineWidth, minimumSliderSize } = state
  const { width, x } = getHorizontalScrollDimensions(state)
  const scrollBarWidth = getScrollBarSize(width, longestLineWidth, minimumSliderSize)
  const travel = width - scrollBarWidth
  const percent = travel > 0 ? clamp((eventX - x - handleOffsetX) / travel, 0, 1) : 0
  return {
    ...state,
    deltaX: percent * Math.max(0, longestLineWidth - width),
  }
}
