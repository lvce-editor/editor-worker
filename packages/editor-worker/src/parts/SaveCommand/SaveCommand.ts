import type { EditorState } from '../State/State.ts'
import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'
import * as EditorCommandSave from '../EditorCommand/EditorCommandSave.ts'
import * as WrapCommands from '../WrapCommands/WrapCommands.ts'

export const save = async (uid: number, skipFormatting = false): Promise<void> => {
  let savedFrom: EditorState | undefined
  let postSaveSnapshot: EditorState | undefined
  const saveContent = WrapCommands.wrapCommand(async (editor: EditorState) => {
    savedFrom = editor
    const shouldFormatAfterSave = editor.formatOnSave && !skipFormatting && editor.formatActions !== 'pre-save'
    const savedEditor = await EditorCommandSave.save(editor, skipFormatting || shouldFormatAfterSave)
    if (shouldFormatAfterSave && savedEditor !== editor) {
      postSaveSnapshot = savedEditor
    }
    return savedEditor
  })
  const saved = await saveContent(uid)
  if (savedFrom && saved && savedFrom.uri !== saved.uri) {
    // Retargeting calls Editor.handleUriChange, so release the editing queue first.
    await ApplicationRpc.invoke(savedFrom.applicationId, 'Main.handleUriChange', savedFrom.uri, saved.uri)
  }
  if (saved && postSaveSnapshot) {
    setTimeout(() => void WrapCommands.formatAfterSave(uid, saved), 0)
  }
}
