import type { FindWidgetState } from '../FindWidgetState/FindWidgetState.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as SetFindWidgetFocus from '../SetFindWidgetFocus/SetFindWidgetFocus.ts'

export const focusCloseButton = async (state: FindWidgetState): Promise<FindWidgetState> => {
  return SetFindWidgetFocus.setFindWidgetFocus(state, FocusKey.FocusFindWidgetCloseButton)
}
