const colorPattern = /\b[a-z]+\b/gi

export const getNamedColorRange = (line: string, columnIndex: number) => {
  for (const match of line.matchAll(colorPattern)) {
    const start = match.index
    const end = start + match[0].length
    if (columnIndex < start || columnIndex > end || line[start - 1] === '-' || line[end] === '-') {
      continue
    }
    const value = match[0]
    if (value.toLowerCase() === 'currentcolor') {
      return undefined
    }
    const context = new OffscreenCanvas(1, 1).getContext('2d')!
    context.fillStyle = '#010203'
    context.fillStyle = value
    if (context.fillStyle === '#010203') {
      return undefined
    }
    return { end, start, value }
  }
  return undefined
}
