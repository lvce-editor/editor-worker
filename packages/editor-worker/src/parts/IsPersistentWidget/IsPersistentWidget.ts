import { WidgetId } from '@lvce-editor/constants'

export const isPersistentWidget = (widgetId: number): boolean => {
  switch (widgetId) {
    case WidgetId.Find:
      return true
    default:
      return false
  }
}
