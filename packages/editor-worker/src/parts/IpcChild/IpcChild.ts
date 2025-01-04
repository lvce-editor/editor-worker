import * as IpcChildModule from '../IpcChildModule/IpcChildModule.ts'

// @ts-ignore
export const listen = async ({ method }) => {
  const module = await IpcChildModule.getModule(method)
  // @ts-ignore
  const rawIpc = await module.listen()
  // @ts-ignore
  if (module.signal) {
    // @ts-ignore
    module.signal(rawIpc)
  }
  // @ts-ignore
  const ipc = module.wrap(rawIpc)
  return ipc
}
