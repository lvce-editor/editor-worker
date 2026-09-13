import { execa } from 'execa'
import { root } from './root.ts'

const main = async (): Promise<void> => {
  await execa('npm', ['run', 'build'], { cwd: root, stdio: 'inherit' })
  execa(`npm`, ['run', 'build:watch'], {
    cwd: root,
    stdio: 'inherit',
  })
  execa('node', ['packages/server/src/server.js', '--test-path=packages/e2e'], {
    cwd: root,
    stdio: 'inherit',
  })
}

main()
