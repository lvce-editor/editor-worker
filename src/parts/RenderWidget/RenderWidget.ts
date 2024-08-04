import * as EditorCompletionRender from '../EditorCompletionRender/EditorCompletionRender.ts'

const renderCompletion = (oldState: any, newState: any) => {
  console.log({ oldState, newState })
  const commands = EditorCompletionRender.renderCompletion(oldState, newState)
  console.log({ commands })
  return []
}

const addWidgetCompletion = (widget: any) => {
  const commands = renderCompletion(widget.oldState, widget.newState)
  console.log({ commands })
  const id = 'EditorCompletion'
  const allCommands = [['Viewlet.create', id], ...commands]
  return allCommands
}

export const addWidget = (widget: any) => {
  const { id } = widget
  switch (id) {
    case 'completion':
      return addWidgetCompletion(widget)
    default:
      throw new Error('unsupported widget')
  }
}

export const renderWidget = (widget: any) => {
  const { id } = widget
  switch (id) {
    case 'completion':
      return renderCompletion(widget.oldState, widget.newState)
    default:
      throw new Error(`unsupported widget`)
  }
}
