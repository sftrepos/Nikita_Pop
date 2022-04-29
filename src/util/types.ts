export function forceCast<T>(input: unknown): T {
  // ... do runtime checks here
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore <-- forces TS compiler to compile this as-is
  return input;
}
