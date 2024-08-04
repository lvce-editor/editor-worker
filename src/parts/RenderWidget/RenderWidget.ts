import * as EditorCompletionRender from '../EditorCompletionRender/EditorCompletionRender.ts'

const renderCompletion = (oldState: any, newState: any) => {
  const commands = EditorCompletionRender.renderCompletion(oldState, newState)
  return commands
}

const addWidgetCompletion = (widget: any) => {
  const commands = renderCompletion(widget.oldState, widget.newState)
  const id = 'EditorCompletion'
  // TODO how to generate a unique integer id
  // that doesn't collide with ids created in renderer worker?
  const uid = widget.newState.uid
  const allCommands: any[] = []
  allCommands.push(['Viewlet.create', id, uid])
  for (const command of commands) {
    allCommands.push(['Viewlet.send', uid, ...command])
  }
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

const removeCompletion = (widget: any) => {
  return [['Viewlet.send', widget.newState.uid, 'dispose']]
}

export const removeWidget = (widget: any) => {
  console.log({ widget })
  const { id } = widget
  switch (id) {
    case 'completion':
      return removeCompletion(widget)
    default:
      throw new Error('unsupported widget')
  }
}