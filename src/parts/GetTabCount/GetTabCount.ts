export const getTabCount = (string: string) => {
  let count = 0
  for (const element of string) {
    if (element === '\t') {
      count++
    }
  }
  return count
}
