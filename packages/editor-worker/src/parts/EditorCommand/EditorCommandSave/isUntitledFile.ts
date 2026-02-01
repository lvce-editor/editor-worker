export const isUntitledFile = (uri: string): boolean => {
  return uri.startsWith('untitled:')
}
