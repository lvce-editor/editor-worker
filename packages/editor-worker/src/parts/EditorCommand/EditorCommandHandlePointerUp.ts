export const handlePointerUp = (editor: any) => {
  return {
    ...editor,
    autoMoveSelectionState: {
      hasListener: false,
      position: editor.autoMoveSelectionState?.position || {
        columnIndex: 0,
        rowIndex: 0,
      },
    },
  }
}
