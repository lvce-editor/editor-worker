import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import type { EditorGutterDecoration, EditorGutterDecorationType } from '../EditorGutterDecoration/EditorGutterDecoration.ts'
import type { EditorState } from '../State/State.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

interface ProviderDecoration {
  readonly rowIndex?: unknown
  readonly type?: unknown
}

const validTypes: ReadonlySet<EditorGutterDecorationType> = new Set(['added', 'deleted', 'modified'])

const isProviderDecoration = (value: unknown): value is ProviderDecoration => {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

const getProviderDecorations = (results: unknown): readonly EditorGutterDecoration[] => {
  if (!Array.isArray(results)) {
    return []
  }
  const decorations: EditorGutterDecoration[] = []
  for (const result of results) {
    if (!Array.isArray(result)) {
      continue
    }
    for (const decoration of result) {
      if (
        isProviderDecoration(decoration) &&
        Number.isSafeInteger(decoration.rowIndex) &&
        (decoration.rowIndex as number) >= 0 &&
        typeof decoration.type === 'string' &&
        validTypes.has(decoration.type as EditorGutterDecorationType)
      ) {
        decorations.push({ rowIndex: decoration.rowIndex as number, type: decoration.type as EditorGutterDecorationType })
      }
    }
  }
  return decorations
}

export const getEditorGutterDecorations = async (editor: EditorState): Promise<readonly EditorGutterDecoration[]> => {
  const textDocument = {
    languageId: editor.languageId,
    text: TextDocument.getText(editor),
    uri: editor.uri,
  }
  try {
    const results = await ExtensionManagementWorker.invoke(
      'Extensions.executeProvidersByEvent',
      'onEditorGutterDecoration',
      'ExtensionApi.executeEditorGutterDecorationProvider',
      textDocument,
    )
    return getProviderDecorations(results)
  } catch {
    return []
  }
}
