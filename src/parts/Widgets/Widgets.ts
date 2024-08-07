import * as WidgetModules from '../WidgetModules/WidgetModules.ts'

export const getModule = (id: string) => {
  return WidgetModules.get(id)
}
