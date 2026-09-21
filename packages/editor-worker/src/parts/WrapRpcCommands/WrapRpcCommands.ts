import * as WrapCommands from '../WrapCommands/WrapCommands.ts'

const discardResult = <T extends readonly unknown[]>(command: (...args: T) => unknown) => {
  return async (...args: T): Promise<void> => {
    // State and undo history belong in this worker. Rendering reads changes separately.
    await command(...args)
  }
}

export const wrapCommand = (...args: Parameters<typeof WrapCommands.wrapCommand>) => {
  return discardResult(WrapCommands.wrapCommand(...args))
}

export const wrapFocusCommand = (...args: Parameters<typeof WrapCommands.wrapFocusCommand>) => {
  return discardResult(WrapCommands.wrapFocusCommand(...args))
}
