import type { Task } from '../../types';
import { boardReducer } from '../boardReducer';

const task = (
  id: number,
  startDay: number,
  text = `Task ${id}`,
): Task => ({
  id,
  type: 'todo',
  startDay,
  endDay: startDay + 7,
  text,
});

describe('boardReducer', () => {
  it('adds a task and keeps the list sorted by startDay', () => {
    const first = task(1, 500);
    const second = task(2, 100);

    expect(boardReducer([first], { type: 'add', task: second })).toEqual([
      second,
      first,
    ]);
  });

  it('updates an existing task and re-sorts the list', () => {
    const first = task(1, 100);
    const second = task(2, 200);
    const updated = { ...second, startDay: 50, text: 'Updated' };

    expect(
      boardReducer([first, second], { type: 'update', task: updated }),
    ).toEqual([updated, first]);
  });

  it('deletes only the requested task', () => {
    const first = task(1, 100);
    const second = task(2, 200);

    expect(boardReducer([first, second], { type: 'delete', id: 1 })).toEqual([
      second,
    ]);
  });

  it('moves a task to another column without changing its dates', () => {
    const first = task(1, 100);
    const second = task(2, 200);

    const result = boardReducer([first, second], {
      type: 'move',
      id: 2,
      to: 'review',
    });

    expect(result[1]).toEqual({ ...second, type: 'review' });
    expect(result[0]).toEqual(first);
  });

  it('keeps the same list when the target id does not exist', () => {
    const tasks = [task(1, 100)];

    expect(boardReducer(tasks, { type: 'delete', id: 99 })).toEqual(tasks);
    expect(boardReducer(tasks, { type: 'move', id: 99, to: 'done' })).toEqual(
      tasks,
    );
  });
});
