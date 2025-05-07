import { ChatGoogleGenerativeAI } from '@langchain/google-genai'

export const defaultGeminiModel = 'gemini-2.0-flash'

export const createGeminiModel = (config: {
  googleApiKey: string
  model?: string
  temperature?: number
  maxOutputTokens?: number
}) => {
  const {
    googleApiKey: apiKey,
    model = defaultGeminiModel,
    temperature = 0,
    maxOutputTokens = 2048,
  } = config
  return new ChatGoogleGenerativeAI({
    apiKey,
    model,
    temperature,
    maxOutputTokens,
  })
}
