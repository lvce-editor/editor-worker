import type { EditorState } from '../State/State.ts'
import * as EditorMinimapConstants from '../EditorMinimapConstants/EditorMinimapConstants.ts'
import * as GetMinimapRectangles from '../GetMinimapRectangles/GetMinimapRectangles.ts'

export const renderMinimap = (oldState: EditorState, newState: EditorState): readonly any[] => {
  if (!newState.minimapEnabled) {
    return []
  }
  const rectangles = GetMinimapRectangles.getMinimapRectangles(newState)
  const revision = `${newState.minimapRevision}:${newState.minLineY}`
  return [
    'Viewlet.renderCanvas',
    newState.uid,
    '.EditorMinimap',
    'EditorMinimapCanvas',
    EditorMinimapConstants.width,
    newState.height,
    rectangles,
    revision,
  ]
}
