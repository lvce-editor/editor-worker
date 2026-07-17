import type { Renderer } from '../Renderer/Renderer.ts'
import * as DiffType from '../DiffType/DiffType.ts'
import * as RenderAdditionalFocusContext from '../RenderAdditionalFocusContext/RenderAdditionalFocusContext.ts'
import { renderCss } from '../RenderCss/RenderCss.ts'
import { renderFocus } from '../RenderFocus/RenderFocus.ts'
import * as RenderFocusContext from '../RenderFocusContext/RenderFocusContext.ts'
import { renderIncremental } from '../RenderIncremental/RenderIncremental.ts'
import { renderWidgets } from '../RenderWidgets/RenderWidgets.ts'

export const getRenderer = (diffType: number): Renderer => {
  switch (diffType) {
    case DiffType.RenderAdditionalFocusContext:
      return RenderAdditionalFocusContext.renderAdditionalFocusContext
    case DiffType.RenderCss:
      return renderCss
    case DiffType.RenderFocus:
      return renderFocus
    case DiffType.RenderFocusContext:
      return RenderFocusContext.renderFocusContext
    case DiffType.RenderIncremental:
      return renderIncremental
    case DiffType.RenderWidgets:
      return renderWidgets
    default:
      throw new Error('unknown renderer')
  }
}
