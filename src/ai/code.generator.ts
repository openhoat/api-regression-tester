import { writeFile } from 'node:fs/promises'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { parseMarkdownSourceCode } from '../util/markdown.helper'
import { createModel, type ModelConfig } from './models'
import {
  formatInstructions,
  loadBiomeConfig,
  loadInputSource,
  metadata,
  question,
  sourceFilePath,
  template,
} from './prompt'

const { VERBOSE } = process.env
const verbose = VERBOSE === 'true'

export const generateCode = async (config: ModelConfig) => {
  const model = createModel(config)
  const promptTemplate = ChatPromptTemplate.fromTemplate(template)
  const inputSource = await loadInputSource()
  const biomeConfig = await loadBiomeConfig()
  const partialPrompt = await promptTemplate.partial({
    format_instructions: formatInstructions(),
    biome_config: biomeConfig,
    input_source: inputSource,
  })
  const parser = new StringOutputParser()
  const chain = partialPrompt.pipe(model).pipe(parser)
  const content = await chain.invoke(
    { question },
    {
      metadata,
    },
  )
  if (verbose) {
    console.log('Generated content:', content)
  }
  const code = parseMarkdownSourceCode(content, 'typescript')
  if (!code) {
    throw new Error('No code generated')
  }
  if (verbose) {
    console.log(`Generated code into: ${sourceFilePath}:`, code)
  }
  await writeFile(sourceFilePath, code, 'utf8')
}
