export const parseArgs = () => {
  const args = process.argv.slice(2)
  return {
    headless: !args.includes('--no-headless'),
    port: 3000,
  }
}
