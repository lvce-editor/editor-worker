import { isPersistentWidget } from '../IsPersistentWidget/IsPersistentWidget.ts'

// TODO widgets should have a persistence property:
// 1 = close by click (e.g. completion, hover, source-actions)
// 2 = stay open on click (e.g. find)
export const closeWidgetsMaybe = (widgets: readonly any[]): readonly any[] => {
  if (widgets.length === 0) {
    return widgets
  }
  return widgets.filter(isPersistentWidget)
}
