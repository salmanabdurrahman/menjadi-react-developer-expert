const RELATIVE_DATE_FORMAT = new Intl.RelativeTimeFormat('id-ID', {
  numeric: 'auto',
});

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

const UNITS = [
  { unit: 'year', value: YEAR },
  { unit: 'month', value: MONTH },
  { unit: 'day', value: DAY },
  { unit: 'hour', value: HOUR },
  { unit: 'minute', value: MINUTE },
  { unit: 'second', value: SECOND },
] as const;

export function formatRelativeDate(date: string | Date, baseDate = new Date()) {
  const targetDate = date instanceof Date ? date : new Date(date);
  const diff = targetDate.getTime() - baseDate.getTime();
  const absDiff = Math.abs(diff);

  if (Number.isNaN(targetDate.getTime())) {
    return '';
  }

  const matchedUnit = UNITS.find(({ value }) => absDiff >= value) ?? UNITS.at(-1);

  if (!matchedUnit) {
    return 'baru saja';
  }

  return RELATIVE_DATE_FORMAT.format(Math.round(diff / matchedUnit.value), matchedUnit.unit);
}
