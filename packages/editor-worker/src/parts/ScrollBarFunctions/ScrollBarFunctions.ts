export * from '../GetScrollBarOffset/GetScrollBarOffset.ts'
export * from '../GetScrollBarSize/GetScrollBarSize.ts'
export * from '../GetScrollBarWidth/GetScrollBarWidth.ts'

export const getNewDeltaPercent = (height: number, scrollBarHeight: number, relativeY: number) => {
  const halfScrollBarHeight = scrollBarHeight / 2
  if (relativeY <= halfScrollBarHeight) {
    // clicked at top
    return {
      percent: 0,
      handleOffset: relativeY,
    }
  }
  if (relativeY <= height - halfScrollBarHeight) {
    // clicked in middle
    return {
      percent: (relativeY - halfScrollBarHeight) / (height - scrollBarHeight),
      handleOffset: halfScrollBarHeight,
    }
  }
  // clicked at bottom
  return {
    percent: 1,
    handleOffset: scrollBarHeight - height + relativeY,
  }
}
