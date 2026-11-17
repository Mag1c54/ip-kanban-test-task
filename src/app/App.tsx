import { Board } from '../features/kanban/components/Board';
import { KanbanHeader } from '../features/kanban/components/KanbanHeader';
import { useKanbanBoard } from '../features/kanban/hooks/useKanbanBoard';

export function App() {
  const board = useKanbanBoard();

  return (
    <div className="app">
      <KanbanHeader
        query={board.query}
        onQueryChange={board.changeQuery}
      />

      <p className="visually-hidden" role="status" aria-live="polite">
        {board.statusText}
      </p>

      <Board
        tasksByType={board.tasksByType}
        editing={board.editing}
        draggingId={board.draggingId}
        dragOverType={board.dragOverType}
        actions={board.actions}
      />
    </div>
  );
}
