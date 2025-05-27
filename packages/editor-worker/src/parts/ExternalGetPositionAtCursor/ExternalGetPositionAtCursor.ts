import * as EditorCommandGetWordAt from '../EditorCommand/EditorCommandGetWordAt.ts'
import * as GetEditor from '../GetEditor/GetEditor.ts'
import * as GetPositionAtCursor from '../GetPositionAtCursor/GetPositionAtCursor.ts'
import * as GetWordAt from '../GetWordAt/GetWordAt.ts'
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

export const getWordBefore2 = (editorUid: number, columnIndex: number): string => {
  const editor = GetEditor.getEditor(editorUid)
  const word = GetWordAt.getWordBefore(editor, columnIndex)
  return word
}
