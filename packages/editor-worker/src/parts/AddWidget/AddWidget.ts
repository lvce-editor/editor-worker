import type { Widget } from '../Widget/Widget.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

const isFunctional = (widgetId: number | string): boolean => {
  switch (widgetId) {
    case WidgetId.ColorPicker:
      return true
    default:
      return false
  }
}

export const addWidget = <T>(widget: Widget<T>, id: string, render: (widget: Widget<T>) => readonly any[]): readonly any[] => {
  const commands = render(widget)
  // TODO how to generate a unique integer id
  // that doesn't collide with ids created in renderer worker?
  // @ts-ignore
  const { uid } = widget.newState
  const allCommands: any[] = []
  allCommands.push(['Viewlet.createFunctionalRoot', id, uid, isFunctional(widget.id)])
  allCommands.push(...commands)
  // allCommands.push(['Viewlet.send', uid, 'appendWidget'])
  allCommands.push(['Viewlet.appendToBody', uid])

  const focusCommandIndex = allCommands.findIndex((command) => {
    return command[2] === 'focus' || command[0] === 'Viewlet.focusSelector'
  })
  // TODO have separate rendering functions, e.g.
  // 1. renderDom
  // 2. renderAriaAnnouncement
  // 3. renderFocus
  // to ensure that focus is always after the element is added to the dom
  if (focusCommandIndex !== -1) {
    const command = allCommands[focusCommandIndex]
    allCommands.splice(focusCommandIndex, 1)
    allCommands.push(command)
  }

  console.log({ allCommands })
  return allCommands
}
