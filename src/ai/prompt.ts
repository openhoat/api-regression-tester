import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { baseDir } from '../util/base-dir'

const cleanPrompt = (prompt: string) => prompt.trim().replace(/^ {2}/gm, '')

export const question = cleanPrompt(`
  Ajoute une transformation pour passer du champs 'updatedAt' au champs 'updated' :
  - le format de 'updatedAt' est "DD/MM/YYYY"
  - le format souhaité pour 'updated' est "DD/M/YYYY"
`)

export const formatInstructions = () =>
  cleanPrompt(`
  Répond avec une nouvelle version du code source TypeScript fourni, en respectant les critères suivants :
  - Le code source proposé doit être intégral / complet et opérationnel.
  - Le code source proposé doit respecter les bonnes pratiques de développement portées par Biome dont la configuration est fournie.
  - Le code source proposé doit être correctement formatté.
`)

export const template = cleanPrompt(`
  Génère le code source permettant de résoudre la question.
  {format_instructions}
  {biome_config}
  {question}
  {input_source}
`)

export const sourceFilePath = join(
  baseDir,
  'src/test/books/matchers/object-diff.helper.ts',
)
export const loadInputSource = () => readFile(sourceFilePath, 'utf8')

export const biomeConfigFilePath = join(baseDir, 'biome.json')
export const loadBiomeConfig = () => readFile(biomeConfigFilePath, 'utf8')

export const metadata: Record<string, unknown> = {
  input_language: 'fr',
  output_language: 'fr',
}
