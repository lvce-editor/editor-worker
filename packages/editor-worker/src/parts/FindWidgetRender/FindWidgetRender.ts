import { FindWidgetState } from '../FindWidgetState/FindWidgetState.ts'

export const renderFull = (oldState: FindWidgetState, newState: FindWidgetState) => {
  const commands = [...newState.commands]
  // @ts-ignore
  newState.commands = []
  return commands
}
