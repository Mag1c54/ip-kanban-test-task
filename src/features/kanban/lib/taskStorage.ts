import { getLocalStorage } from '../../../shared/lib/localStorage';
import { seedTasks } from '../data/seedTasks';
import type { Task } from '../types';
import { isTask, sortTasks } from './task';

export const TASKS_STORAGE_KEY = 'ip-kanban.tasks.v1';

/**
 * Reads the board from localStorage.
 *
 * If the key does not exist (or the stored value is corrupted), the JSON demo
 * data is used. An explicitly saved empty array is respected, so a user can
 * delete every task and refresh without the demo tasks coming back.
 */
export function loadTasks(storage: Storage | null = getLocalStorage()): Task[] {
  if (!storage) {
    return sortTasks(seedTasks);
  }

  try {
    const raw = storage.getItem(TASKS_STORAGE_KEY);

    if (raw === null) {
      return sortTasks(seedTasks);
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return sortTasks(seedTasks);
    }

    return sortTasks(parsed.filter(isTask));
  } catch {
    return sortTasks(seedTasks);
  }
}

export function saveTasks(
  tasks: Task[],
  storage: Storage | null = getLocalStorage(),
): void {
  if (!storage) {
    return;
  }

  try {
    storage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Storage can be unavailable (private mode, quota exceeded). The board
    // keeps working in memory in that case.
  }
}
