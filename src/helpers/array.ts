export const isArrayOfType = (arr: unknown, type: string): boolean =>
  Array.isArray(arr) ? arr.every((item) => typeof item === type) : false;
