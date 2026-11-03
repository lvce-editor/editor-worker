import type { EditorState } from '../State/State.ts'
import * as Editor from '../Editor/Editor.ts'
import { getTextChanges } from '../EditorCommand/EditorCommandApplyWorkspaceEdit.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

// Registered through wrapCommand, so validation and the edit share the
// document's command queue with typing and edits from other callers.
export const compareAndSetText = async (
  editor: EditorState,
  uri: string,
  expectedText: string,
  text: string,
  applicationId: string | undefined,
): Promise<EditorState> => {
  if (applicationId === '' || editor.applicationId !== applicationId || editor.uri !== uri) {
    throw new Error('The editor document no longer belongs to this application and URI')
  }
  if (typeof expectedText !== 'string' || typeof text !== 'string') {
    throw new TypeError('Document edits require expected and replacement text')
  }
  if (TextDocument.getText(editor) !== expectedText) {
    throw new Error(`File changed since it was read: ${uri}. Read the file again before editing.`)
  }
  if (expectedText === text) {
    return editor
  }
  const changes = getTextChanges(editor, [{ deleted: expectedText.length, inserted: text, offset: 0 }])
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
