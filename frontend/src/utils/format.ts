export const pluralize = (count: number, singular: string, plural?: string): string => {
  const absCount = Math.abs(count);
  const pluralForm = plural || `${singular}s`;
  return `${count} ${absCount === 1 ? singular : pluralForm}`;
};

// Example usage:
// pluralize(1, 'day') => "1 day"
// pluralize(2, 'day') => "2 days"
// pluralize(0, 'day') => "0 days"
// pluralize(1, 'person', 'people') => "1 person"
// pluralize(2, 'person', 'people') => "2 people" 