export const isValidHex = (hex: string): boolean => {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex);
};

export const normalizeHex = (hex: string): string => {
  if (!isValidHex(hex)) return hex;
  if (hex.length === 4) {
    return (
      '#' +
      hex
        .slice(1)
        .split('')
        .map((char) => char + char)
        .join('')
    );
  }
  return hex.toLowerCase();
};
