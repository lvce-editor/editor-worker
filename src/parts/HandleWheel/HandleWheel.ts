import * as Assert from '../Assert/Assert.ts'
import * as SetDeltaY from '../SetDeltaY/SetDeltaY.ts'
import type { VirtualListState } from '../VirtualListState/VirtualListState.ts'

export const handleWheel = <T>(state: VirtualListState<T>, deltaMode: number, deltaY: number): VirtualListState<T> => {
  Assert.number(deltaMode)
  Assert.number(deltaY)
  return SetDeltaY.setDeltaY(state, state.deltaY + deltaY)
}
