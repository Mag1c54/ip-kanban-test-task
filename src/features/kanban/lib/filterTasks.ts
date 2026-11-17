import { isSameLocalDay, parseDateInput } from '../../../shared/lib/date';
import type { Task } from '../types';

/**
 * Filters tasks by a search query.
 *
 * - A full dd.mm.yyyy date matches tasks whose startDay or endDay falls on
 *   that calendar day.
 * - Any other query is matched case-insensitively against the description.
 * - An empty query returns all tasks unchanged.
 */
export function filterTasks(tasks: Task[], query: string): Task[] {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return tasks;
  }

  const dateQuery = parseDateInput(normalizedQuery);

  if (dateQuery !== null) {
    return tasks.filter(
      (task) =>
        isSameLocalDay(task.startDay, dateQuery) ||
        isSameLocalDay(task.endDay, dateQuery),
    );
  }

  const normalizedLower = normalizedQuery.toLowerCase();

  return tasks.filter((task) =>
    task.text.toLowerCase().includes(normalizedLower),
  );
}
