import { join } from 'node:path'
import { config as dotenvConfig } from 'dotenv'
import { baseDir } from './base-dir'

export const loadDotenvFile = (envName?: string) => {
  const envFilename = envName ? `.env.${envName}` : '.env'
  dotenvConfig({ path: join(baseDir, envFilename), quiet: true })
  const { VERBOSE } = process.env
  const verbose = VERBOSE === 'true'
  if (verbose) {
    console.debug(`Environment loaded from ${envFilename}`)
  }
}

export const loadEnv = (envName?: string) => {
  loadDotenvFile('local')
  if (envName && envName !== 'local') {
    loadDotenvFile(envName)
  }
  loadDotenvFile()
}
