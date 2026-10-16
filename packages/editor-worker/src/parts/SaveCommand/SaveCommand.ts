import type { EditorState } from '../State/State.ts'
import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'
import * as EditorCommandSave from '../EditorCommand/EditorCommandSave.ts'
import * as WrapCommands from '../WrapCommands/WrapCommands.ts'

export const save = async (uid: number, skipFormatting = false): Promise<void> => {
  let savedFrom: EditorState | undefined
  const saveContent = WrapCommands.wrapCommand(async (editor: EditorState) => {
    savedFrom = editor
    return EditorCommandSave.save(editor, skipFormatting)
  })
  const saved = await saveContent(uid)
  if (savedFrom && saved && savedFrom.uri !== saved.uri) {
    // Retargeting calls Editor.handleUriChange, so release the editing queue first.
    await ApplicationRpc.invoke(savedFrom.applicationId, 'Main.handleUriChange', savedFrom.uri, saved.uri)
  }
}
