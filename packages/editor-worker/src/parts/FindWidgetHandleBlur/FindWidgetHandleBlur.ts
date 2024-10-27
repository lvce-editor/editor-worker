import type { FindWidgetState } from '../FindWidgetState/FindWidgetState.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as SetFocus from '../SetFocus/SetFocus.ts'

export const handleBlur = async (state: FindWidgetState): Promise<FindWidgetState> => {
  await SetFocus.setFocus(FocusKey.Empty)
  return state
}
