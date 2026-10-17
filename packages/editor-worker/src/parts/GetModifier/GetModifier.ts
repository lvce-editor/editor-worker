import * as ModifierKey from '../ModifierKey/ModifierKey.ts'

export const getModifier = (altKey: boolean, ctrlKey: boolean): number => {
  if (altKey) {
    return ModifierKey.Alt
  }
  if (ctrlKey) {
    return ModifierKey.Ctrl
  }
  return 0
}
