// @ts-ignore
export const handlePointerCaptureLost = (editor) => {
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
