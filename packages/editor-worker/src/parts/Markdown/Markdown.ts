import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const getVirtualDomFromMarkdown = async (markdown: string) => {
  const html = await RendererWorker.invoke('Markdown.renderMarkdown', markdown, { linksExternal: true })
  return RendererWorker.invoke('Markdown.getVirtualDom', html)
}
