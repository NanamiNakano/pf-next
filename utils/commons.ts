export function recordToArray<T extends number | string | symbol, R>(record: Record<T, R>) {
  return Object.entries(record).map(([key, label]) => ({ key, label }))
}
