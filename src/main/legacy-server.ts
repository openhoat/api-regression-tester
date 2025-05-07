import { configSpec } from '../config'
import { createServer } from '../server/legacy'
import { buildConfig } from '../util/config-builder'

const { logLevel } = buildConfig(configSpec)

createServer({ logLevel })
  .start()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
