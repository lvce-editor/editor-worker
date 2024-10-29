const getIndex = (widgets: any, id: any) => {
  for (let i = 0; i < widgets.length; i++) {
    const widget = widgets[i]
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
