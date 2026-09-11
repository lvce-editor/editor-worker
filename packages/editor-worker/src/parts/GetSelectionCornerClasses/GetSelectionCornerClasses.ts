export const getSelectionCornerClasses = (selections: readonly number[]): readonly string[] => {
  const edges = [new Map<number, number[][]>(), new Map<number, number[][]>()]
  for (let i = 0; i < selections.length; i += 4) {
    const [x, y, width, height] = selections.slice(i, i + 4)
    if (width <= 0 || height <= 0) {
      continue
    }
    for (let side = 0; side < 2; side++) {
      const key = y + side * height
      const row = edges[side].get(key) || []
      row.push([x, x + width])
      edges[side].set(key, row)
    }
  }
  // Prefix maxima make overlapping intervals searchable in logarithmic time.
  for (const rows of edges) {
    for (const row of rows.values()) {
      row.sort((a, b) => a[0] - b[0])
      for (let i = 1; i < row.length; i++) {
        row[i][1] = Math.max(row[i][1], row[i - 1][1])
      }
    }
  }
  const result: string[] = []
  for (let i = 0; i < selections.length; i += 4) {
    const [x, y, width, height] = selections.slice(i, i + 4)
    let corners = ''
    if (width > 0 && height > 0) {
      for (const [vertical, horizontal] of [
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 0],
      ]) {
        const row = edges[1 - vertical].get(y + vertical * height) || []
        const edge = x + horizontal * width
        let low = 0
        let high = row.length
        while (low < high) {
          const mid = (low + high) >>> 1
          if (horizontal ? row[mid][0] < edge : row[mid][0] <= edge) {
            low = mid + 1
          } else {
            high = mid
          }
        }
        if (!low || (horizontal ? row[low - 1][1] < edge : row[low - 1][1] <= edge)) {
          corners += ` Selection${vertical ? 'Bottom' : 'Top'}${horizontal ? 'Right' : 'Left'}`
        }
      }
    }
    result.push(corners)
  }
  return result
}
