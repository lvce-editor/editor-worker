import * as Listen from '../Listen/Listen.ts'
import * as RegisterWidgets from '../RegisterWidgets/RegisterWidgets.ts'
import * as SetupUnhandledErrorHandling from '../SetupUnhandledErrorHandling/SetupUnhandledErrorHandling.ts'

export const main = async () => {
  SetupUnhandledErrorHandling.setupUnhandledErrorHandling(globalThis)
  await Listen.listen()
  RegisterWidgets.registerWidgets()
}
