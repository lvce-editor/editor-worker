import * as ActivateByEvent from '../ActivateByEvent/ActivateByEvent.ts'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.ts'

export const execute = async ({
  args,
  assetDir,
  editor,
  event,
  method,
  noProviderFoundMessage,
  noProviderFoundResult = undefined,
  platform,
}: any) => {
  const fullEvent = `${event}:${editor.languageId}`
  await ActivateByEvent.activateByEvent(fullEvent, assetDir, platform)
  const result = await ExtensionHostWorker.invoke(method, editor.uid, ...args)
  return result
}
