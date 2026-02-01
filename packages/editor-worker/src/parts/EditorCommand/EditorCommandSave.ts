import * as ErrorHandling from '../ErrorHandling/ErrorHandling.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'
import { VError } from '../VError/VError.ts'
import * as EditorFormat from './EditorCommandFormat.ts'
import { saveNormalFile } from './EditorCommandSave/saveNormalFile.ts'
import { saveUntitledFile } from './EditorCommandSave/saveUntitledFile.ts'

const getFormatOnSave = () => {
  // TODO query setting on editor creation
  // const value = Preferences.get('editor.formatOnSave')
  // return Boolean(value)
  return false
}

// @ts-ignore
const getNewEditor = async (editor) => {
  const formatOnSave = getFormatOnSave()
  if (formatOnSave) {
    return EditorFormat.format(editor)
  }
  return editor
}

export const save = async (editor: any): Promise<any> => {
  try {
    const { uri } = editor
    const newEditor = await getNewEditor(editor)
    const content = TextDocument.getText(newEditor)
    if (uri.startsWith('untitled:')) {
      await saveUntitledFile(uri, content)
    } else {
      await saveNormalFile(uri, content)
    }
    return newEditor
  } catch (error) {
    // @ts-ignore
    const betterError = new VError(error, `Failed to save file "${editor.uri}"`)
    await ErrorHandling.handleError(betterError)
    return editor
  }
}
