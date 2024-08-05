import * as CommandMap from '../CommandMap/CommandMap.ts'
import * as CommandState from '../CommandState/CommandState.ts'
import * as EditorCompletionWidget from '../EditorCompletionWidget/EditorCompletionWidget.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as IpcChild from '../IpcChild/IpcChild.ts'
import * as IpcChildType from '../IpcChildType/IpcChildType.ts'
import * as Rpc from '../Rpc/Rpc.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'
import * as WidgetModules from '../WidgetModules/WidgetModules.ts'

export const listen = async () => {
  CommandState.registerCommands(CommandMap.commandMap)
  WidgetModules.register(WidgetId.Completion, EditorCompletionWidget)
  const ipc = await IpcChild.listen({ method: IpcChildType.Auto() })
  HandleIpc.handleIpc(ipc)
  Rpc.listen(ipc)
}
