import { configSpec } from '../config'
import { createServer as createActualServer } from '../server/actual'
import { createServer as createLegacyServer } from '../server/legacy'
import { buildConfig } from '../util/config-builder'

const { logLevel } = buildConfig(configSpec)

void Promise.all([
  createLegacyServer({ logLevel }).start(),
  createActualServer({ logLevel }).start(),
]).catch((err) => {
  console.error(err)
  process.exit(1)
})
