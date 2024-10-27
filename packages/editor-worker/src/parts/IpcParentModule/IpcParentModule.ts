import * as IpcParentType from '../IpcParentType/IpcParentType.ts'
import * as IpcParentWithExtensionHostWorker from '../IpcParentWithExtensionHostWorker/IpcParentWithExtensionHostWorker.ts'
import * as IpcParentWithSyntaxHighlightingWorker from '../IpcParentWithSyntaxHighlightingWorker/IpcParentWithSyntaxHighlightingWorker.ts'
import * as IpcParentWithRendererProcess from '../IpcParentWithRendererProcess/IpcParentWithRendererProcess.ts'

export const getModule = (method: any) => {
  switch (method) {
    case IpcParentType.RendererProcess:
      return IpcParentWithRendererProcess
    case IpcParentType.ExtensionHostWorker:
      return IpcParentWithExtensionHostWorker
    case IpcParentType.SyntaxHighlightingWorker:
      return IpcParentWithSyntaxHighlightingWorker
    default:
      throw new Error('unexpected ipc type')
  }
}
