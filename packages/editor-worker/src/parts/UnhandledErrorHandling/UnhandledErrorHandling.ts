export const handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
  event.preventDefault()
  console.error(`[editor-worker] Unhandled Rejection: ${event.reason}`)
}

export const handleUnhandledError = (message: any, filename: any, lineno: any, colno: any, error: any): boolean => {
  console.error(`[editor-worker] Unhandled Error: ${error}`)
  return true
}
