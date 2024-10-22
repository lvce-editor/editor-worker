import * as WidgetRegistry from '../WidgetRegistry/WidgetRegistry.ts'

export const getModule = (id: string) => {
  return WidgetRegistry.get(id)
}
