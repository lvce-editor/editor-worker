import * as Assert from '../Assert/Assert.ts'
import * as Character from '../Character/Character.ts'

export const getFileExtensionIndex = (file: string) => {
  Assert.string(file)
  return file.lastIndexOf(Character.Dot)
}

export const getFileExtension = (file: string) => {
  const index = getFileExtensionIndex(file)
  return file.slice(index)
}

export const getNthFileExtension = (file: string, startIndex: number) => {
  return file.lastIndexOf(Character.Dot, startIndex)
}
