import type { FindWidgetState } from '../FindWidgetState/FindWidgetState.ts'
import * as HandleFindWidgetFocus from '../HandleFindWidgetFocus/HandleFindWidgetFocus.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'

export const handleReplaceFocus = (state: FindWidgetState): FindWidgetState => {
  return HandleFindWidgetFocus.handleFindWidgetFocus(state, FocusKey.FocusFindWidgetReplace)
}