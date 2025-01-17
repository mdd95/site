export function prependStyle(
  style: string | null | undefined,
  obj: Record<string, unknown> = {}
): string {
  return (
    Object.entries(obj)
      .map(([prop, val]) => `${prop}: ${val};`)
      .join(' ') + (style ?? '')
  );
}
