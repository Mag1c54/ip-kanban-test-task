import rawTasks from './tasks.json';
import { isTask, sortTasks } from '../lib/task';
import type { Task } from '../types';

/** Demo data used only when localStorage has no saved board yet. */
export const seedTasks: Task[] = sortTasks(
  (rawTasks as unknown[]).filter(isTask),
);
