import { useState, type FormEvent } from 'react';
import { maskDateInput } from '../../../shared/lib/date';
import { RoundButton } from '../../../shared/components/RoundButton';
import { CheckIcon, CloseIcon } from '../../../shared/components/icons';
import {
  createTaskFormValues,
  getTaskFormErrorMessage,
  hasTaskFormErrors,
  validateTaskForm,
  type TaskFormErrors,
  type TaskFormValues,
} from '../lib/taskForm';
import type { Task } from '../types';

interface TaskCardFormProps {
  task: Task;
  isDraft?: boolean;
  onCancel: () => void;
  onSave: (task: Task) => void;
}

export function TaskCardForm({
  task,
  isDraft = false,
  onCancel,
  onSave,
}: TaskCardFormProps) {
  const [values, setValues] = useState<TaskFormValues>(() =>
    createTaskFormValues(task),
  );
  const [errors, setErrors] = useState<TaskFormErrors>({});

  const updateValue = (
    field: keyof TaskFormValues,
    value: string,
    errorField: keyof TaskFormErrors,
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) =>
      current[errorField] ? { ...current, [errorField]: false } : current,
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = validateTaskForm(values);

    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    onSave({ ...task, ...result.values });
  };

  return (
    <article className="task-card task-card--editing">
      <form className="task-card__form" onSubmit={handleSubmit} noValidate>
        <label className="task-card__form-row">
          <span>Начало:</span>
          <input
            className="task-card__input"
            value={values.start}
            onChange={(event) =>
              updateValue('start', maskDateInput(event.target.value), 'start')
            }
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
            value={values.end}
            onChange={(event) =>
              updateValue('end', maskDateInput(event.target.value), 'end')
            }
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
            value={values.text}
            onChange={(event) =>
              updateValue('text', event.target.value, 'text')
            }
            placeholder="Описание задачи"
            rows={2}
            aria-label="Описание задачи"
            aria-invalid={errors.text || undefined}
          />
        </label>

        {hasTaskFormErrors(errors) ? (
          <p className="task-card__error" role="alert">
            {getTaskFormErrorMessage(errors)}
          </p>
        ) : null}

        <div className="task-card__form-actions">
          <RoundButton
            onClick={onCancel}
            aria-label={isDraft ? 'Отменить создание' : 'Отменить редактирование'}
            title="Отмена"
          >
            <CloseIcon size={15} />
          </RoundButton>
          <RoundButton
            accent
            type="submit"
            aria-label="Сохранить задачу"
            title="Сохранить"
          >
            <CheckIcon size={16} />
          </RoundButton>
        </div>
      </form>
    </article>
  );
}
