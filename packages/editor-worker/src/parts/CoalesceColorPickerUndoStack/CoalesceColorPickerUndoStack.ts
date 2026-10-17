export const coalesceColorPickerUndoStack = (undoStack: readonly any[], undoStackIndex: number): readonly any[] => {
  if (undoStackIndex < 0 || undoStackIndex >= undoStack.length) {
    return undoStack
  }
  const originalChange = undoStack[undoStackIndex][0]
  const latestChange = undoStack.at(-1)[0]
  const coalescedChange = {
    ...originalChange,
    inserted: latestChange.inserted,
  }
  return [...undoStack.slice(0, undoStackIndex), [coalescedChange]]
}
