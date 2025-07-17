import type { Problem } from '../Problem/Problem.ts'

export const getProblems = async (): Promise<readonly Problem[]> => {
  // TODO return problems from currently open editors or ask extension host worker for problems
  return []
}
