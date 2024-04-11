export function isValidNumber(n: number) {
  return !isNaN(n) && isFinite(n);
}
