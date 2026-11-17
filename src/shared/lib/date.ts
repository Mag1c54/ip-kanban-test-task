const pad = (value: number): string => String(value).padStart(2, '0');

/** Formats a timestamp as dd.mm.yyyy in the user's local timezone. */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
}

/** Returns the local start-of-day timestamp for a date/timestamp. */
export function startOfLocalDay(value: number | Date): number {
  const date = value instanceof Date ? value : new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/** Checks whether two timestamps belong to the same local calendar day. */
export function isSameLocalDay(first: number, second: number): boolean {
  return startOfLocalDay(first) === startOfLocalDay(second);
}

/** Adds whole days to a timestamp. */
export function addDays(timestamp: number, days: number): number {
  const date = new Date(timestamp);
  date.setDate(date.getDate() + days);
  return date.getTime();
}

/**
 * Parses a strict dd.mm.yyyy string into a local start-of-day timestamp.
 * Returns null for an invalid or incomplete date.
 */
export function parseDateInput(value: string): number | null {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value.trim());
  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  if (year < 1900 || month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  const date = new Date(year, month - 1, day);
  // new Date(0..99, ...) maps to 1900+, setFullYear keeps the entered year.
  date.setFullYear(year);
  date.setHours(0, 0, 0, 0);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date.getTime();
}

/** Adds dd.mm.yyyy separators while the user types. */
export function maskDateInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  }

  return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
}
