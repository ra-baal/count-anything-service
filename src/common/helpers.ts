export function assertDefined<T>(
  value: T | null | undefined,
  name = "Value",
): T {
  if (value === null || value === undefined) {
    throw new Error(`${name} must be defined.`);
  }

  return value;
}

export function maskEverySecondChar(input: string): string {
  let result = "";

  for (let i = 0; i < input.length; i++) {
    result += i % 2 === 1 ? "*" : input[i];
  }

  return result;
}
