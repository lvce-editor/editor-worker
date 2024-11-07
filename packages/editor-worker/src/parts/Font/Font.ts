import * as FontState from '../FontState/FontState.ts'
import * as LoadFont from '../LoadFont/LoadFont.ts'

export const ensure = async (fontName: string, fontUrl: string) => {
  if (FontState.isLoaded(fontName)) {
    return
  }
  if (FontState.hasPending(fontName)) {
    return FontState.getPending(fontName)
  }
  const promise = LoadFont.loadFont(fontName, fontUrl)
  FontState.setPending(fontName, promise)
  await promise
  FontState.removePending(fontName)
  FontState.setLoaded(fontName)
}
