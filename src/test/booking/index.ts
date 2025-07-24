import { join } from 'node:path'
import {
  type HttpSequence,
  loadYamlFile,
  runSequence,
} from '../../util/http-sequence'
import { asserters } from './util/asserters'
import { transformers } from './util/transformers'

const run = async () => {
  const sequence: HttpSequence = await loadYamlFile(
    join(__dirname, 'proposals/proposals-booking.sequence.yml'),
  )
  await runSequence(sequence, { transformers, asserters })
}

void run()
