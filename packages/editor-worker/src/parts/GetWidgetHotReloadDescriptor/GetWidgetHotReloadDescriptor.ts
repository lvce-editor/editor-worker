import { WidgetId } from '@lvce-editor/constants'
import * as FindWidgetWorker from '../FindWidgetWorker/FindWidgetWorker.ts'

interface WidgetHotReloadDescriptor {
  readonly invoke: (method: string, ...params: readonly any[]) => Promise<any>
  readonly name: string
}

export const getWidgetHotReloadDescriptor = (widgetId: number): WidgetHotReloadDescriptor | undefined => {
  switch (widgetId) {
    case WidgetId.Find:
      return {
        invoke: FindWidgetWorker.invoke,
        name: 'FindWidget',
      }
    default:
      return undefined
  }
}
