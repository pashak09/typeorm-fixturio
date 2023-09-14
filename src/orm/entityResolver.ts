import { isObject } from '@app/utils/isObject';

export function entityResolver(array: readonly unknown[]): readonly unknown[] {
  const result: unknown[] = [];

  for (const data of array) {
    if (Array.isArray(data)) {
      result.push(...data);
    }

    if (isObject(data)) {
      result.push(...Object.values(data));
    }
  }

  return result;
}
