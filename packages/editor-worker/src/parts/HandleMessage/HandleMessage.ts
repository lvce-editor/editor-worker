import * as Command from '@lvce-editor/command'
import * as Callback from '../Callback/Callback.ts'
import * as HandleJsonRpcMessage from '../JsonRpc/JsonRpc.ts'

const requiresSocket = () => {
  return false
}

const preparePrettyError = (error: any) => {
  return error
}

const logError = (error: any) => {
  // handled in renderer worker
}

export const handleMessage = async (event: any) => {
  return HandleJsonRpcMessage.handleJsonRpcMessage(
    event.target,
    event.data,
    Command.execute,
    Callback.resolve,
    preparePrettyError,
    logError,
    requiresSocket,
  )
}
