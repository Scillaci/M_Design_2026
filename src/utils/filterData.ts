export function normalizeFilterValue(value: string) {
  return value.trim().toLowerCase();
}

export function toFilterData(values?: string[]) {
  return (values ?? [])
    .map(normalizeFilterValue)
    .filter(Boolean)
    .join(',');
}