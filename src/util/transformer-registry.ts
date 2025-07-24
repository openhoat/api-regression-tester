// biome-ignore lint/suspicious/noExplicitAny: Exception
export type TransformerFn = (value: any, options?: unknown) => unknown

export class TransformerRegistry {
  private registry = new Map<string, TransformerFn>()

  constructor(transformersMap?: Record<string, TransformerFn>) {
    if (transformersMap) {
      for (const [name, fn] of Object.entries(transformersMap)) {
        this.register(name, fn)
      }
    }
  }

  register(name: string, fn: TransformerFn) {
    this.registry.set(name, fn)
  }

  get(name: string): TransformerFn | undefined {
    return this.registry.get(name)
  }
}
