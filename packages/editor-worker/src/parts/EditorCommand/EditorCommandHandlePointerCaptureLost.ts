// @ts-ignore
export const handlePointerCaptureLost = (editor) => {
  return {
    ...editor,
    hasListener: false,
    isSelecting: false,
    selectionAutoMovePosition: {
      columnIndex: 0,
      rowIndex: 0,
    },
  }
}
