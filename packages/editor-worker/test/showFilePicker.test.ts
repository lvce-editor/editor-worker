import { expect, test } from '@jest/globals'
import { OpenerWorker } from '@lvce-editor/rpc-registry'

const showFilePicker = await import('../src/parts/EditorCommand/EditorCommandSave/showFilePicker.ts')

test('showFilePicker - returns file path', async () => {
  using mockRpc = OpenerWorker.registerMockRpc({
    'Open.showSaveDialog': async () => {
      return { canceled: false, filePath: 'file.txt' }
    },
  })

  const result = await showFilePicker.showFilePicker(0)

  expect(result).toBe('file.txt')
  expect(mockRpc.invocations).toHaveLength(1)
  expect(mockRpc.invocations[0]).toEqual(['Open.showSaveDialog', 'Save File', [], 0])
})

test('showFilePicker - returns undefined when no file selected', async () => {
  using mockRpc = OpenerWorker.registerMockRpc({
    'Open.showSaveDialog': async () => {
      return { canceled: true, filePath: '' }
    },
  })

  const result = await showFilePicker.showFilePicker(0)

  expect(result).toBe('')
  expect(mockRpc.invocations).toHaveLength(1)
})

test('showFilePicker - passes correct dialog options', async () => {
  using mockRpc = OpenerWorker.registerMockRpc({
    'Open.showSaveDialog': async (...params: any[]) => {
      return { canceled: false, filePath: 'result.ts' }
    },
  })

  const result = await showFilePicker.showFilePicker(0)

  expect(result).toBe('result.ts')
  expect(mockRpc.invocations).toHaveLength(1)
  expect(mockRpc.invocations[0]).toEqual(['Open.showSaveDialog', 'Save File', [], 0])
})
