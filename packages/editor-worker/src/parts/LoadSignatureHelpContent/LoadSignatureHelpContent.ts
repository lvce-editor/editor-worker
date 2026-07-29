import type { HoverState } from '../HoverState/HoverState.ts'
import * as GetSignatureHelpInfo from '../GetSignatureHelpInfo/GetSignatureHelpInfo.ts'

export const loadSignatureHelpContent = async (state: HoverState): Promise<HoverState | undefined> => {
  const { editorUid } = state
  const signatureHelpInfo = await GetSignatureHelpInfo.getSignatureHelpInfo(editorUid)
  if (!signatureHelpInfo) {
    return undefined
  }
  const { documentation, lineInfos, x, y } = signatureHelpInfo
  return {
    ...state,
    diagnostics: [],
    documentation,
    lineInfos,
    width: 600,
    x,
    y,
  }
}
