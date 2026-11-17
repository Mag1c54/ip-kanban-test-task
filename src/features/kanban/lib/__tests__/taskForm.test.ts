import {
  createTaskFormValues,
  getTaskFormErrorMessage,
  hasTaskFormErrors,
  validateTaskForm,
} from '../taskForm';

const start = new Date(2025, 0, 19).getTime();
const end = new Date(2025, 0, 30).getTime();

describe('taskForm', () => {
  it('builds form values from a task', () => {
    expect(
      createTaskFormValues({
        startDay: start,
        endDay: end,
        text: 'Сделать тестовое',
      }),
    ).toEqual({
      start: '19.01.2025',
      end: '30.01.2025',
      text: 'Сделать тестовое',
    });
  });

  it('accepts valid dates and trims the description', () => {
    expect(
      validateTaskForm({
        start: '19.01.2025',
        end: '30.01.2025',
        text: '  Сделать тестовое  ',
      }),
    ).toEqual({
      valid: true,
      values: {
        startDay: start,
        endDay: end,
        text: 'Сделать тестовое',
      },
    });
  });

  it('rejects invalid dates and an empty description', () => {
    const result = validateTaskForm({
      start: '31.02.2025',
      end: '',
      text: '   ',
    });

    expect(result.valid).toBe(false);

    if (!result.valid) {
      expect(result.errors).toEqual({ start: true, end: true, text: true });
      expect(hasTaskFormErrors(result.errors)).toBe(true);
      expect(getTaskFormErrorMessage(result.errors)).toBe(
        'Введите даты в формате дд.мм.гггг и описание.',
      );
    }
  });

  it('reports only the date error when the description is present', () => {
    const result = validateTaskForm({
      start: '19.01.2025',
      end: '30.01.2025',
      text: 'Описание',
    });

    expect(result.valid).toBe(true);
  });

  it('selects a human-readable error message', () => {
    expect(getTaskFormErrorMessage({ start: true })).toBe(
      'Введите даты в формате дд.мм.гггг.',
    );
    expect(getTaskFormErrorMessage({ text: true })).toBe(
      'Введите описание задачи.',
    );
    expect(hasTaskFormErrors({})).toBe(false);
  });
});
