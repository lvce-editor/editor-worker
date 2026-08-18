import type { EditorState } from '../State/State.ts'
import * as EditorMinimapConstants from '../EditorMinimapConstants/EditorMinimapConstants.ts'

interface CanvasRectangle {
  readonly className: string
  readonly height: number
  readonly width: number
  readonly x: number
  readonly y: number
}

const isWhitespace = (className: string): boolean => {
  return className.includes('Whitespace')
}

const getLineRectangles = (line: readonly (number | string)[], y: number, height: number): readonly CanvasRectangle[] => {
  const rectangles: CanvasRectangle[] = []
  let x = 0
  for (let i = 0; i < line.length; i += 2) {
    const length = line[i] as number
    const className = line[i + 1] as string
    const width = Math.min(length * EditorMinimapConstants.characterWidth, EditorMinimapConstants.width - x)
    if (!isWhitespace(className) && width > 0) {
      rectangles.push({ className, height, width, x, y })
    }
    x += length * EditorMinimapConstants.characterWidth
    if (x >= EditorMinimapConstants.width) {
      return rectangles
    }
  }
  return rectangles
}

const getViewportRectangle = (state: EditorState, lineCount: number): CanvasRectangle => {
  const { deltaY, finalDeltaY, height, numberOfVisibleLines } = state
  const viewportHeight = Math.min(
    Math.max((numberOfVisibleLines / Math.max(lineCount, 1)) * height, EditorMinimapConstants.minimumViewportHeight),
    height,
  )
  const availableHeight = Math.max(height - viewportHeight, 0)
  const y = finalDeltaY > 0 ? (deltaY / finalDeltaY) * availableHeight : 0
  return {
    className: 'EditorMinimapViewport',
    height: viewportHeight,
    width: EditorMinimapConstants.width,
    x: 0,
    y,
  }
}

export const getMinimapRectangles = (state: EditorState): readonly CanvasRectangle[] => {
  const { height, minimapLines } = state
  const lineCount = minimapLines.length
  const rectangles: CanvasRectangle[] = []
  if (lineCount > 0 && height > 0) {
    const rowHeight = Math.min(EditorMinimapConstants.lineHeight, height / lineCount)
    for (let lineIndex = 0; lineIndex < lineCount; lineIndex++) {
      const line = minimapLines[lineIndex]
      const y = lineIndex * rowHeight
      rectangles.push(...getLineRectangles(line, y, rowHeight))
    }
  }
  rectangles.push(getViewportRectangle(state, lineCount))
  return rectangles
}
