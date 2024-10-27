export const renderParts = <T>(render: readonly any[], oldState: T, newState: T): readonly any[] => {
  const commands = []
  for (const item of render) {
    if (!item.isEqual(oldState, newState)) {
      commands.push(item.apply(oldState, newState))
    }
  }
  return commands
}
