export function assertDefined<T>(
  value: T | null | undefined,
  name = "Value",
): T {
  if (value === null || value === undefined) {
    throw new Error(`${name} must be defined.`);
  }

  return value;
}
