import { COLUMNS } from '../constants';
import type {
  BoardActions,
  EditingState,
  Task,
  TaskType,
} from '../types';
import { BoardColumn } from './BoardColumn';

interface BoardProps {
  tasksByType: Record<TaskType, Task[]>;
  editing: EditingState;
  draggingId: number | null;
  dragOverType: TaskType | null;
  actions: BoardActions;
}

export function Board({
  tasksByType,
  editing,
  draggingId,
  dragOverType,
  actions,
}: BoardProps) {
  const draft = editing?.mode === 'create' ? editing.task : null;
  const editingId = editing?.mode === 'edit' ? editing.id : null;

  return (
    <main className="board" aria-label="Канбан-доска">
      {COLUMNS.map((column) => (
        <BoardColumn
          key={column.type}
          column={column}
          tasks={tasksByType[column.type]}
          draft={draft?.type === column.type ? draft : null}
          editingId={editingId}
          draggingId={draggingId}
          isDragOver={draggingId !== null && dragOverType === column.type}
          actions={actions}
        />
      ))}
    </main>
  );
}
