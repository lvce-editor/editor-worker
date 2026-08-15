import type { Rpc } from '@lvce-editor/rpc-registry'
import { getColorPickerWorkerCommandMap } from '../GetColorPickerWorkerCommandMap/GetColorPickerWorkerCommandMap.ts'
import { launchWorker } from '../LaunchWorker/LaunchWorker.ts'

export const launchColorPickerWorker = async (): Promise<Rpc> => {
  const name = 'Color Picker Worker'
  const url = 'colorPickerWorkerMain.js'
  return launchWorker(name, url, undefined, getColorPickerWorkerCommandMap())
}
