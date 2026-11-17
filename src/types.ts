export const TASK_TYPES = ['todo', 'in_progress', 'review', 'done'] as const;

export type TaskType = (typeof TASK_TYPES)[number];

export interface Task {
  /** Unique task id. */
  id: number;
  /** Task status. */
  type: TaskType;
  /** Start timestamp (ms). */
  startDay: number;
  /** Deadline timestamp (ms). */
  endDay: number;
  /** Task description. */
  text: string;
}

export interface ColumnConfig {
  type: TaskType;
  title: string;
}

export const COLUMNS: ColumnConfig[] = [
  { type: 'todo', title: 'To Do' },
  { type: 'in_progress', title: 'In Progress' },
  { type: 'review', title: 'Review' },
  { type: 'done', title: 'Done' },
];
