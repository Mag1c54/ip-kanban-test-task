import rawTasks from './tasks.json';
import type { Task } from '../types';
import { isTask, sortTasks } from '../utils/task';

/** Demo data used only when localStorage has no saved board yet. */
export const seedTasks: Task[] = sortTasks(
  (rawTasks as unknown[]).filter(isTask),
);
