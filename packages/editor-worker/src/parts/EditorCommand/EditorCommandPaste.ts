import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'
import * as Assert from '../Assert/Assert.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as EditorPasteText from './EditorCommandPasteText.ts'

const getImageExtension = (type: string): string => {
  const subtype = type.slice('image/'.length).toLowerCase().split('+', 1)[0]
  if (subtype === 'jpeg') {
    return 'jpg'
  }
  return /^[a-z0-9]+$/.test(subtype) ? subtype : 'png'
}

const getImageUri = (documentUri: string, fileName: string): string => {
  if (URL.canParse(documentUri)) {
    const url = new URL(documentUri)
    url.pathname = `${url.pathname.slice(0, url.pathname.lastIndexOf('/') + 1)}${fileName}`
    url.search = ''
    url.hash = ''
    return url.href
  }
  const slashIndex = documentUri.lastIndexOf('/')
  if (slashIndex === -1) {
    throw new Error('Save the Markdown document before pasting an image.')
  }
  return `${documentUri.slice(0, slashIndex + 1)}${fileName}`
}

const toBinaryString = async (blob: Blob): Promise<string> => {
  const bytes = new Uint8Array(await blob.arrayBuffer())
  const chunks: string[] = []
  for (let index = 0; index < bytes.length; index += 8192) {
    chunks.push(String.fromCodePoint(...bytes.subarray(index, index + 8192)))
  }
  return chunks.join('')
}

const isFileExistsError = (error: unknown): boolean => {
  if (!(error instanceof Error)) {
    return false
  }
  const cause = 'cause' in error ? error.cause : undefined
  return /already exists|EEXIST/i.test(error.message) || (cause !== undefined && isFileExistsError(cause))
}

const writeClipboardImage = async (editor: any, blob: Blob): Promise<{ fileName: string; uri: string }> => {
  const extension = getImageExtension(blob.type)
  for (let index = 0; index < 1000; index++) {
    const fileName = index === 0 ? `image.${extension}` : `image-${index}.${extension}`
    const uri = getImageUri(editor.uri, fileName)
    try {
      await ApplicationRpc.invoke(editor.applicationId, 'FileSystem.createFile', uri)
    } catch (error) {
      if (isFileExistsError(error)) {
        continue
      }
      throw error
    }
    try {
      await ApplicationRpc.invoke(editor.applicationId, 'FileSystem.writeFile', uri, await toBinaryString(blob), 'binary')
      return { fileName, uri }
    } catch (error) {
      try {
        await ApplicationRpc.invoke(editor.applicationId, 'FileSystem.remove', uri)
      } catch {}
      throw error
    }
  }
  throw new Error('Could not find an unused filename for the pasted image.')
}

export const paste = async (editor: any, pastedText?: string) => {
  let imageReadError: unknown
  if (editor.languageId === 'markdown') {
    let image
    try {
      image = await RendererWorker.invoke('ClipBoard.readImage')
    } catch (error) {
      imageReadError = error
    }
    if (image instanceof Blob) {
      let savedImage: { fileName: string; uri: string }
      try {
        savedImage = await writeClipboardImage(editor, image)
      } catch (error) {
        throw new Error('Failed to save the clipboard image beside the Markdown document.', { cause: error })
      }
      const currentEditor = EditorStates.get(editor.uid)?.newState
      if (!currentEditor || currentEditor.uri !== editor.uri || currentEditor.languageId !== 'markdown') {
        try {
          await ApplicationRpc.invoke(editor.applicationId, 'FileSystem.remove', savedImage.uri)
        } catch {}
        throw new Error('The Markdown document changed while saving the clipboard image. Paste the image again.')
      }
      return EditorPasteText.pasteText(currentEditor, `![image](${savedImage.fileName})`)
    }
  }
  const text = pastedText ?? (await RendererWorker.readClipBoardText())
  Assert.string(text)
  if (imageReadError && text.length === 0) {
    throw new Error('Unable to read an image from the clipboard. Check clipboard permissions and try again.', { cause: imageReadError })
  }
  return EditorPasteText.pasteText(editor, text)
}
