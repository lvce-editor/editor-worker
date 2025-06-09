import { DebugHighlight } from '../DebugHighlight/DebugHighlight.ts'
import * as DebugWorker from '../DebugWorker/DebugWorker.ts'

export const getDebugHighlight = async (debugId: number): Promise<DebugHighlight> => {
  const newInfo = await DebugWorker.invoke('RunAndDebug.getHighlight', debugId)
  return newInfo
}
