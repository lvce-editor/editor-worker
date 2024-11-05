const getIndex = (widgets: any, id: any) => {
  for (const [i, widget] of widgets.entries()) {
    if (widget.id === id) {
      return i
    }
  }
  return -1
}

export const removeEditorWidget = (widgets: any[], id: any): any[] => {
  const index = getIndex(widgets, id)
  const newWidgets = [...widgets.slice(0, index), ...widgets.slice(index + 1)]
  return newWidgets
}
