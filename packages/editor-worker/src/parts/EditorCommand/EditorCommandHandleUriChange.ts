import type { EditorState } from '../State/State.ts'

export const handleUriChange = async (editor: EditorState, newUri: string): Promise<EditorState> => {
  const { explicitLanguageId, ...state } = editor
  return {
    ...state,
    ...(editor.uri === newUri && explicitLanguageId && { explicitLanguageId }),
    uri: newUri,
  }
}
