import { randomInt } from 'crypto';

const chars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const charsCount = chars.length;

export function generateRandomAlphaStr (len: number) {
  const arr = Array.from(
    { length: len },
    () => chars[randomInt(charsCount)],
  );

  return arr.join('');
}
