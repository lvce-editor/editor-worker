import * as ExtensionManagementEditor from '../ExtensionManagementEditor/ExtensionManagementEditor.ts'
import { getOffsetAtCursor } from '../GetOffsetAtCursor/GetOffsetAtCursor.ts'
import * as Languages from '../Languages/Languages.ts'

export const getLineComment = async (editor: any): Promise<any> => {
  try {
    const offset = getOffsetAtCursor(editor)
    const lineComment = await ExtensionManagementEditor.execute({
      args: [offset],
      editor,
      kind: 'comment',
      method: 'provideComment',
    })
    if (Array.isArray(lineComment) && lineComment[1] === '') {
      return lineComment[0]
    }
  } catch {
    // ignore
  }
  const languageConfiguration = await Languages.getLanguageConfiguration(editor)
  if (!languageConfiguration?.comments?.lineComment) {
    return undefined
  }
  return languageConfiguration.comments.lineComment
}
