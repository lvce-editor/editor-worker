export const handlePointerUp = (editor: any) => {
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
