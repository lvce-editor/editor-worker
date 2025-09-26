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
    minLineY: 0,
    numberOfVisibleLines: 0,
    width: 0,
    deltaX: 0,
    fontWeight: 'normal',
    fontSize: 14,
    fontFamily: 'monospace',
    letterSpacing: 0,
    charWidth: 8,
    invalidStartIndex: 0,
    ...overrides,
  }
}
