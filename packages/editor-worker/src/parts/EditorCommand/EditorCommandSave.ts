import { PlatformType } from '@lvce-editor/constants'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.ts'
import { applyLineEndings } from '../NormalizeLineEndings/NormalizeLineEndings.ts'
import * as TabModifiedStatusChange from '../TabModifiedStatusChange/TabModifiedStatusChange.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'
import { VError } from '../VError/VError.ts'
import { getNewEditor } from './EditorCommandSave/getNewEditor.ts'
import { isReadonlyFile } from './EditorCommandSave/isReadonlyFile.ts'
import { isUntitledFile } from './EditorCommandSave/isUntitledFile.ts'
import { saveNormalFile } from './EditorCommandSave/saveNormalFile.ts'
import { saveUntitledFile } from './EditorCommandSave/saveUntitledFile.ts'
import { showSaveErrorDialog } from './EditorCommandSave/showSaveErrorDialog.ts'

export const save = async (editor: any, skipFormatting = false): Promise<any> => {
  try {
    const { applicationId, platform, uri } = editor
    if (!isUntitledFile(uri) && (await isReadonlyFile(uri, applicationId))) {
      return editor
    }
    const shouldFormat = editor.formatOnSave && !skipFormatting
    const formatBeforeSave = shouldFormat && editor.formatActions === 'pre-save'
    const editorToSave = formatBeforeSave ? await getNewEditor(editor) : editor
    const content = applyLineEndings(TextDocument.getText(editorToSave), editorToSave.endOfLine)
    if (isUntitledFile(uri)) {
      const pickedFilePath = await saveUntitledFile(uri, content, platform, applicationId)
      if (pickedFilePath) {
        const savedEditor = { ...editorToSave, uri: pickedFilePath }
        if (editor.modified || savedEditor.modified) {
          await TabModifiedStatusChange.notifyTabModifiedStatusChange(uri, false, applicationId)
        }
        return { ...savedEditor, modified: false, uri: pickedFilePath, ...(shouldFormat && !formatBeforeSave && { postSaveFormat: true }) }
      }
      return editorToSave
    }
    await saveNormalFile(uri, content, applicationId)
    if (editor.modified || editorToSave.modified) {
      await TabModifiedStatusChange.notifyTabModifiedStatusChange(uri, false, applicationId)
    }
    return { ...editorToSave, modified: false, ...(shouldFormat && !formatBeforeSave && { postSaveFormat: true }) }
  } catch (error) {
    // @ts-ignore
    const betterError = new VError(error, `Failed to save file "${editor.uri}"`)
    await ErrorHandling.handleError(betterError)
    if (editor.platform === PlatformType.Electron) {
      try {
        await showSaveErrorDialog(betterError)
      } catch (dialogError) {
        await ErrorHandling.handleError(dialogError)
      }
    }
    return editor
  }
}
