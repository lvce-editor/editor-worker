import type { HoverState } from '../HoverState/HoverState.ts'
import * as GetHoverInfo from '../GetHoverInfo/GetHoverInfo.ts'

export const loadHoverContent = async (state: HoverState): Promise<HoverState> => {
  // TODO
  const position = undefined
  const hoverInfo = await GetHoverInfo.getEditorHoverInfo(state.editorUid, position)
  if (!hoverInfo) {
    return state
  }
  const { documentation, lineInfos, matchingDiagnostics, x, y } = hoverInfo
  return {
    ...state,
    diagnostics: matchingDiagnostics,
    documentation,
    lineInfos,
    width: 600,
    x,
    y,
  }
}
