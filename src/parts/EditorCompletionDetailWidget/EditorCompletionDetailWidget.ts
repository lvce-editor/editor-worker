import * as EditorCompletionDetailRender from '../EditorCompletionDetailRender/EditorCompletionDetailRender.ts'

export const render = (widget: any) => {
  const commands: any[] = EditorCompletionDetailRender.renderFull(widget.oldState, widget.newState)
  const wrappedCommands = []
  const uid = widget.newState.uid
  for (const command of commands) {
    if (command[0] === 'Viewlet.setDom2') {
      wrappedCommands.push(command)
    } else {
      wrappedCommands.push(['Viewlet.send', uid, ...command])
    }
  }
  return wrappedCommands
}

export const add = (widget: any) => {
  const commands = render(widget)
  const id = 'EditorCompletionDetails'
  // TODO how to generate a unique integer id
  // that doesn't collide with ids created in renderer worker?
  const uid = widget.newState.uid
  const allCommands: any[] = []
  allCommands.push(['Viewlet.createFunctionalRoot', id, uid])
  allCommands.push(...commands)
  allCommands.push(['Viewlet.send', uid, 'appendWidget'])
  return allCommands
}

export const remove = (widget: any) => {
  return [['Viewlet.send', widget.newState.uid, 'dispose']]
}
