import { setup } from './setup.js'

const main = async () => {
  const rpc = await setup()
  rpc.dispose()
}

main()
