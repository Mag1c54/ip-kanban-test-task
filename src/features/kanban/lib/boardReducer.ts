import type { Task, TaskType } from '../types';
import { sortTasks } from './task';

export type BoardAction =
  | { type: 'add'; task: Task }
  | { type: 'update'; task: Task }
  | { type: 'delete'; id: number }
  | { type: 'move'; id: number; to: TaskType };

/**
 * Pure task-list transitions for the board.
 *
 * Every mutation keeps the list sorted by `startDay`, so moving, editing or
 * adding a task immediately lands it in the right place inside its column.
 */
export function boardReducer(tasks: Task[], action: BoardAction): Task[] {
  switch (action.type) {
    case 'add':
      return sortTasks([...tasks, action.task]);

    case 'update':
      return sortTasks(
        tasks.map((task) =>
          task.id === action.task.id ? action.task : task,
        ),
      );

    case 'delete':
      return tasks.filter((task) => task.id !== action.id);

    case 'move':
      return sortTasks(
        tasks.map((task) =>
          task.id === action.id ? { ...task, type: action.to } : task,
        ),
      );

    default:
      return tasks;
  }
}
