export const getHighlights = (item: any, leadingWord: any) => {
  const { matches } = item
  return matches.slice(1)
}
