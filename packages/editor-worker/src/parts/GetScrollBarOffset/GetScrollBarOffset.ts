export const getScrollBarOffset = (delta: number, finalDelta: number, size: number, scrollBarSize: number) => {
  const scrollBarOffset = (delta / finalDelta) * (size - scrollBarSize)
  if (!Number.isFinite(scrollBarOffset)) {
    return 0
  }
  return scrollBarOffset
}

export const getScrollBarY = getScrollBarOffset
