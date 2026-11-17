import type { DragEventHandler } from 'react';
import { formatDate } from '../../../shared/lib/date';
import { IconButton } from '../../../shared/components/IconButton';
import { PencilIcon, TrashIcon } from '../../../shared/components/icons';
import { isTaskOverdue } from '../lib/isTaskOverdue';
import type { Task } from '../types';

interface TaskCardViewProps {
  task: Task;
  isDragging?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export function TaskCardView({
  task,
  isDragging = false,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
}: TaskCardViewProps) {
  const overdue = isTaskOverdue(task);

  const handleDragStart: DragEventHandler<HTMLElement> = (event) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(task.id));
    onDragStart();
  };

  return (
    <article
      className={[
        'task-card',
        overdue ? 'task-card--overdue' : '',
        isDragging ? 'task-card--dragging' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      title={overdue ? 'Просроченная задача' : undefined}
    >
      <div className="task-card__actions">
        <IconButton
          label="Редактировать задачу"
          title="Редактировать"
          onClick={onEdit}
        >
          <PencilIcon size={14} />
        </IconButton>
        <IconButton
          label="Удалить задачу"
          title="Удалить"
          danger
          onClick={onDelete}
        >
          <TrashIcon size={14} />
        </IconButton>
      </div>

      <dl className="task-card__fields">
        <div className="task-card__row">
          <dt className="task-card__label">Начало:</dt>
          <dd className="task-card__value">{formatDate(task.startDay)}</dd>
        </div>
        <div className="task-card__row">
          <dt className="task-card__label">Окончание:</dt>
          <dd
            className={`task-card__value${overdue ? ' task-card__value--overdue' : ''}`}
          >
            {formatDate(task.endDay)}
          </dd>
        </div>
        <div className="task-card__row">
          <dt className="task-card__label">Описание:</dt>
          <dd className="task-card__value">{task.text}</dd>
        </div>
      </dl>
    </article>
  );
}
