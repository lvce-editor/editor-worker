import type { HoverState } from '../HoverState/HoverState.ts'
import * as GetHoverInfo from '../GetHoverInfo/GetHoverInfo.ts'

export const loadHoverContent = async (state: HoverState, position?: any): Promise<HoverState | undefined> => {
  const hoverInfo = await GetHoverInfo.getEditorHoverInfo(state.editorUid, position)
  if (!hoverInfo) {
    return undefined
  }
  const { documentation, height, lineInfos, matchingDiagnostics, width, x, y } = hoverInfo
  return {
    ...state,
    diagnostics: matchingDiagnostics,
    documentation,
    height,
    lineInfos,
    width,
    x,
    y,
  }
}
