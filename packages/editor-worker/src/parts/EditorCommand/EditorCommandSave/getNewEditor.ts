import * as EditorFormat from '../EditorCommandFormat.ts'
import { getFormatOnSave } from './getFormatOnSave.ts'

// @ts-ignore
export const getNewEditor = async (editor) => {
  const formatOnSave = getFormatOnSave()
  if (formatOnSave) {
    return EditorFormat.format(editor)
  }
  return editor
}
