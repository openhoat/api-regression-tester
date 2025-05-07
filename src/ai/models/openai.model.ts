import { ChatOpenAI } from '@langchain/openai'

const defaultOpenAiModel = 'gpt-4o'

export const createOpenAiModel = (config: {
  openaiApiKey: string
  model?: string
  temperature?: number
}) => {
  const {
    openaiApiKey: apiKey,
    model = defaultOpenAiModel,
    temperature = 0,
  } = config
  return new ChatOpenAI({
    apiKey,
    model,
    temperature,
  })
}
