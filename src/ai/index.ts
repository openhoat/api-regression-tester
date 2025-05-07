import { configSpec } from '../config'
import { buildConfig } from '../util/config-builder'
import { generateCode } from './code.generator'

const config = buildConfig(configSpec)
void generateCode(config)
