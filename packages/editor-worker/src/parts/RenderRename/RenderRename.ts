import type { RenameState } from '../RenameState/RenameState.ts'

export const renderFull = (oldState: RenameState, newState: RenameState) => {
  const commands = [...newState.commands]
  // @ts-ignore
  newState.commands = []
  return commands
}
