import * as assert from 'node:assert'

export const test = async (rpc) => {
  const state = {
    value: '',
    matches: new Uint32Array([0, 0]),
    matchIndex: 0,
  }
  const index = 1
  const response = await rpc.invoke('FindWidget.focusIndex', state, index)
  assert.deepEqual(response, {
    value: '',
    matches: new Uint32Array([0, 0]),
    matchIndex: 1,
  })
}
