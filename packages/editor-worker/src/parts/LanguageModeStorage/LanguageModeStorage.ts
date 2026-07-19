import { RendererWorker } from '@lvce-editor/rpc-registry'

const storageKeyPrefix = 'editor.language-mode:'

const getStorageKey = (uri: string): string => {
  return `${storageKeyPrefix}${uri}`
}

export const get = async (uri: string): Promise<string> => {
  try {
    const languageId = await RendererWorker.invoke('LocalStorage.getJson', getStorageKey(uri))
    return typeof languageId === 'string' ? languageId : ''
  } catch {
    return ''
  }
}

export const set = async (uri: string, languageId: string): Promise<void> => {
  try {
    await RendererWorker.invoke('LocalStorage.setJson', getStorageKey(uri), languageId)
  } catch {
    // Persisting a language override must not prevent the editor from changing language.
  }
}
