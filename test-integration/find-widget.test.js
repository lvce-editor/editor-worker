import { setup } from './setup.js'

export const test = async () => {
  const rpc = await setup()
  const state = {
    value: '',
    matches: new Uint32Array([0, 0]),
    matchIndex: 0,
  }
  const index = 1
  const response = await rpc.invoke('FindWidget.focusIndex', state, index)
  console.log({ response })
}
