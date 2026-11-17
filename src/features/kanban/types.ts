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

export type EditingState =
  | { mode: 'edit'; id: number }
  | { mode: 'create'; task: Task }
  | null;

/** User actions exposed by the board controller to presentational components. */
export interface BoardActions {
  addTask: (type: TaskType) => void;
  editTask: (id: number) => void;
  deleteTask: (id: number) => void;
  cancelEditing: () => void;
  saveTask: (task: Task) => void;
  startDragging: (id: number) => void;
  endDragging: () => void;
  dragOverColumn: (type: TaskType) => void;
  dragLeaveColumn: () => void;
  dropOnColumn: (type: TaskType) => void;
}
