import * as WidgetRegistry from '../WidgetRegistry/WidgetRegistry.ts'

export const getModule = (id: number) => {
  return WidgetRegistry.get(id)
}
