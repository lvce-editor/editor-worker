import type { Renderer } from '../Renderer/Renderer.ts'
import * as DiffType from '../DiffType/DiffType.ts'
import { renderCss } from '../RenderCss/RenderCss.ts'
import * as RenderFocusContext from '../RenderFocusContext/RenderFocusContext.ts'
import { renderIncremental } from '../RenderIncremental/RenderIncremental.ts'

export const getRenderer = (diffType: number): Renderer => {
  switch (diffType) {
    case DiffType.RenderCss:
      return renderCss
    case DiffType.RenderFocus:
      return RenderFocusContext.renderFocusContext
    case DiffType.RenderFocusContext:
      return RenderFocusContext.renderFocusContext
    case DiffType.RenderIncremental:
      return renderIncremental
    default:
      throw new Error('unknown renderer')
  }
}
