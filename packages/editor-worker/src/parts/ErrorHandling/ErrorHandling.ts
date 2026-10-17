import { ErrorWorker } from '@lvce-editor/rpc-registry'

const logError = async (error: unknown, prefix: string): Promise<void> => {
  const prettyError = await ErrorWorker.invoke('Errors.prepare', error)
  await ErrorWorker.invoke('Errors.print', prettyError, prefix)
}

const logFallback = (error: unknown, prefix: string): void => {
  if (prefix) {
    console.error(prefix, error)
    return
  }
  console.error(error)
}

export const handleError = async (error: unknown, prefix = ''): Promise<void> => {
  try {
    await logError(error, prefix)
  } catch (otherError) {
    console.warn('ErrorHandling error', otherError)
    logFallback(error, prefix)
  }
}
