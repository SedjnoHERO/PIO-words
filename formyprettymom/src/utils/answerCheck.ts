export const normalizeAnswer = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/ß/g, 'ss')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/[^a-zа-я0-9\s-]/gi, '')
    .replace(/\s+/g, ' ');

export const answersMatch = (
  input: string,
  accepted: string[],
): boolean => {
  const normalized = normalizeAnswer(input);
  if (!normalized) {
    return false;
  }

  return accepted.some((item) => normalizeAnswer(item) === normalized);
};

export const scrambleLetters = (text: string): string[] => {
  const letters = text.replace(/\s+/g, '').split('');
  const shuffled = [...letters];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const temp = shuffled[index];
    shuffled[index] = shuffled[swapIndex];
    shuffled[swapIndex] = temp;
  }

  if (shuffled.join('') === letters.join('') && shuffled.length > 1) {
    const last = shuffled.pop();
    if (last) {
      shuffled.unshift(last);
    }
  }

  return shuffled;
};
