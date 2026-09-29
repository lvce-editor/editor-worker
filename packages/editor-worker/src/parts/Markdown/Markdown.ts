import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const getVirtualDomFromMarkdown = (markdown: string) => RendererWorker.invoke('Markdown.getVirtualDomFromMarkdown', markdown)
