import { expect, jest, test } from '@jest/globals'
import { createMockRpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as Markdown from '../src/parts/Markdown/Markdown.ts'

test('getVirtualDomFromMarkdown forwards Markdown conversion to the renderer worker', async () => {
  const markdown = jest.fn((_markdown: string) => Promise.resolve([{ childCount: 0, type: 0 }]))
  RendererWorker.set(createMockRpc({ commandMap: { 'Markdown.getVirtualDomFromMarkdown': markdown } }))
  await expect(Markdown.getVirtualDomFromMarkdown('docs')).resolves.toEqual([{ childCount: 0, type: 0 }])
  expect(markdown).toHaveBeenCalledWith('docs')
})
