import { z } from 'zod'
import type { ConfigCustom } from './util/config-builder'

const schema = z.object({
  legacyBaseUrl: z.string().default('http://localhost:3000'),
  actualBaseUrl: z.string().default('http://localhost:3001'),
  logLevel: z
    .enum(['silent', 'fatal', 'error', 'warn', 'info', 'debug', 'trace'])
    .default('warn'),
  timeout: z.number().default(5000),
  modelProvider: z.enum(['openai', 'gemini', 'mistral', 'ollama']),
  model: z.string().optional(),
  googleApiKey: z.string().optional(),
  openaiApiKey: z.string().optional(),
  mistralApiKey: z.string().optional(),
  ollamaBaseUrl: z.string().optional(),
})

export type Config = z.infer<typeof schema>

const custom: ConfigCustom<Config> = {}

export const configSpec = { schema, custom }
