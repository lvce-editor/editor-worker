import * as Id from '../Id/Id.ts'

export const createDefaultState = (overrides: any = {}): any => {
  const uid = Id.create()
  return {
    lines: [],
    primarySelectionIndex: 0,
    selections: new Uint32Array(),
    undoStack: [],
    lineCache: [],
    uid,
    id: uid,
    ...overrides,
  }
}
