import type { EditorState } from '../State/State.ts'

export const handleUriChange = async (editor: EditorState, newUri: string): Promise<EditorState> => {
  return {
    ...editor,
    ...(editor.uri !== newUri && { explicitLanguageId: undefined }),
    uri: newUri,
  }
}
