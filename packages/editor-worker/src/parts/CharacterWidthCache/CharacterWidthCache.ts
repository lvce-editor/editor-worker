import { CacheWorker } from '@lvce-editor/rpc-registry'

const cacheName = 'lvce-editor-character-widths-v1'
const character = 'a'

const getKey = (fontWeight: number, fontSize: number, fontFamily: string, letterSpacing: number): string => {
  return `/character-width/${encodeURIComponent(JSON.stringify([character, fontWeight, fontSize, fontFamily, letterSpacing]))}`
}

export const get = async (fontWeight: number, fontSize: number, fontFamily: string, letterSpacing: number): Promise<number | undefined> => {
  const item = await CacheWorker.getCacheStorageJsonItem(getKey(fontWeight, fontSize, fontFamily, letterSpacing), cacheName)
  const width = item?.value
  if (typeof width !== 'number' || !Number.isFinite(width) || width < 0) {
    return undefined
  }
  return width
}

export const set = async (fontWeight: number, fontSize: number, fontFamily: string, letterSpacing: number, width: number): Promise<void> => {
  await CacheWorker.setCacheStorageJsonItem(getKey(fontWeight, fontSize, fontFamily, letterSpacing), width, cacheName)
}
