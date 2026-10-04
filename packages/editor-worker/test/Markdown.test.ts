import { expect, jest, test } from '@jest/globals'
import { createMockRpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as Markdown from '../src/parts/Markdown/Markdown.ts'

test('converts Markdown to HTML before requesting virtual DOM', async () => {
  const html = '<p>1 &lt; 2 &amp; 3 &gt; 2</p>'
  const dom = [{ childCount: 0, type: 0 }]
  const renderMarkdown = jest.fn<(markdown: string, options: { linksExternal: boolean }) => Promise<string>>(async () => html)
  const getVirtualDom = jest.fn<(html: string) => Promise<typeof dom>>(async () => dom)
  RendererWorker.set(createMockRpc({ commandMap: { 'Markdown.getVirtualDom': getVirtualDom, 'Markdown.renderMarkdown': renderMarkdown } }))
  await expect(Markdown.getVirtualDomFromMarkdown('1 < 2 & 3 > 2')).resolves.toEqual(dom)
  expect(renderMarkdown).toHaveBeenCalledWith('1 < 2 & 3 > 2', { linksExternal: true })
  expect(getVirtualDom).toHaveBeenCalledWith(html)
})
