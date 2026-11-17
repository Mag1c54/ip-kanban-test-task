import type { Task } from '../../types';
import { loadTasks, saveTasks, TASKS_STORAGE_KEY } from '../taskStorage';

function createStorage(initial: Record<string, string> = {}): Storage {
  const data = new Map(Object.entries(initial));

  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => Array.from(data.keys())[index] ?? null,
    removeItem: (key) => {
      data.delete(key);
    },
    setItem: (key, value) => {
      data.set(key, value);
    },
  };
}

const task: Task = {
  id: 1,
  type: 'todo',
  startDay: new Date(2025, 0, 19).getTime(),
  endDay: new Date(2025, 0, 30).getTime(),
  text: 'Сделать тестовое',
};

describe('taskStorage', () => {
  it('falls back to the JSON demo data without storage', () => {
    expect(loadTasks(null).length).toBeGreaterThan(0);
  });

  it('loads saved tasks sorted by startDay', () => {
    const later = { ...task, id: 2, startDay: task.startDay + 10 };
    const storage = createStorage({
      [TASKS_STORAGE_KEY]: JSON.stringify([later, task]),
    });

    expect(loadTasks(storage)).toEqual([task, later]);
  });

  it('keeps an explicitly saved empty board empty', () => {
    const storage = createStorage({ [TASKS_STORAGE_KEY]: '[]' });

    expect(loadTasks(storage)).toEqual([]);
  });

  it('drops invalid entries and ignores corrupted JSON', () => {
    const storage = createStorage({
      [TASKS_STORAGE_KEY]: JSON.stringify([task, { id: 'broken' }]),
    });
    const corrupted = createStorage({ [TASKS_STORAGE_KEY]: '{not json' });

    expect(loadTasks(storage)).toEqual([task]);
    expect(loadTasks(corrupted).length).toBeGreaterThan(0);
  });

  it('saves the board under the versioned key', () => {
    const storage = createStorage();

    saveTasks([task], storage);

    expect(storage.getItem(TASKS_STORAGE_KEY)).toBe(JSON.stringify([task]));
  });
});
