export interface TransformSourceResult {
  readonly code: string
  readonly markerLines: readonly number[]
}

const previewMarker = /\/\/\?\s*$/

const stripTrailingSemicolon = (value: string): string => {
  if (value.endsWith(';')) {
    return value.slice(0, -1).trimEnd()
  }
  return value
}

export const transformSource = (text: string): TransformSourceResult => {
  const lines = text.split('\n')
  const transformedLines: string[] = []
  const markerLines: number[] = []

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index]
    if (!previewMarker.test(line)) {
      transformedLines.push(line)
      continue
    }
    const markerIndex = line.lastIndexOf('//?')
    const beforeMarker = line.slice(0, markerIndex).trimEnd()
    const expression = stripTrailingSemicolon(beforeMarker)
    if (!expression) {
      return {
        code: '',
        markerLines: [],
      }
    }
    transformedLines.push(`__preview__(${index}, ${expression})`)
    markerLines.push(index)
  }

  return {
    code: `${transformedLines.join('\n')}\n`,
    markerLines,
  }
}
