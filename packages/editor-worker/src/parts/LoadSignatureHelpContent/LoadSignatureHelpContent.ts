import type { HoverState } from '../HoverState/HoverState.ts'
import * as GetSignatureHelpInfo from '../GetSignatureHelpInfo/GetSignatureHelpInfo.ts'
import * as Markdown from '../Markdown/Markdown.ts'

export const loadSignatureHelpContent = async (state: HoverState): Promise<HoverState | undefined> => {
  const { editorUid } = state
  const signatureHelpInfo = await GetSignatureHelpInfo.getSignatureHelpInfo(editorUid)
  if (!signatureHelpInfo) {
    return undefined
  }
  const { documentation, height, lineInfos, width, x, y } = signatureHelpInfo
  const documentationVirtualDom = documentation ? await Markdown.getVirtualDomFromMarkdown(documentation) : []
  return {
    ...state,
    diagnostics: [],
    documentation,
    documentationVirtualDom,
    height,
    lineInfos,
    width,
    x,
    y,
  }
}
