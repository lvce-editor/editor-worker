import type { Widget } from '../Widget/Widget.ts'

export const removeWidget = <T>(widget: Widget<T>): readonly any[] => {
  // @ts-ignore
  return [['Viewlet.send', widget.newState.uid, 'dispose']]
}
