import { expect, jest, test } from '@jest/globals'
const invoke = jest.fn<(...args: readonly any[]) => Promise<any>>()
jest.unstable_mockModule('../src/parts/ApplicationRpc/ApplicationRpc.ts', () => ({ invoke }))
const { getBreadcrumbFileIcon } = await import('../src/parts/GetBreadcrumbFileIcon/GetBreadcrumbFileIcon.ts')
test('resolves the filename using the application icon theme', async () => {
  invoke.mockResolvedValue('/icons/package.svg')
  await expect(getBreadcrumbFileIcon('file:///workspace/package.json', 'app')).resolves.toBe('/icons/package.svg')
  expect(invoke).toHaveBeenCalledWith('app', 'IconTheme.getFileIcon', { name: 'package.json' })
})
test('ignores invalid results and unavailable icon themes', async () => {
  invoke.mockResolvedValue(undefined)
  await expect(getBreadcrumbFileIcon('/file.json')).resolves.toBe('')
  invoke.mockRejectedValue(new Error('unavailable'))
  await expect(getBreadcrumbFileIcon('/file.json')).resolves.toBe('')
})
