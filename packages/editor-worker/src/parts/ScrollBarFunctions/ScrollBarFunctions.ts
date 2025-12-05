export * from '../GetScrollBarOffset/GetScrollBarOffset.ts'
export * from '../GetScrollBarSize/GetScrollBarSize.ts'
export * from '../GetScrollBarWidth/GetScrollBarWidth.ts'

export const getNewDeltaPercent = (height: number, scrollBarHeight: number, relativeY: number) => {
  const halfScrollBarHeight = scrollBarHeight / 2
  if (relativeY <= halfScrollBarHeight) {
    // clicked at top
    return {
      handleOffset: relativeY,
      percent: 0,
    }
  }
  if (relativeY <= height - halfScrollBarHeight) {
    // clicked in middle
    return {
      handleOffset: halfScrollBarHeight,
      percent: (relativeY - halfScrollBarHeight) / (height - scrollBarHeight),
    }
  }
  // clicked at bottom
  return {
    handleOffset: scrollBarHeight - height + relativeY,
    percent: 1,
  }
}
