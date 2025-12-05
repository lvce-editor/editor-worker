import * as ActivateByEvent from '../ActivateByEvent/ActivateByEvent.ts'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.ts'

export const execute = async ({ args, editor, event, method, noProviderFoundMessage, noProviderFoundResult = undefined }: any) => {
  const fullEvent = `${event}:${editor.languageId}`
  await ActivateByEvent.activateByEvent(fullEvent)
  const result = await ExtensionHostWorker.invoke(method, editor.uid, ...args)
  return result
}
