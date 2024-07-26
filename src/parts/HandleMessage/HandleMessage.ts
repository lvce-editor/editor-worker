import * as Callback from '../Callback/Callback.ts'
import * as Command from '../Command/Command.ts'
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

export const handleMessage = (event: any) => {
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
