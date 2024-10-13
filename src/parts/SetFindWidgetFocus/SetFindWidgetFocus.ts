import type { FindWidgetState } from '../FindWidgetState/FindWidgetState.ts'
import * as FocusSource from '../FocusSource/FocusSource.ts'

export const setFindWidgetFocus = (state: FindWidgetState, focusKey: number): FindWidgetState => {
  if (state.focus === focusKey) {
    return state
  }
  return {
    ...state,
    focus: focusKey,
    focusSource: FocusSource.Script,
  }
}
