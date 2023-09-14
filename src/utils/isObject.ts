// eslint-disable-next-line @typescript-eslint/ban-types
export function isObject(item: unknown): item is Object {
  return typeof item === 'object' && !Array.isArray(item) && item !== null;
}
