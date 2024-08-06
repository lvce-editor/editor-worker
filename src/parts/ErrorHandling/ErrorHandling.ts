// @ts-nocheck
import * as PrettyError from '../PrettyError/PrettyError.ts'

const state = {
  /**
   * @type {string[]}
   */
  seenWarnings: [],
}

const logError = async (error) => {
  const prettyError = await PrettyError.prepare(error)
  const prettyErrorString = PrettyError.print(prettyError)
  console.error(prettyErrorString)
  return prettyError
}

export const handleError = async (error) => {
  try {
    const prettyError = await logError(error)
  } catch (otherError) {
    console.warn('ErrorHandling error')
    console.warn(otherError)
    console.error(error)
  }
}

const warn = (...args) => {
  const stringified = JSON.stringify(args)
  if (state.seenWarnings.includes(stringified)) {
    return
  }
  state.seenWarnings.push(stringified)
  console.warn(...args)
}

/**
 * @param {PromiseRejectionEvent} event
 */
const handleUnhandledRejection = async (event) => {
  try {
    event.preventDefault()
    await handleError(event.reason)
  } catch {
    console.error(event.reason)
  }
}

/**
 * @param {ErrorEvent} event
 */
const handleUnhandledError = async (event) => {
  try {
    event.preventDefault()
    await handleError(event.error)
  } catch {
    console.error(event.error)
  }
}
