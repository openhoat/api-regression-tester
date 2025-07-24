import { expect } from '@jest/globals'

export const anyStringArray = (length?: number) =>
  Array(length).fill(expect.any(String))
