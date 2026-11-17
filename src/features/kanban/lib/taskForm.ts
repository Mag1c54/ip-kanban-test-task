import { formatDate, parseDateInput } from '../../../shared/lib/date';
import type { Task } from '../types';

export type TaskFormField = 'start' | 'end' | 'text';

export type TaskFormErrors = Partial<Record<TaskFormField, boolean>>;

export interface TaskFormValues {
  start: string;
  end: string;
  text: string;
}

export type TaskFormValidation =
  | {
      valid: true;
      values: Pick<Task, 'startDay' | 'endDay' | 'text'>;
    }
  | {
      valid: false;
      errors: TaskFormErrors;
    };

export function createTaskFormValues(
  task: Pick<Task, 'startDay' | 'endDay' | 'text'>,
): TaskFormValues {
  return {
    start: formatDate(task.startDay),
    end: formatDate(task.endDay),
    text: task.text,
  };
}

/**
 * Parses and validates the inline task form. Dates must be complete
 * dd.mm.yyyy values and the description must contain at least one
 * non-whitespace character.
 */
export function validateTaskForm(values: TaskFormValues): TaskFormValidation {
  const startDay = parseDateInput(values.start);
  const endDay = parseDateInput(values.end);
  const text = values.text.trim();

  const errors: TaskFormErrors = {};

  if (startDay === null) {
    errors.start = true;
  }
  if (endDay === null) {
    errors.end = true;
  }
  if (text.length === 0) {
    errors.text = true;
  }

  if (startDay === null || endDay === null || text.length === 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    values: { startDay, endDay, text },
  };
}

export function hasTaskFormErrors(errors: TaskFormErrors): boolean {
  return Boolean(errors.start || errors.end || errors.text);
}

export function getTaskFormErrorMessage(errors: TaskFormErrors): string {
  const datesInvalid = Boolean(errors.start || errors.end);

  if (datesInvalid && errors.text) {
    return 'Введите даты в формате дд.мм.гггг и описание.';
  }
  if (datesInvalid) {
    return 'Введите даты в формате дд.мм.гггг.';
  }
  return 'Введите описание задачи.';
}
