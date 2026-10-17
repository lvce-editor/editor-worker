import { beforeEach, expect, jest, test } from '@jest/globals'
import * as HoverWidgetFactory from '../src/parts/HoverWidgetFactory/HoverWidgetFactory.ts'

const createInfo = () => ({ documentation: 'First argument.', height: 40, lineInfos: [], width: 100, x: 0, y: 0 })
const state: { info: ReturnType<typeof createInfo> | undefined } = { info: createInfo() }
const documentationVirtualDom = [{ childCount: 0, text: 'First argument.', type: 12 }]
const getVirtualDomFromMarkdown = jest.fn(async (_documentation: string) => documentationVirtualDom)

jest.unstable_mockModule('../src/parts/GetSignatureHelpInfo/GetSignatureHelpInfo.ts', () => ({
  getSignatureHelpInfo: jest.fn(async () => state.info),
}))
jest.unstable_mockModule('../src/parts/Markdown/Markdown.ts', () => ({ getVirtualDomFromMarkdown }))
const LoadSignatureHelpContent = await import('../src/parts/LoadSignatureHelpContent/LoadSignatureHelpContent.ts')

beforeEach(() => {
  jest.clearAllMocks()
  state.info = createInfo()
})

test('renders signature parameter documentation into the hover virtual DOM', async () => {
  const hover = HoverWidgetFactory.create().newState
  const result = await LoadSignatureHelpContent.loadSignatureHelpContent(hover)
  expect(result?.documentationVirtualDom).toEqual(documentationVirtualDom)
  expect(getVirtualDomFromMarkdown).toHaveBeenCalledWith('First argument.')
})

test('clears previous rendered documentation when the new signature has no documentation', async () => {
  state.info = { ...createInfo(), documentation: '' }
  const hover = { ...HoverWidgetFactory.create().newState, documentationVirtualDom }
  const result = await LoadSignatureHelpContent.loadSignatureHelpContent(hover)
  expect(result?.documentationVirtualDom).toEqual([])
  expect(getVirtualDomFromMarkdown).not.toHaveBeenCalled()
})

test('returns no hover outside a signature without rendering Markdown', async () => {
  state.info = undefined
  await expect(LoadSignatureHelpContent.loadSignatureHelpContent(HoverWidgetFactory.create().newState)).resolves.toBeUndefined()
  expect(getVirtualDomFromMarkdown).not.toHaveBeenCalled()
})
