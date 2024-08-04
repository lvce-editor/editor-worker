const isCompletion = (widget: any) => {
  return widget.id === 'completion'
}

export const getCompletionState = (editor: any) => {
  const { widgets } = editor
  const child = widgets.find(isCompletion)
  return child.newState
}
