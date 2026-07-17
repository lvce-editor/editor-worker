import type { EditorState } from '../State/State.ts'

export const toggleBreakpoint = (editor: EditorState): EditorState => {
  const [rowIndex] = editor.selections
  const breakPoints = editor.breakPoints.includes(rowIndex)
    ? editor.breakPoints.filter((breakPoint) => breakPoint !== rowIndex)
    : [...editor.breakPoints, rowIndex]
  return {
    ...editor,
    breakPoints,
  }
}
