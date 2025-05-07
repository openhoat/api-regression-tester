import { ChatOllama } from '@langchain/ollama'

const defaultOllamaModel = 'mistral'

export const createOllamaModel = (config: {
  ollamaBaseUrl: string
  model?: string
  temperature?: number
}) => {
  const {
    ollamaBaseUrl: baseUrl,
    model = defaultOllamaModel,
    temperature = 0,
  } = config
  return new ChatOllama({
    baseUrl,
    model,
    temperature,
  })
}
