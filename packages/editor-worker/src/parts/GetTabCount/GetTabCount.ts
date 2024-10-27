import * as Character from '../Character/Character.ts'

export const getTabCount = (string: string) => {
  let count = 0
  for (const element of string) {
    if (element === Character.Tab) {
      count++
    }
  }
  return count
}
