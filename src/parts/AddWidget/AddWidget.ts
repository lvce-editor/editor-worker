import type { Widget } from '../Widget/Widget.ts'

export const addWidget = <T>(widget: Widget<T>, id: string, render: (widget: Widget<T>) => readonly any[]): readonly any[] => {
  const commands = render(widget)
  // TODO how to generate a unique integer id
  // that doesn't collide with ids created in renderer worker?
  // @ts-ignore
  const uid = widget.newState.uid
  const allCommands: any[] = []
  allCommands.push(['Viewlet.createFunctionalRoot', id, uid])
  allCommands.push(...commands)
  allCommands.push(['Viewlet.send', uid, 'appendWidget'])
  return allCommands
}
