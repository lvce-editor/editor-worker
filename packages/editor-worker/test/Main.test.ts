import { beforeAll, expect, jest, test } from '@jest/globals'

const Main = await import('../src/parts/Main/Main.ts')
const Listen = await import('../src/parts/Listen/Listen.ts')
const RegisterWidgets = await import('../src/parts/RegisterWidgets/RegisterWidgets.ts')

beforeAll(() => {
  globalThis.addEventListener = jest.fn()
})

test.skip('main', async () => {
  // Skipped: Cannot spy on ES module exports (read-only properties)
  const listenSpy = jest.spyOn(Listen, 'listen')
  const registerWidgetsSpy = jest.spyOn(RegisterWidgets, 'registerWidgets')
  await Main.main()
  expect(listenSpy).toHaveBeenCalledTimes(1)
  expect(registerWidgetsSpy).toHaveBeenCalledTimes(1)
  listenSpy.mockRestore()
  registerWidgetsSpy.mockRestore()
})
