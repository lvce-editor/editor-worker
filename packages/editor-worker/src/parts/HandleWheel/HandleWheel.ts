import type { VirtualListState } from '../VirtualListState/VirtualListState.ts'
import * as Assert from '../Assert/Assert.ts'
import * as SetDeltaY from '../SetDeltaY/SetDeltaY.ts'

export const handleWheel = <K, T extends VirtualListState<K>>(state: T, deltaMode: number, deltaY: number): T => {
  Assert.number(deltaMode)
  Assert.number(deltaY)
  return SetDeltaY.setDeltaY(state, state.deltaY + deltaY)
}
