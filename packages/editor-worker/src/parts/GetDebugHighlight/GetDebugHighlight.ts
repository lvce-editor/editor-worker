import * as DebugWorker from '../DebugWorker/DebugWorker.ts'

export const getDebugHighlight = async (debugId: number): Promise<any> => {
  const newInfo = await DebugWorker.invoke('RunAndDebug.getHighlight', debugId)
  return newInfo
}
