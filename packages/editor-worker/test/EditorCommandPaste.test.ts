import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('@lvce-editor/rpc-registry', () => ({
  RendererWorker: {
    invoke: jest.fn(),
    readClipBoardText: jest.fn(),
  },
}))

jest.unstable_mockModule('../src/parts/ApplicationRpc/ApplicationRpc.ts', () => ({
  invoke: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/EditorStates/EditorStates.ts', () => ({
  get: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/EditorCommand/EditorCommandPasteText.ts', () => ({
  pasteText: jest.fn(),
}))

const { RendererWorker } = await import('@lvce-editor/rpc-registry')
const ApplicationRpc = await import('../src/parts/ApplicationRpc/ApplicationRpc.ts')
const EditorStates = await import('../src/parts/EditorStates/EditorStates.ts')
const EditorPasteText = await import('../src/parts/EditorCommand/EditorCommandPasteText.ts')
const EditorPaste = await import('../src/parts/EditorCommand/EditorCommandPaste.ts')

test('paste image into markdown document', async () => {
  const image = new Blob([new Uint8Array([0, 255, 42])], { type: 'image/png' })
  // @ts-ignore
  RendererWorker.invoke.mockResolvedValue(image)
  // @ts-ignore
  ApplicationRpc.invoke.mockResolvedValue(undefined)
  const editor = {
    applicationId: 'application-id',
    languageId: 'markdown',
    uri: 'file:///workspace/notes.md',
  }
  // @ts-ignore
  EditorStates.get.mockReturnValue({ newState: editor })
  const binaryContent = '\u{0}\u{FF}*'

  await EditorPaste.paste(editor)

  expect(ApplicationRpc.invoke).toHaveBeenNthCalledWith(1, 'application-id', 'FileSystem.createFile', 'file:///workspace/image.png')
  expect(ApplicationRpc.invoke).toHaveBeenNthCalledWith(
    2,
    'application-id',
    'FileSystem.writeFile',
    'file:///workspace/image.png',
    binaryContent,
    'binary',
  )
  expect(EditorPasteText.pasteText).toHaveBeenCalledWith(editor, '![image](image.png)')
})

test('paste image chooses another filename when the first one exists', async () => {
  const image = new Blob(['image'], { type: 'image/png' })
  // @ts-ignore
  RendererWorker.invoke.mockResolvedValue(image)
  // @ts-ignore
  ApplicationRpc.invoke.mockRejectedValueOnce(new Error('EEXIST'))
  // @ts-ignore
  ApplicationRpc.invoke.mockResolvedValue(undefined)
  const editor = {
    applicationId: undefined,
    languageId: 'markdown',
    uri: '/workspace/notes.md',
  }
  // @ts-ignore
  EditorStates.get.mockReturnValue({ newState: editor })

  await EditorPaste.paste(editor)

  expect(ApplicationRpc.invoke).toHaveBeenNthCalledWith(1, undefined, 'FileSystem.createFile', '/workspace/image.png')
  expect(ApplicationRpc.invoke).toHaveBeenNthCalledWith(2, undefined, 'FileSystem.createFile', '/workspace/image-1.png')
  expect(EditorPasteText.pasteText).toHaveBeenCalledWith(editor, '![image](image-1.png)')
})

test('paste text behavior remains for non-markdown documents', async () => {
  // @ts-ignore
  RendererWorker.readClipBoardText.mockResolvedValue('plain text')
  const editor = {
    languageId: 'plaintext',
  }

  await EditorPaste.paste(editor)

  expect(RendererWorker.invoke).not.toHaveBeenCalled()
  expect(EditorPasteText.pasteText).toHaveBeenCalledWith(editor, 'plain text')
})

test('paste falls back to plain text when reading the image clipboard is unavailable', async () => {
  // @ts-ignore
  RendererWorker.invoke.mockRejectedValue(new Error('Read permission denied.'))
  // @ts-ignore
  RendererWorker.readClipBoardText.mockResolvedValue('plain text')
  const editor = {
    languageId: 'markdown',
  }

  await EditorPaste.paste(editor)

  expect(EditorPasteText.pasteText).toHaveBeenCalledWith(editor, 'plain text')
})

test('paste reports clipboard image permission failure when the clipboard is empty', async () => {
  // @ts-ignore
  RendererWorker.invoke.mockRejectedValue(new Error('Read permission denied.'))
  // @ts-ignore
  RendererWorker.readClipBoardText.mockResolvedValue('')

  await expect(EditorPaste.paste({ languageId: 'markdown' })).rejects.toThrow('Unable to read an image from the clipboard.')
  expect(EditorPasteText.pasteText).not.toHaveBeenCalled()
})

test('paste removes the reserved file and does not insert a broken reference when writing fails', async () => {
  const image = new Blob(['image'], { type: 'image/png' })
  // @ts-ignore
  RendererWorker.invoke.mockResolvedValue(image)
  // @ts-ignore
  ApplicationRpc.invoke.mockImplementation(async (_applicationId, method) => {
    if (method === 'FileSystem.writeFile') {
      throw new Error('disk full')
    }
  })
  const editor = {
    applicationId: undefined,
    languageId: 'markdown',
    uri: '/workspace/notes.md',
  }

  await expect(EditorPaste.paste(editor)).rejects.toThrow('Failed to save the clipboard image beside the Markdown document.')
  expect(ApplicationRpc.invoke).toHaveBeenNthCalledWith(3, undefined, 'FileSystem.remove', '/workspace/image.png')
  expect(EditorPasteText.pasteText).not.toHaveBeenCalled()
})

test('paste removes the image when the document changes during clipboard work', async () => {
  const image = new Blob(['image'], { type: 'image/png' })
  // @ts-ignore
  RendererWorker.invoke.mockResolvedValue(image)
  // @ts-ignore
  ApplicationRpc.invoke.mockResolvedValue(undefined)
  // @ts-ignore
  EditorStates.get.mockReturnValue({ newState: { languageId: 'markdown', uri: 'file:///workspace/other.md' } })
  const editor = {
    applicationId: undefined,
    languageId: 'markdown',
    uid: 1,
    uri: 'file:///workspace/notes.md',
  }

  await expect(EditorPaste.paste(editor)).rejects.toThrow('The Markdown document changed while saving the clipboard image.')
  expect(ApplicationRpc.invoke).toHaveBeenNthCalledWith(3, undefined, 'FileSystem.remove', 'file:///workspace/image.png')
  expect(EditorPasteText.pasteText).not.toHaveBeenCalled()
})
