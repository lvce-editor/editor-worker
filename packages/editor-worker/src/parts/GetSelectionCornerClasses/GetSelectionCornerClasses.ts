type Interval = readonly [number, number]

const addInterval = (rows: Map<number, Interval[]>, y: number, interval: Interval): void => {
  const row = rows.get(y)
  if (row) {
    row.push(interval)
  } else {
    rows.set(y, [interval])
  }
}

const covers = (row: readonly Interval[] = [], x: number, left: boolean): boolean => {
  // Find the last interval beginning before this edge (inclusive for left corners).
  let low = 0
  let high = row.length
  while (low < high) {
    const mid = (low + high) >>> 1
    if (left ? row[mid][0] <= x : row[mid][0] < x) {
      low = mid + 1
    } else {
      high = mid
    }
  }
  return low > 0 && (left ? row[low - 1][1] > x : row[low - 1][1] >= x)
}

const normalize = (rows: Map<number, Interval[]>): void => {
  for (const [y, intervals] of rows) {
    intervals.sort((a, b) => a[0] - b[0])
    const merged: Interval[] = []
    for (const interval of intervals) {
      const last = merged.at(-1)
      if (last && interval[0] <= last[1]) {
        merged[merged.length - 1] = [last[0], Math.max(last[1], interval[1])]
      } else {
        merged.push(interval)
      }
    }
    rows.set(y, merged)
  }
}

export const getSelectionCornerClasses = (selections: readonly number[]): readonly string[] => {
  const tops = new Map<number, Interval[]>()
  const bottoms = new Map<number, Interval[]>()
  for (let i = 0; i < selections.length; i += 4) {
    const [x, y, width, height] = selections.slice(i, i + 4)
    if (width > 0 && height > 0) {
      addInterval(tops, y, [x, x + width])
      addInterval(bottoms, y + height, [x, x + width])
    }
  }
  normalize(tops)
  normalize(bottoms)
  const result: string[] = []
  for (let i = 0; i < selections.length; i += 4) {
    const [x, y, width, height] = selections.slice(i, i + 4)
    let corners = ''
    if (width > 0 && height > 0) {
      if (!covers(bottoms.get(y), x, true)) {
        corners += ' SelectionTopLeft'
      }
      if (!covers(bottoms.get(y), x + width, false)) {
        corners += ' SelectionTopRight'
      }
      if (!covers(tops.get(y + height), x + width, false)) {
        corners += ' SelectionBottomRight'
      }
      if (!covers(tops.get(y + height), x, true)) {
        corners += ' SelectionBottomLeft'
      }
    }
    result.push(corners)
  }
  return result
}
