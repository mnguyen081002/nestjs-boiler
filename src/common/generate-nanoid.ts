import * as nanoid from "nanoid";
export function generateId(
  size: number,
  options: { constraint?: number } = { constraint: 0 },
): number {
  const alphabet = "0123456789";
  const nano = nanoid.customAlphabet(alphabet, size);
  return options.constraint + parseInt(nano());
}

// generate transaction id
export function generateTransactionId(): string {
  const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const nano = nanoid.customAlphabet(alphabet, 8);
  return "CDs" + nano() + "e";
}
