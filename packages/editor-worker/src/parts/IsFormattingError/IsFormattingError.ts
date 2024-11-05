const expectedErrorMessage = 'Failed to execute formatting provider: FormattingError:'

export const isFormattingError = (error: unknown): boolean => {
  // @ts-ignore
  return error && error instanceof Error && error.message.startsWith(expectedErrorMessage)
}
