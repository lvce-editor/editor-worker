import { expect, jest, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { executeViewletCommand } from '../src/parts/ExecuteViewletCommand/ExecuteViewletCommand.ts'

test('executes a foreground editor command and renders its focus changes', async () => {
  const command = jest.fn(async (_uid: number, _text: string) => {})
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.executeViewletCommand'() {},
  })

  await executeViewletCommand({ 'Editor.type': command }, 42, 'Editor.type', 'abc')

  expect(command).toHaveBeenCalledWith(42, 'abc')
  expect(mockRpc.invocations).toEqual([['Viewlet.executeViewletCommand', 42, '__renderPending', false]])
})

test('does not request a render when the command fails', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.executeViewletCommand'() {},
  })

  await expect(executeViewletCommand({}, 42, 'Editor.missing')).rejects.toThrow('Viewlet command not found: Editor.missing')
  expect(mockRpc.invocations).toEqual([])
})
