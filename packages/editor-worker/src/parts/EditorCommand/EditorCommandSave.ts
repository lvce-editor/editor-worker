import * as ErrorHandling from '../ErrorHandling/ErrorHandling.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'
import { VError } from '../VError/VError.ts'
import { getNewEditor } from './EditorCommandSave/getNewEditor.ts'
import { isUntitledFile } from './EditorCommandSave/isUntitledFile.ts'
import { saveNormalFile } from './EditorCommandSave/saveNormalFile.ts'
import { saveUntitledFile } from './EditorCommandSave/saveUntitledFile.ts'

export const save = async (editor: any): Promise<any> => {
  try {
    const { platform, uri } = editor
    const newEditor = await getNewEditor(editor)
    const content = TextDocument.getText(newEditor)
    if (isUntitledFile(uri)) {
      const pickedFilePath = await saveUntitledFile(uri, content, platform)
      if (pickedFilePath) {
        return { ...newEditor, modified: false, uri: pickedFilePath }
      }
      return newEditor
    } else {
      await saveNormalFile(uri, content)
    }
    return { ...newEditor, modified: false }
  } catch (error) {
    // @ts-ignore
    const betterError = new VError(error, `Failed to save file "${editor.uri}"`)
    await ErrorHandling.handleError(betterError)
    return editor
  }
}
