import * as EditorCommandGetWordAt from '../EditorCommand/EditorCommandGetWordAt.ts'
import * as GetEditor from '../GetEditor/GetEditor.ts'
import * as GetPositionAtCursor from '../GetPositionAtCursor/GetPositionAtCursor.ts'
import * as GetWordAtOffset from '../GetWordAtOffset/GetWordAtOffset.ts'

export const getPositionAtCursor = (editorUid: number): any => {
  const editor = GetEditor.getEditor(editorUid)
  return GetPositionAtCursor.getPositionAtCursor(editor)
}

export const getWordAt = (editorUid: number, rowIndex: number, columnIndex: number): string => {
  const editor = GetEditor.getEditor(editorUid)
  const { word } = EditorCommandGetWordAt.getWordAt(editor, rowIndex, columnIndex)
  return word
}

export const getWordAtOffset2 = (editorUid: number): string => {
  const editor = GetEditor.getEditor(editorUid)
  const word = GetWordAtOffset.getWordAtOffset(editor)
  return word
}

export const getWordBefore2 = (editorUid: number, rowIndex: number, columnIndex: number): string => {
  const editor = GetEditor.getEditor(editorUid)
  const word = EditorCommandGetWordAt.getWordBefore(editor, rowIndex, columnIndex)
  return word
}

export const getLines2 = (editorUid: number): readonly string[] => {
  const editor = GetEditor.getEditor(editorUid)
  const { lines } = editor
  return lines
}

export const getSelections2 = (editorUid: number): readonly string[] => {
  const editor = GetEditor.getEditor(editorUid)
  const { selections } = editor
  return selections
}

export const closeFind2 = (editorUid: number) => {
  console.log('close find')
  // TODO
  // 1. ask find widget worker to remove widget
  // 2. remove find widget from editor
  // 3. ask renderer worker to rerender editor
}
