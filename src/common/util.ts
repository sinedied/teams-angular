import { JsonObject, JsonValue } from "@angular-devkit/core";

const isObject = (object: any) => !!object && typeof object === 'object';

export function deepMergeJson(target: JsonObject, source: JsonObject): JsonObject | JsonValue {
  if (!isObject(target) || !isObject(source)) {
    throw new Error('Needs at least 2 objects to be provided');
  }

  for (const [key, value] of Object.entries(source)) {
    const targetValue = target[key];

    if (Array.isArray(targetValue) && Array.isArray(value)) {
      target[key] = unique([...value, ...targetValue]);
    } else if (isObject(targetValue) && isObject(value)) {
      target[key] = deepMergeJson(targetValue as JsonObject, value as JsonObject);
    } else {
      target[key] = value;
    }
  }

  return target;
}

export function unique<T>(array: T[]) {
  return [...new Set(array)];
}
