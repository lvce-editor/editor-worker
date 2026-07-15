import type { Widget } from '../Widget/Widget.ts'

export const removeWidget = <T>(widget: Widget<T>): readonly any[] => {
  // @ts-ignore
  return [['Viewlet.dispose', widget.newState.uid]]
}
