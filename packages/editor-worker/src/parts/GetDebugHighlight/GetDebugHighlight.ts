import * as DebugWorker from '../DebugWorker/DebugWorker.ts'

export const getDebugHighlight = async (): Promise<any> => {
  const newInfo = await DebugWorker.invoke('RunAndDebug.getHighlight')
  return newInfo
}
