import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.ts'
import * as Languages from '../Languages/Languages.ts'

export const getBlockComment = async (editor: any, offset: number) => {
  // TODO ask extension host worker,
  // execute block comment provider with
  // uri, language id, offset
  // and the extension returns a matching block comment or undefined
  try {
    // @ts-ignore
    const blockComment = await ExtensionHostWorker.invoke(`ExensionHostLanguages.getBlockComment`, editor.languageId, editor.uri, offset)
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
