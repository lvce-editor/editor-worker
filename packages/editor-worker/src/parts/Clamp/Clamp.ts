import * as Assert from '../Assert/Assert.ts'

export const clamp = (num: number, min: number, max: number) => {
  Assert.number(num)
  Assert.number(min)
  Assert.number(max)
  return Math.min(Math.max(num, min), max)
}
