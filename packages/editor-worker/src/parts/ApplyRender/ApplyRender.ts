import type { EditorState } from '../State/State.ts'
import * as DiffType from '../DiffType/DiffType.ts'
import * as GetRenderer from '../GetRenderer/GetRenderer.ts'

export const applyRender = (oldState: EditorState, newState: EditorState, diffResult: readonly number[]): readonly any[] => {
  const commands = []
  for (const item of diffResult) {
    const fn = GetRenderer.getRenderer(item)
    const result = fn(oldState, newState)
    if (result.length > 0) {
      if (item === DiffType.RenderWidgets) {
        commands.push(...result)
      } else {
        commands.push(result)
      }
    }
  }
  return commands
}
