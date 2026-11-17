import type { Task } from '../../types';
import { filterTasks } from '../filterTasks';

const task = (
  id: number,
  text: string,
  startDay: [number, number, number],
  endDay: [number, number, number],
): Task => ({
  id,
  type: 'todo',
  text,
  startDay: new Date(...startDay).getTime(),
  endDay: new Date(...endDay).getTime(),
});

const tasks: Task[] = [
  task(1, 'Сделать тестовое для IP', [2025, 0, 19], [2025, 0, 30]),
  task(2, 'Проверить документацию', [2025, 1, 2], [2025, 1, 5]),
];

describe('filterTasks', () => {
  it('returns every task for an empty query', () => {
    expect(filterTasks(tasks, '   ')).toEqual(tasks);
  });

  it('filters by description case-insensitively', () => {
    expect(filterTasks(tasks, 'ТЕСТОВОЕ')).toEqual([tasks[0]]);
  });

  it('matches a start date in dd.mm.yyyy format', () => {
    expect(filterTasks(tasks, '02.02.2025')).toEqual([tasks[1]]);
  });

  it('matches an end date in dd.mm.yyyy format', () => {
    expect(filterTasks(tasks, '30.01.2025')).toEqual([tasks[0]]);
  });

  it('returns an empty list when nothing matches', () => {
    expect(filterTasks(tasks, '31.02.2025')).toEqual([]);
  });
});
