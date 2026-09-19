import { beforeEach, expect, jest, test } from '@jest/globals'

const launchRenameWorker = jest.fn<() => Promise<any>>()

jest.unstable_mockModule('../src/parts/LaunchRenameWorker/LaunchRenameWorker.ts', () => ({
  launchRenameWorker,
}))

const RenameWorker = await import('../src/parts/RenameWorker/RenameWorker.ts')

beforeEach(async () => {
  await RenameWorker.dispose()
  launchRenameWorker.mockReset()
})

test('dispose terminates the cached worker and allows a fresh worker to be launched', async () => {
  const firstRpc = {
    dispose: jest.fn(),
    invoke: jest.fn<(...args: any[]) => Promise<any>>().mockResolvedValue('result'),
  }
  const secondRpc = {
    dispose: jest.fn(),
    invoke: jest.fn<(...args: any[]) => Promise<any>>().mockResolvedValue('result'),
  }
  launchRenameWorker.mockResolvedValueOnce(firstRpc).mockResolvedValueOnce(secondRpc)

  await RenameWorker.invoke('Rename.create')
  await RenameWorker.dispose()
  await RenameWorker.invoke('Rename.create')

  expect(launchRenameWorker).toHaveBeenCalledTimes(2)
  expect(firstRpc.dispose).toHaveBeenCalledTimes(1)
  expect(secondRpc.dispose).not.toHaveBeenCalled()
})

test('dispose waits for a worker that is still initializing', async () => {
  let resolveLaunch: (rpc: any) => void = () => {}
  const launchPromise = new Promise((resolve) => {
    resolveLaunch = resolve
  })
  const rpc = {
    dispose: jest.fn(),
    invoke: jest.fn<(...args: any[]) => Promise<any>>().mockResolvedValue(undefined),
  }
  launchRenameWorker.mockReturnValueOnce(launchPromise)

  const invocation = RenameWorker.invoke('Rename.create')
  const disposal = RenameWorker.dispose()

  expect(rpc.dispose).not.toHaveBeenCalled()
  resolveLaunch(rpc)
  await invocation
  await disposal

  expect(rpc.dispose).toHaveBeenCalledTimes(1)
})

test('dispose clears a failed initialization', async () => {
  const error = new Error('failed to launch')
  const rpc = {
    dispose: jest.fn(),
    invoke: jest.fn<(...args: any[]) => Promise<any>>().mockResolvedValue(undefined),
  }
  launchRenameWorker.mockRejectedValueOnce(error).mockResolvedValueOnce(rpc)

  await expect(RenameWorker.invoke('Rename.create')).rejects.toBe(error)
  await RenameWorker.dispose()
  await RenameWorker.invoke('Rename.create')

  expect(launchRenameWorker).toHaveBeenCalledTimes(2)
})
