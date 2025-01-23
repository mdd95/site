export function objToStyle(obj: Record<string, string>) {
  return Object.entries(obj)
    .map(([prop, val]) => `${prop}:${val}`)
    .join(';');
}
