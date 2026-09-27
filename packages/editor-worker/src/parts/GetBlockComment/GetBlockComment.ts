import * as ExtensionManagementEditor from '../ExtensionManagementEditor/ExtensionManagementEditor.ts'
import * as Languages from '../Languages/Languages.ts'

export const getBlockComment = async (editor: any, offset: number) => {
  try {
    const blockComment = await ExtensionManagementEditor.execute({
      args: [offset],
      editor,
      kind: 'comment',
      method: 'provideComment',
    })
    if (blockComment) {
      return blockComment
    }
  } catch {
    // ignore
  }

  const languageConfiguration = await Languages.getLanguageConfiguration(editor)
  if (!languageConfiguration?.comments?.blockComment) {
    return undefined
  }
  return languageConfiguration.comments.blockComment
}
