import type { FindWidgetState } from '../FindWidgetState/FindWidgetState.ts'
import * as FocusSource from '../FocusSource/FocusSource.ts'
import * as SetFocus from '../SetFocus/SetFocus.ts'

export const setFindWidgetFocus = async (state: FindWidgetState, focusKey: number): Promise<FindWidgetState> => {
  if (state.focus === focusKey) {
    return state
  }
  await SetFocus.setFocus(focusKey)
  return {
    ...state,
    focus: focusKey,
    focusSource: FocusSource.Script,
  }
}
