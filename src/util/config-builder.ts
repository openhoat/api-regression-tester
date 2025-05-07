import type { ZodType, z } from 'zod'
import { loadEnv } from './env.helper'
import { toPascalCase } from './string.helper'

export type ConfigCustomItem = {
  transform?: z.ZodType<unknown>
  envVarName?: string
}

export type ConfigCustom<T> = Partial<Record<keyof T, ConfigCustomItem>>

export type ConfigSpec<S extends Record<string, ZodType>, T> = {
  schema: z.ZodObject<S>
  custom?: ConfigCustom<T>
}

export type EnvProvider = Record<string, string | undefined>

export const buildConfig = <S extends Record<string, ZodType>, T>(
  { schema, custom }: ConfigSpec<S, T>,
  envProvider: EnvProvider = process.env,
) => {
  if (envProvider === process.env) {
    loadEnv(envProvider.ENVIRONMENT)
  }
  const { VERBOSE } = envProvider
  const verbose = VERBOSE === 'true'
  const configShemaEntries = Object.keys(schema.shape)
  const config = schema.parse(
    configShemaEntries.reduce(
      (acc, name: string) => {
        const spec = custom?.[name as keyof T]
        const envVarName = spec?.envVarName ?? toPascalCase(name)
        const envVarValue = envProvider[envVarName]
        if (envVarValue === undefined) {
          return acc
        }
        const transform = spec?.transform ?? schema.shape[name]
        acc[name] = transform.parse(envVarValue)
        return acc
      },
      {} as Record<string, unknown>,
    ),
  )
  if (verbose) {
    console.debug('Loaded config:', config)
  }
  return config
}
