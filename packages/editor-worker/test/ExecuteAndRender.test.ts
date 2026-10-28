import { beforeEach, expect, jest, test } from '@jest/globals'
import type { EditorState } from '../src/parts/State/State.ts'

const renderDirect2 = jest.fn<(...args: readonly unknown[]) => Promise<readonly unknown[]>>()
jest.unstable_mockModule('../src/parts/RenderDirect2/RenderDirect2.ts', () => ({ renderDirect2 }))
const Editors = await import('../src/parts/EditorStates/EditorStates.ts')
const Queue = await import('../src/parts/EditorCommandQueue/EditorCommandQueue.ts')
const { executeAndRender } = await import('../src/parts/ExecuteAndRender/ExecuteAndRender.ts')
const uid = 4653

beforeEach(() => {
  jest.clearAllMocks()
  const editor = { lifecycle: { disposed: false }, uid } as EditorState
  Editors.set(uid, editor, editor)
  renderDirect2.mockResolvedValue([['Viewlet.commitPending', uid, 42]])
})

test('renders after the queued command releases its queue and returns ordered commands', async () => {
  const order: string[] = []
  const command = jest.fn(async (id: number, ...args: readonly unknown[]) => {
    expect(args).toEqual([0, false, false, 40, 80, 2, false])
    await Queue.enqueue(id, async () => {
      order.push('edit')
    })
  })
  renderDirect2.mockImplementation(async (id: unknown) => {
    const result = await Queue.enqueue(Number(id), async () => {
      order.push('render')
      return [['Viewlet.commitPending', uid, 42]]
    })
    return result ?? []
  })
  const commands = await executeAndRender(command, uid, [0, false, false, 40, 80, 2, false])
  expect(commands).toEqual([['Viewlet.commitPending', uid, 42]])
  expect(order).toEqual(['edit', 'render'])
})

test('does not render after a failed edit', async () => {
  await expect(
    executeAndRender(
      async () => {
        throw new Error('edit failed')
      },
      uid,
      [],
    ),
  ).rejects.toThrow('edit failed')
  expect(renderDirect2).not.toHaveBeenCalled()
})

test.each(['dispose', 'replace'] as const)('does not render after editor %s', async (mode) => {
  await executeAndRender(
    async () => {
      if (mode === 'dispose') Editors.dispose(uid)
      else {
        const replacement = { lifecycle: { disposed: false }, uid } as EditorState
        Editors.set(uid, replacement, replacement)
      }
    },
    uid,
    [],
  )
  expect(renderDirect2).not.toHaveBeenCalled()
})

test('ignores absent editors and propagates render failures', async () => {
  renderDirect2.mockRejectedValue(new Error('render failed'))
  await expect(executeAndRender(async () => {}, uid, [])).rejects.toThrow('render failed')
  Editors.dispose(uid)
  const command = jest.fn(async () => {})
  expect(await executeAndRender(command, uid, [])).toEqual([])
  expect(command).not.toHaveBeenCalled()
})
