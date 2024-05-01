// Takes a list of items
// if only one item has valid substring, pick it
export function pickSubstring<T>(
  items: T[],
  query: string,
  getResultKey: (result: T) => string
) {
  // if one or no items, return
  if (items.length < 2) return items;

  // If many items...
  // test each for case-ignored substring occurrence
  const occurrence = items.filter((result) =>
    getResultKey(result).toLowerCase().includes(query.toLowerCase())
  );
  // if only one, return that one
  if (occurrence.length === 1) return occurrence;

  // else, return all items
  return items;
}
