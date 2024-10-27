import * as Listen from '../Listen/Listen.ts'
import * as RegisterWidgets from '../RegisterWidgets/RegisterWidgets.ts'

export const main = async () => {
  await Listen.listen()
  RegisterWidgets.registerWidgets()
}
