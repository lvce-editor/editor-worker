export const getHighlights = (item: any) => {
  const { matches } = item
  return matches.slice(1)
}
