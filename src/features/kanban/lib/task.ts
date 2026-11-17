import { addDays, startOfLocalDay } from '../../../shared/lib/date';
import { TASK_TYPES, type Task, type TaskType } from '../types';

export function isTaskType(value: unknown): value is TaskType {
  return (
    typeof value === 'string' &&
    (TASK_TYPES as readonly string[]).includes(value)
  );
}

export function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const task = value as Record<string, unknown>;

  return (
    typeof task.id === 'number' &&
    Number.isFinite(task.id) &&
    isTaskType(task.type) &&
    typeof task.startDay === 'number' &&
    Number.isFinite(task.startDay) &&
    typeof task.endDay === 'number' &&
    Number.isFinite(task.endDay) &&
    typeof task.text === 'string'
  );
}

/** Returns a new list sorted by startDay ascending (id as a stable tie-break). */
export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort(
    (first, second) => first.startDay - second.startDay || first.id - second.id,
  );
}

export function getNextTaskId(tasks: Task[]): number {
  return tasks.reduce((maxId, task) => Math.max(maxId, task.id), 0) + 1;
}

/** Creates an unsaved task draft for the "add" form. */
export function createTaskDraft(
  type: TaskType,
  tasks: Task[],
  now: number = Date.now(),
): Task {
  const today = startOfLocalDay(now);

  return {
    id: getNextTaskId(tasks),
    type,
    startDay: today,
    endDay: addDays(today, 7),
    text: '',
  };
}
