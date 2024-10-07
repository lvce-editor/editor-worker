export const getWidgetState = <T>(editor: any, id: string): T | undefined => {
  const { widgets } = editor
  for (const widget of widgets) {
    if (widget.id === id) {
      return widget.newState
    }
  }
  return undefined
}