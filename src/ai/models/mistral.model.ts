import { ChatMistralAI } from '@langchain/mistralai'

export const defaultMistralModel = 'codestral-latest'

export const createMistralModel = (config: {
  mistralApiKey: string
  model?: string
  temperature?: number
  maxRetries?: number
}) => {
  const {
    mistralApiKey: apiKey,
    model = defaultMistralModel,
    temperature = 0,
    maxRetries = 2,
  } = config
  return new ChatMistralAI({
    apiKey,
    model,
    temperature,
    maxRetries,
  })
}
