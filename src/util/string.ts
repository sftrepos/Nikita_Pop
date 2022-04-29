export const capitalize = (str: string): string =>
  `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

export const generateString = (length: number, chars: string) =>
  Array(length)
    .fill('')
    .map((_) => chars[Math.floor(Math.random() * chars.length)])
    .join('');

export const getPluralizedWithCount = (count: number, string: string) => {
  return count > 1 ? `${count} ${string}s` : `${count} ${string}`;
};
