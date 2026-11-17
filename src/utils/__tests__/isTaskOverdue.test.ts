import type { TaskType } from '../../types';
import { isTaskOverdue } from '../isTaskOverdue';

const NOW = new Date(2025, 0, 19, 12, 30, 0).getTime();

const timestamp = (
  year: number,
  month: number,
  day: number,
  hours = 0,
  minutes = 0,
): number => new Date(year, month - 1, day, hours, minutes).getTime();

const task = (type: TaskType, endDay: number) => ({ type, endDay });

describe('isTaskOverdue', () => {
  it('returns true when the deadline is before today', () => {
    expect(isTaskOverdue(task('todo', timestamp(2025, 1, 18, 23, 59)), NOW)).toBe(
      true,
    );
  });

  it('returns false when the deadline is today', () => {
    expect(
      isTaskOverdue(task('in_progress', timestamp(2025, 1, 19, 0, 0)), NOW),
    ).toBe(false);
  });

  it('returns false when the deadline is in the future', () => {
    expect(isTaskOverdue(task('review', timestamp(2025, 1, 20)), NOW)).toBe(
      false,
    );
  });

  it('never marks a done task as overdue', () => {
    expect(isTaskOverdue(task('done', timestamp(2020, 5, 10)), NOW)).toBe(
      false,
    );
  });

  it('accepts a Date as the current time', () => {
    expect(
      isTaskOverdue(
        task('todo', timestamp(2025, 1, 18)),
        new Date(2025, 0, 19, 8, 0, 0),
      ),
    ).toBe(true);
  });

  it('compares calendar days, not exact timestamps', () => {
    const lateToday = timestamp(2025, 1, 19, 23, 59);
    const deadlineToday = timestamp(2025, 1, 19, 0, 0);

    expect(isTaskOverdue(task('review', deadlineToday), lateToday)).toBe(false);
  });
});
