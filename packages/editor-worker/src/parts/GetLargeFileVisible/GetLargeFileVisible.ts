import type { EditorState } from '../State/State.ts'

// Large files have no token cache. Only materialize the text inside the horizontal viewport.
export const getLargeFileVisible = (editor: EditorState): { differences: number[]; textInfos: string[][] } => {
  const { deltaX, lines, tabSize, visibleLineIndices, width } = editor
  const charWidth = editor.charWidth || 8
  const firstColumn = Math.max(0, Math.floor(deltaX / charWidth))
  const lastColumn = firstColumn + Math.ceil(width / charWidth) + 2
  const textInfos: string[][] = []
  const differences: number[] = []
  for (const row of visibleLineIndices) {
    const line = lines[row]
    let text = ''
    if (line.includes('\t')) {
      let column = 0
      for (let index = 0; index < line.length && column < lastColumn; index++) {
        const character = line[index]
        const length = character === '\t' ? Math.max(1, tabSize) : 1
        const end = column + length
        if (end > firstColumn) {
          text += character === '\t' ? ' '.repeat(Math.min(end, lastColumn) - Math.max(column, firstColumn)) : character
        }
        column = end
      }
    } else {
      text = line.slice(firstColumn, lastColumn)
    }
    textInfos.push([text, 'Token Text'])
    differences.push(firstColumn * charWidth - deltaX)
  }
  return { differences, textInfos }
}
