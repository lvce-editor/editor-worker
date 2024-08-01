import { setup } from './setup.js'

export const test = async () => {
  const rpc = await setup()
  await rpc.invoke('Editor.create', {
    id: 0,
    content: '',
    fontFamily: '',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 400,
    letterSpacing: 0.5,
  })
}
