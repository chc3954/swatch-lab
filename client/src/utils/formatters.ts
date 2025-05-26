export const formatCamelCaseToSpaced = (text: string): string => {
  if (!text) {
    return '';
  }

  const spacedText = text
    .replace(/^[a-z]/, (char) => char.toUpperCase())
    .replace(/([a-z])([A-Z])/g, '$1 $2');

  const words = spacedText.split(' ');

  const keywordsToWrap = ['Base', 'Muted', 'Active', 'Hover', 'Disabled', 'Primary'];

  if (words.length > 1) {
    const lastWord = words[words.length - 1];
    if (keywordsToWrap.includes(lastWord)) {
      const mainPart = words.slice(0, -1).join(' ');
      return `${mainPart} (${lastWord.toLowerCase()})`;
    }
  }

  return spacedText;
};
