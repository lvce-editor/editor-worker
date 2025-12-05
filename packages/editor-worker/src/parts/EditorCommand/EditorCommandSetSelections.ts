export const setSelections = (editor: any, selections: any) => {
  const { maxLineY, minLineY, rowHeight } = editor
  const startRowIndex = selections[0]
  if (startRowIndex < minLineY) {
    const deltaY = startRowIndex * rowHeight
    return {
      ...editor,
      deltaY,
      maxLineY: startRowIndex + 1,
      minLineY: startRowIndex,
      selections,
    }
  }
  if (startRowIndex > maxLineY) {
    const deltaY = startRowIndex * rowHeight
    return {
      ...editor,
      deltaY,
      maxLineY: startRowIndex + 1,
      minLineY: startRowIndex,
      selections,
    }
  }
  return {
    ...editor,
    selections,
  }
}
