export const getFonts = (): FontFaceSet => {
  // @ts-ignore
  return globalThis.fonts || document.fonts
}
