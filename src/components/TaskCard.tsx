import { useEffect, useState, type DragEventHandler, type FormEvent } from 'react';
import type { Task } from '../types';
import { formatDate, maskDateInput, parseDateInput } from '../utils/date';
import { isTaskOverdue } from '../utils/isTaskOverdue';
import { CheckIcon, CloseIcon, PencilIcon, TrashIcon } from './icons';

interface TaskCardProps {
  task: Task;
  isEditing: boolean;
  isDraft?: boolean;
  isDragging?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onCancel: () => void;
  onSave: (task: Task) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

interface FormErrors {
  start?: boolean;
  end?: boolean;
  text?: boolean;
}

function getErrorMessage(errors: FormErrors): string {
  const datesInvalid = Boolean(errors.start || errors.end);

  if (datesInvalid && errors.text) {
    return 'Введите даты в формате дд.мм.гггг и описание.';
  }
  if (datesInvalid) {
    return 'Введите даты в формате дд.мм.гггг.';
  }
  return 'Введите описание задачи.';
}

export function TaskCard({
  task,
  isEditing,
  isDraft = false,
  isDragging = false,
  onEdit,
  onDelete,
  onCancel,
  onSave,
  onDragStart,
  onDragEnd,
}: TaskCardProps) {
  const [startValue, setStartValue] = useState(() => formatDate(task.startDay));
  const [endValue, setEndValue] = useState(() => formatDate(task.endDay));
  const [textValue, setTextValue] = useState(task.text);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (isEditing) {
      setStartValue(formatDate(task.startDay));
      setEndValue(formatDate(task.endDay));
      setTextValue(task.text);
      setErrors({});
    }
  }, [isEditing, task.id, task.startDay, task.endDay, task.text]);

  const overdue = !isEditing && isTaskOverdue(task);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const startDay = parseDateInput(startValue);
    const endDay = parseDateInput(endValue);
    const nextErrors: FormErrors = {
      start: startDay === null,
      end: endDay === null,
      text: textValue.trim().length === 0,
    };

    if (nextErrors.start || nextErrors.end || nextErrors.text) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    onSave({
      ...task,
      startDay: startDay as number,
      endDay: endDay as number,
      text: textValue.trim(),
    });
  };

  const handleDragStart: DragEventHandler<HTMLElement> = (event) => {
    if (isEditing) {
      event.preventDefault();
      return;
    }

    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(task.id));
    onDragStart();
  };

  if (isEditing) {
    return (
      <article className="task-card task-card--editing">
        <form className="task-card__form" onSubmit={handleSubmit} noValidate>
          <label className="task-card__form-row">
            <span>Начало:</span>
            <input
              className="task-card__input"
              value={startValue}
              onChange={(event) => {
                setStartValue(maskDateInput(event.target.value));
                setErrors((current) => ({ ...current, start: false }));
              }}
              placeholder="дд.мм.гггг"
              inputMode="numeric"
              maxLength={10}
              autoComplete="off"
              aria-label="Дата начала"
              aria-invalid={errors.start || undefined}
            />
          </label>

          <label className="task-card__form-row">
            <span>Окончание:</span>
            <input
              className="task-card__input"
              value={endValue}
              onChange={(event) => {
                setEndValue(maskDateInput(event.target.value));
                setErrors((current) => ({ ...current, end: false }));
              }}
              placeholder="дд.мм.гггг"
              inputMode="numeric"
              maxLength={10}
              autoComplete="off"
              aria-label="Дата окончания"
              aria-invalid={errors.end || undefined}
            />
          </label>

          <label className="task-card__form-row task-card__form-row--text">
            <span>Описание:</span>
            <textarea
              className="task-card__textarea"
              value={textValue}
              onChange={(event) => {
                setTextValue(event.target.value);
                setErrors((current) => ({ ...current, text: false }));
              }}
              placeholder="Описание задачи"
              rows={2}
              aria-label="Описание задачи"
              aria-invalid={errors.text || undefined}
            />
          </label>

          {errors.start || errors.end || errors.text ? (
            <p className="task-card__error" role="alert">
              {getErrorMessage(errors)}
            </p>
          ) : null}

          <div className="task-card__form-actions">
            <button
              className="round-button"
              type="button"
              onClick={onCancel}
              aria-label={isDraft ? 'Отменить создание' : 'Отменить редактирование'}
              title="Отмена"
            >
              <CloseIcon size={15} />
            </button>
            <button
              className="round-button round-button--accent"
              type="submit"
              aria-label="Сохранить задачу"
              title="Сохранить"
            >
              <CheckIcon size={16} />
            </button>
          </div>
        </form>
      </article>
    );
  }

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
        <button
          className="icon-button"
          type="button"
          onClick={onEdit}
          aria-label="Редактировать задачу"
          title="Редактировать"
        >
          <PencilIcon size={14} />
        </button>
        <button
          className="icon-button icon-button--danger"
          type="button"
          onClick={onDelete}
          aria-label="Удалить задачу"
          title="Удалить"
        >
          <TrashIcon size={14} />
        </button>
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
