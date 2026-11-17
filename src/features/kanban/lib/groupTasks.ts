import type { Task, TaskType } from '../types';

export function createEmptyTaskGroups(): Record<TaskType, Task[]> {
  return {
    todo: [],
    in_progress: [],
    review: [],
    done: [],
  };
}

/** Groups tasks by status, preserving the incoming order inside each column. */
export function groupTasksByType(tasks: Task[]): Record<TaskType, Task[]> {
  const groups = createEmptyTaskGroups();

  tasks.forEach((task) => {
    groups[task.type].push(task);
  });

  return groups;
}
