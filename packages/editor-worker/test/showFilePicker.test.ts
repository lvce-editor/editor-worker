import { expect, test } from '@jest/globals'
import { OpenerWorker } from '@lvce-editor/rpc-registry'

const showFilePicker = await import('../src/parts/EditorCommand/EditorCommandSave/showFilePicker.ts')

test('showFilePicker - returns file path', async () => {
  using mockRpc = OpenerWorker.registerMockRpc({
    'ElectronDialog.showOpenDialog': async () => {
      return ['file.txt']
    },
  })

  const result = await showFilePicker.showFilePicker()

  expect(result).toBe('file.txt')
  expect(mockRpc.invocations).toHaveLength(1)
  expect(mockRpc.invocations[0]).toEqual(['ElectronDialog.showOpenDialog', 'Save File', ['openFile', 'dontAddToRecent', 'showHiddenFiles']])
})

test('showFilePicker - returns undefined when no file selected', async () => {
  using mockRpc = OpenerWorker.registerMockRpc({
    'ElectronDialog.showOpenDialog': async () => {
      return []
    },
  })

  const result = await showFilePicker.showFilePicker()

  expect(result).toBeUndefined()
  expect(mockRpc.invocations).toHaveLength(1)
})

test('showFilePicker - passes correct dialog options', async () => {
  using mockRpc = OpenerWorker.registerMockRpc({
    'ElectronDialog.showOpenDialog': async (...params: any[]) => {
      return ['result.ts']
    },
  })

  const result = await showFilePicker.showFilePicker()

  expect(result).toBe('result.ts')
  expect(mockRpc.invocations).toHaveLength(1)
  expect(mockRpc.invocations[0]).toEqual(['ElectronDialog.showOpenDialog', 'Save File', ['openFile', 'dontAddToRecent', 'showHiddenFiles']])
})
