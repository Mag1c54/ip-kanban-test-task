import { startOfLocalDay } from '../../../shared/lib/date';
import type { Task } from '../types';

/**
 * A task is overdue when its deadline is before the start of today.
 * Tasks in the "done" column are never considered overdue.
 *
 * The comparison uses local calendar days: a task whose deadline is today
 * is still on time until the current day is over.
 */
export function isTaskOverdue(
  task: Pick<Task, 'type' | 'endDay'>,
  now: number | Date = Date.now(),
): boolean {
  if (task.type === 'done') {
    return false;
  }

  const todayStart = startOfLocalDay(now instanceof Date ? now.getTime() : now);
  const deadlineStart = startOfLocalDay(task.endDay);

  return deadlineStart < todayStart;
}
