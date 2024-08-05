import * as GetWordAt from '../GetWordAt/GetWordAt.ts'

export const getWordAt = (editor: any, rowIndex: number, columnIndex: number) => {
  const { lines } = editor
  const line = lines[rowIndex]
  return GetWordAt.getWordAt(line, columnIndex)
}

export const getWordBefore = (editor: any, rowIndex: number, columnIndex: number) => {
  const { lines } = editor
  const line = lines[rowIndex]
  return GetWordAt.getWordBefore(line, columnIndex)
}
