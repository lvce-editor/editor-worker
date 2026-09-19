import type { Rpc } from '@lvce-editor/rpc'
import * as Editors from '../EditorStates/EditorStates.ts'
import * as LaunchRenameWorker from '../LaunchRenameWorker/LaunchRenameWorker.ts'

let workerPromise: Promise<Rpc> | undefined

export const invoke = async (method: string, ...params: readonly any[]): Promise<any> => {
  // eslint-disable-next-line unicorn/no-top-level-assignment-in-function
  workerPromise ||= LaunchRenameWorker.launchRenameWorker()
  const worker = await workerPromise
  return await worker.invoke(method, ...params)
}

export const dispose = async (): Promise<void> => {
  if (Editors.getKeys().length > 1) {
    return
  }
  const promise = workerPromise
  // eslint-disable-next-line unicorn/no-top-level-assignment-in-function
  workerPromise = undefined
  try {
    // eslint-disable-next-line unicorn/prefer-await
    await promise?.then(
      (worker) => worker.dispose(),
      () => {},
    )
  } catch {}
}
