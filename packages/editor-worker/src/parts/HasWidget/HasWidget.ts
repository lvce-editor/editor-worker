export const hasWidget = (widgets: any[], id: string) => {
  for (const widget of widgets) {
    if (widget.id === id) {
      return true
    }
  }
  return false
}
