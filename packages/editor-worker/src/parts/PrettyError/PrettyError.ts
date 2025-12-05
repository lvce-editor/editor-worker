import * as JoinLines from '../JoinLines/JoinLines.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'

const getErrorMessage = (error: any) => {
  if (!error) {
    return `Error: ${error}`
  }
  let { message } = error
  while (error.cause) {
    error = error.cause
    message += `: ${error}`
  }
  return message
}

const prepareErrorMessageWithCodeFrame = (error: any) => {
  if (!error) {
    return {
      codeFrame: undefined,
      message: error,
      stack: undefined,
      type: 'Error',
    }
  }
  const message = getErrorMessage(error)
  if (error.codeFrame) {
    return {
      codeFrame: error.codeFrame,
      message,
      stack: error.stack,
      type: error.constructor.name,
    }
  }
  return {
    category: error.category,
    codeFrame: error.originalCodeFrame,
    message,
    stack: error.originalStack,
    stderr: error.stderr,
  }
}

const RE_PATH_1 = /\((.*):(\d+):(\d+)\)$/
const RE_PATH_2 = /at (.*):(\d+):(\d+)$/

/**
 *
 * @param {readonly string[]} lines
 * @returns
 */
const getFile = (lines: readonly string[]) => {
  for (const line of lines) {
    if (RE_PATH_1.test(line) || RE_PATH_2.test(line)) {
      return line
    }
  }
  return ''
}

const prepareErrorMessageWithoutCodeFrame = async (error: any) => {
  try {
    const lines = SplitLines.splitLines(error.stack)
    const file = getFile(lines)
    let match = file.match(RE_PATH_1)
    if (!match) {
      match = file.match(RE_PATH_2)
    }
    if (!match) {
      return error
    }
    const relevantStack = JoinLines.joinLines(lines.slice(1))
    const message = getErrorMessage(error)
    return {
      message,
      stack: relevantStack,
      type: error.constructor.name,
    }
  } catch (otherError) {
    console.warn('ErrorHandling Error')
    console.warn(otherError)
    return error
  }
}

export const prepare = async (error: any) => {
  if (error && error.message && error.codeFrame) {
    return prepareErrorMessageWithCodeFrame(error)
  }
  if (error && error.stack) {
    return prepareErrorMessageWithoutCodeFrame(error)
  }
  return error
}

export const print = (error: any) => {
  if (error && error.type && error.message && error.codeFrame) {
    return `${error.type}: ${error.message}\n\n${error.codeFrame}\n\n${error.stack}`
  }
  if (error && error.message && error.codeFrame) {
    return `${error.message}\n\n${error.codeFrame}\n\n${error.stack}`
  }
  if (error && error.type && error.message) {
    return `${error.type}: ${error.message}\n${error.stack}`
  }
  if (error && error.stack) {
    return `${error.stack}`
  }
  if (error === null) {
    return null
  }
  return `${error}`
}

export const getMessage = (error: any) => {
  if (error && error.type && error.message) {
    return `${error.type}: ${error.message}`
  }
  if (error && error.message) {
    return `${error.constructor.name}: ${error.message}`
  }
  return `Error: ${error}`
}
