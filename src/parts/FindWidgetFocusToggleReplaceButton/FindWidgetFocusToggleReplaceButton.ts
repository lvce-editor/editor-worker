import type { FindWidgetState } from '../FindWidgetState/FindWidgetState.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as SetFindWidgetFocus from '../SetFindWidgetFocus/SetFindWidgetFocus.ts'

export const focusToggleReplaceButton = (state: FindWidgetState): FindWidgetState => {
  return SetFindWidgetFocus.setFindWidgetFocus(state, FocusKey.FocusFindWidgetToggleReplace)
}
