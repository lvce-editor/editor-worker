import * as GetHoverInfo from '../GetHoverInfo/GetHoverInfo.ts'
import type { HoverState } from '../HoverState/HoverState.ts'

export const loadHoverContent = async (state: HoverState): Promise<HoverState> => {
  // TODO
  const position = undefined
  const hoverInfo = await GetHoverInfo.getEditorHoverInfo(state.editorUid, position)
  if (!hoverInfo) {
    return state
  }
  const { lineInfos, documentation, x, y, matchingDiagnostics } = hoverInfo
  return {
    ...state,
    lineInfos,
    documentation,
    x,
    y,
    diagnostics: matchingDiagnostics,
  }
}
