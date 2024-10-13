import type { FindWidgetState } from '../FindWidgetState/FindWidgetState.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

// TODO don't call renderer worker, set editor state
// TODO this function should be synchronous
export const focusIndex = async (state: FindWidgetState, index: number): Promise<FindWidgetState> => {
  const { value, matches, matchIndex } = state
  if (index === matchIndex) {
    return state
  }
  // TODO find next match and highlight it
  const matchRowIndex = matches[index * 2]
  const matchColumnIndex = matches[index * 2 + 1]
  // @ts-ignore
  const newSelections = new Uint32Array([matchRowIndex, matchColumnIndex, matchRowIndex, matchColumnIndex + value.length])
  // TODO set selections synchronously and render input match index,
  // input value and new selections at the same time
  // TODO
  await RendererWorker.invoke('Editor.setSelections', newSelections)
  return {
    ...state,
    matchIndex: index,
  }
}

export const focusFirst = (state: FindWidgetState) => {
  return focusIndex(state, 0)
}

export const focusLast = (state: FindWidgetState) => {
  const { matchCount } = state
  return focusIndex(state, matchCount - 1)
}

export const focusNext = (state: FindWidgetState) => {
  const { matchIndex, matchCount } = state
  if (matchIndex === matchCount - 1) {
    return focusFirst(state)
  }
  return focusIndex(state, matchIndex + 1)
}

export const focusPrevious = (state: FindWidgetState) => {
  const { matchIndex } = state
  if (matchIndex === 0) {
    return focusLast(state)
  }
  return focusIndex(state, matchIndex - 1)
}
