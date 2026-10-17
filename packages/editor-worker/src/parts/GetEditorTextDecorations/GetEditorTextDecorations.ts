import type { EditorTextDecoration } from '../EditorTextDecoration/EditorTextDecoration.ts'
import type { EditorState } from '../State/State.ts'
import * as ApplicationExtensionRpc from '../ApplicationExtensionRpc/ApplicationExtensionRpc.ts'
import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

export const isValidEditorTextDecoration = (value: unknown, lines: readonly string[]): value is EditorTextDecoration => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }
  const { color, endColumnIndex, endRowIndex, startColumnIndex, startRowIndex, thickness = 2 } = value as EditorTextDecoration
  return (
    [startRowIndex, startColumnIndex, endRowIndex, endColumnIndex].every((item) => Number.isSafeInteger(item) && item >= 0) &&
    endRowIndex >= startRowIndex &&
    (endRowIndex !== startRowIndex || endColumnIndex >= startColumnIndex) &&
    endRowIndex < lines.length &&
    startColumnIndex <= lines[startRowIndex].length &&
    endColumnIndex <= lines[endRowIndex].length &&
    typeof color === 'string' &&
    /^#[\da-f]{6}$/i.test(color) &&
    Number.isSafeInteger(thickness) &&
    thickness >= 1 &&
    thickness <= 4
  )
}

export const getEditorTextDecorations = async (editor: EditorState): Promise<readonly EditorTextDecoration[]> => {
  if (editor.largeFile) {
    return []
  }
  const selections = []
  for (let index = 0; index < (editor.selections || []).length; index += 4) {
    const [startRowIndex, startColumnIndex, endRowIndex, endColumnIndex] = GetSelectionPairs.getSelectionPairs(editor.selections, index)
    selections.push({ endColumnIndex, endRowIndex, startColumnIndex, startRowIndex })
  }
  try {
    const results = await ApplicationExtensionRpc.invoke(
      editor.applicationId,
      'Extensions.executeProvidersByEvent',
      'onEditorTextDecoration',
      'ExtensionApi.executeEditorTextDecorationProvider',
      {
        languageId: editor.languageId,
        selections,
        text: TextDocument.getText(editor),
        uri: editor.uri,
      },
    )
    if (!Array.isArray(results)) {
      return []
    }
    return results.flatMap((result: unknown) =>
      Array.isArray(result) ? result.filter((item) => isValidEditorTextDecoration(item, editor.lines)) : [],
    )
  } catch {
    return []
  }
}

export const refreshTextDecorations = async (editor: EditorState): Promise<EditorState> => ({
  ...editor,
  textDecorations: await getEditorTextDecorations(editor),
})
