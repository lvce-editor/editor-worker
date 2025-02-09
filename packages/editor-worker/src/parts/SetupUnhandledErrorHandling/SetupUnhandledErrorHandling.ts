import * as UnhandledErrorHandling from '../UnhandledErrorHandling/UnhandledErrorHandling.ts'

export const setupUnhandledErrorHandling = (global: typeof globalThis): void => {
  // @ts-ignore
  global.addEventListener('error', UnhandledErrorHandling.handleUnhandledError)
  global.addEventListener('unhandledrejection', UnhandledErrorHandling.handleUnhandledRejection)
}
