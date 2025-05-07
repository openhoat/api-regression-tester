import { createGeminiModel } from './gemini.model'
import { createMistralModel } from './mistral.model'
import { createOllamaModel } from './ollama.model'
import { createOpenAiModel } from './openai.model'

export type ModelProvider = 'gemini' | 'openai' | 'mistral' | 'ollama'

export type ModelConfig = {
  modelProvider: ModelProvider
  model?: string
  temperature?: number
  googleApiKey?: string
  mistralApiKey?: string
  openaiApiKey?: string
  ollamaBaseUrl?: string
}

export const createModel = (config: ModelConfig) => {
  const { modelProvider, model, temperature } = config
  switch (modelProvider) {
    case 'gemini': {
      const { googleApiKey } = config
      if (!googleApiKey) {
        throw new Error('googleApiKey is required.')
      }
      return createGeminiModel({ googleApiKey, model, temperature })
    }
    case 'openai': {
      const { openaiApiKey } = config
      if (!openaiApiKey) {
        throw new Error('openaiApiKey is required.')
      }
      return createOpenAiModel({ openaiApiKey, model, temperature })
    }
    case 'mistral': {
      const { mistralApiKey } = config
      if (!mistralApiKey) {
        throw new Error('mistralApiKey is required.')
      }
      return createMistralModel({ mistralApiKey, model, temperature })
    }
    case 'ollama': {
      const { ollamaBaseUrl } = config
      if (!ollamaBaseUrl) {
        throw new Error('ollamaBaseUrl is required.')
      }
      return createOllamaModel({ ollamaBaseUrl, model, temperature })
    }
    default:
      throw new Error(`Model provider "${modelProvider} not supported.`)
  }
}
