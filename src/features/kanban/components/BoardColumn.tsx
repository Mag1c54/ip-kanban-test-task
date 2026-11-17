import type { DragEvent } from 'react';
import {
  ClockIcon,
  DoneIcon,
  EyeIcon,
  PlusIcon,
  ProgressIcon,
} from '../../../shared/components/icons';
import type {
  BoardActions,
  ColumnConfig,
  Task,
  TaskType,
} from '../types';
import { TaskCard } from './TaskCard';

interface BoardColumnProps {
  column: ColumnConfig;
  tasks: Task[];
  draft: Task | null;
  editingId: number | null;
  draggingId: number | null;
  isDragOver: boolean;
  actions: BoardActions;
}

function ColumnIcon({ type }: { type: TaskType }) {
  switch (type) {
    case 'todo':
      return <ClockIcon size={18} />;
    case 'in_progress':
      return <ProgressIcon size={18} />;
    case 'review':
      return <EyeIcon size={18} />;
    case 'done':
      return <DoneIcon size={18} />;
  }
}

export function BoardColumn({
  column,
  tasks,
  draft,
  editingId,
  draggingId,
  isDragOver,
  actions,
}: BoardColumnProps) {
  const handleDragOver = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    actions.dragOverColumn(column.type);
  };

  const handleDragLeave = (event: DragEvent<HTMLElement>) => {
    const relatedTarget = event.relatedTarget;

    if (
      relatedTarget instanceof Node &&
      event.currentTarget.contains(relatedTarget)
    ) {
      return;
    }

    actions.dragLeaveColumn();
  };

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    actions.dropOnColumn(column.type);
  };

  return (
    <section
      className={`column${isDragOver ? ' column--drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      aria-labelledby={`column-title-${column.type}`}
    >
      <header className="column__header">
        <div className="column__title-wrap">
          <span className="column__icon">
            <ColumnIcon type={column.type} />
          </span>
          <h2 className="column__title" id={`column-title-${column.type}`}>
            {column.title}
          </h2>
        </div>
        <button
          className="column__add"
          type="button"
          onClick={() => actions.addTask(column.type)}
          aria-label={`Добавить задачу в колонку ${column.title}`}
          title="Добавить задачу"
        >
          <PlusIcon size={12} />
          <span>Добавить</span>
        </button>
      </header>

      <div className="column__cards">
        {draft ? (
          <TaskCard
            key={`draft-${draft.id}`}
            task={draft}
            isEditing
            isDraft
            actions={actions}
          />
        ) : null}

        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            isEditing={editingId === task.id}
            isDragging={draggingId === task.id}
            actions={actions}
          />
        ))}

        {draggingId !== null && tasks.length === 0 && !draft ? (
          <p className="column__drop-hint">Перетащите задачу сюда</p>
        ) : null}
      </div>
    </section>
  );
}
