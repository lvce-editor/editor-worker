import * as GetEditor from '../GetEditor/GetEditor.ts'
import * as GetHoverInfo from '../GetHoverInfo/GetHoverInfo.ts'

export const loadContent = async (editorUid: number, state: any, position: any) => {
  const hoverInfo = await GetHoverInfo.getEditorHoverInfo(editorUid, position)
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

export const handleSashPointerDown = (state: any, eventX: any, eventY: any) => {
  return state
}

export const handleSashPointerMove = (state: any, eventX: any, eventY: any) => {
  // @ts-ignore
  const { x, y } = state
  const minWidth = 100
  const newWidth = Math.max(eventX - x, minWidth)
  return {
    ...state,
    resizedWidth: newWidth,
  }
}

export const handleSashPointerUp = (state: any, eventX: any, eventY: any) => {
  return state
}
