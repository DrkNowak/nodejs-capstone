import { ValidationError } from '../errors';

export const toIsoDate = (value?: string | Date) => {
  if (!value) return;

  const parsed = new Date(value);

  if (isNaN(parsed.getTime())) {
    throw new ValidationError('Date filters must be valid dates in YYYY-MM-DD format');
  }

  return parsed.toISOString().slice(0, 10);
};
