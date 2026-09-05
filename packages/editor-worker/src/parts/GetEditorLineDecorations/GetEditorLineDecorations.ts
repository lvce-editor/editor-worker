import type { EditorLineDecoration } from '../EditorLineDecoration/EditorLineDecoration.ts'
import type { EditorState } from '../State/State.ts'
import * as ApplicationExtensionRpc from '../ApplicationExtensionRpc/ApplicationExtensionRpc.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

interface ProviderDecoration {
  readonly text?: unknown
}

const isProviderDecoration = (value: unknown): value is ProviderDecoration => {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

const getProviderDecorations = (results: unknown, rowIndex: number): readonly EditorLineDecoration[] => {
  if (!Array.isArray(results)) {
    return []
  }
  const decorations: EditorLineDecoration[] = []
  for (const result of results) {
    if (!Array.isArray(result)) {
      continue
    }
    for (const decoration of result) {
      if (isProviderDecoration(decoration) && typeof decoration.text === 'string') {
        decorations.push({ rowIndex, text: decoration.text })
      }
    }
  }
  return decorations
}

export const getEditorLineDecorations = async (editor: EditorState, rowIndex: number): Promise<readonly EditorLineDecoration[]> => {
  const textDocument = {
    languageId: editor.languageId,
    text: TextDocument.getText(editor),
    uri: editor.uri,
  }
  try {
    const results = await ApplicationExtensionRpc.invoke(
      editor.applicationId,
      'Extensions.executeProvidersByEvent',
      'onEditorLineDecoration',
      'ExtensionApi.executeEditorLineDecorationProvider',
      textDocument,
      rowIndex,
    )
    return getProviderDecorations(results, rowIndex)
  } catch {
    return []
  }
}
