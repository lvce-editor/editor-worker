import type { FindWidgetState } from '../FindWidgetState/FindWidgetState.ts'
import * as FindWidgetRefresh from '../FindWidgetRefresh/FindWidgetRefresh.ts'

export const handleInput = (state: FindWidgetState, value: string): FindWidgetState => {
  return FindWidgetRefresh.refresh(state, value)
}
