export const pluralize = (
  count: number,
  singular: string,
  plural?: string,
): string => {
  const absCount = Math.abs(count);
  const pluralForm = plural || `${singular}s`;
  return `${absCount === 1 ? singular : pluralForm}`;
};
