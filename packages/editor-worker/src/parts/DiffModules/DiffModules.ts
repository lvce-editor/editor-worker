import * as DiffAdditionalFocus from '../DiffAdditionalFocus/DiffAdditionalFocus.ts'
import * as DiffCss from '../DiffCss/DiffCss.ts'
import * as DiffFocus from '../DiffFocus/DiffFocus.ts'
import * as DiffItems from '../DiffItems/DiffItems.ts'
import * as DiffType from '../DiffType/DiffType.ts'
import * as DiffWidgets from '../DiffWidgets/DiffWidgets.ts'

export const modules = [DiffItems.isEqual, DiffFocus.isEqual, DiffFocus.isEqual, DiffAdditionalFocus.isEqual, DiffCss.isEqual, DiffWidgets.isEqual]

export const numbers = [
  DiffType.RenderIncremental,
  DiffType.RenderFocus,
  DiffType.RenderFocusContext,
  DiffType.RenderAdditionalFocusContext,
  DiffType.RenderCss,
  DiffType.RenderWidgets,
]
