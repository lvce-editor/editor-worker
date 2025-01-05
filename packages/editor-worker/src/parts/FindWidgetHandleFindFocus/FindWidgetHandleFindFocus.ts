import type { FindWidgetState } from '../FindWidgetState/FindWidgetState.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as HandleFindWidgetFocus from '../HandleFindWidgetFocus/HandleFindWidgetFocus.ts'

export const handleFindFocus = (state: FindWidgetState): FindWidgetState => {
  return HandleFindWidgetFocus.handleFindWidgetFocus(state, FocusKey.FindWidget)
}
