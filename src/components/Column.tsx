import type { DragEvent } from 'react';
import type { ColumnConfig, Task, TaskType } from '../types';
import {
  ClockIcon,
  DoneIcon,
  EyeIcon,
  PlusIcon,
  ProgressIcon,
} from './icons';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  column: ColumnConfig;
  tasks: Task[];
  draft: Task | null;
  editingId: number | null;
  draggingId: number | null;
  isDragOver: boolean;
  onAdd: (type: TaskType) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onCancel: () => void;
  onSave: (task: Task) => void;
  onDragStart: (id: number) => void;
  onDragEnd: () => void;
  onDragOverColumn: (type: TaskType) => void;
  onDragLeaveColumn: () => void;
  onDropColumn: (type: TaskType) => void;
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

export function Column({
  column,
  tasks,
  draft,
  editingId,
  draggingId,
  isDragOver,
  onAdd,
  onEdit,
  onDelete,
  onCancel,
  onSave,
  onDragStart,
  onDragEnd,
  onDragOverColumn,
  onDragLeaveColumn,
  onDropColumn,
}: ColumnProps) {
  const handleDragOver = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    onDragOverColumn(column.type);
  };

  const handleDragLeave = (event: DragEvent<HTMLElement>) => {
    const relatedTarget = event.relatedTarget;

    if (relatedTarget instanceof Node && event.currentTarget.contains(relatedTarget)) {
      return;
    }

    onDragLeaveColumn();
  };

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onDropColumn(column.type);
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
          onClick={() => onAdd(column.type)}
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
            task={draft}
            isEditing
            isDraft
            onEdit={() => undefined}
            onDelete={() => undefined}
            onCancel={onCancel}
            onSave={onSave}
            onDragStart={() => undefined}
            onDragEnd={() => undefined}
          />
        ) : null}

        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            isEditing={editingId === task.id}
            isDragging={draggingId === task.id}
            onEdit={() => onEdit(task.id)}
            onDelete={() => onDelete(task.id)}
            onCancel={onCancel}
            onSave={onSave}
            onDragStart={() => onDragStart(task.id)}
            onDragEnd={onDragEnd}
          />
        ))}

        {draggingId !== null && tasks.length === 0 && !draft ? (
          <p className="column__drop-hint">Перетащите задачу сюда</p>
        ) : null}
      </div>
    </section>
  );
}
