import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Listen/Listen.ts', () => ({
  listen: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/RegisterWidgets/RegisterWidgets.ts', () => ({
  registerWidgets: jest.fn(),
}))

const Main = await import('../src/parts/Main/Main.ts')
const Listen = await import('../src/parts/Listen/Listen.ts')
const RegisterWidgets = await import('../src/parts/RegisterWidgets/RegisterWidgets.ts')

test('main', async () => {
  await Main.main()
  expect(Listen.listen).toHaveBeenCalledTimes(1)
  expect(RegisterWidgets.registerWidgets).toHaveBeenCalledTimes(1)
})
