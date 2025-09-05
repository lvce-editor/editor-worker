import * as FindWidgetWorker from '../FindWidgetWorker/FindWidgetWorker.ts'

export const relaunchWorkers = async () => {
  await FindWidgetWorker.dispose()
  await FindWidgetWorker.launch()
}
