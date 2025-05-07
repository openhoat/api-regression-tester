export const toPascalCase = (s: string) =>
  s
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(/\s+/g)
    .join('_')
    .toUpperCase()
