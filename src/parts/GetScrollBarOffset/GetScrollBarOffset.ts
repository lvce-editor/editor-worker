export const getScrollBarOffset = (delta: number, finalDelta: number, size: number, scrollBarSize: number) => {
  const scrollBarOffset = (delta / finalDelta) * (size - scrollBarSize)
  return scrollBarOffset
}

export const getScrollBarY = getScrollBarOffset