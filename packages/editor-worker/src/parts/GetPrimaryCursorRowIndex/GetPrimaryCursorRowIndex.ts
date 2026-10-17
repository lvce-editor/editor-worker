export const getPrimaryCursorRowIndex = (selections: Uint32Array | undefined, primarySelectionIndex = 0): number => {
  return selections?.[primarySelectionIndex + 2] ?? -1
}
