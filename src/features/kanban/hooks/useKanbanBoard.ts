import { useEffect, useMemo, useReducer, useState } from 'react';
import type { BoardActions, EditingState, Task, TaskType } from '../types';
import { boardReducer } from '../lib/boardReducer';
import { filterTasks } from '../lib/filterTasks';
import { groupTasksByType } from '../lib/groupTasks';
import { createTaskDraft } from '../lib/task';
import { loadTasks, saveTasks } from '../lib/taskStorage';

/**
 * Owns all board state and side effects.
 *
 * The UI layer only receives the derived view model and a set of actions,
 * while every task mutation goes through the pure `boardReducer`.
 */
export function useKanbanBoard() {
  const [tasks, dispatch] = useReducer(boardReducer, undefined, () => loadTasks());
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<EditingState>(null);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOverType, setDragOverType] = useState<TaskType | null>(null);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const visibleTasks = useMemo(() => filterTasks(tasks, query), [tasks, query]);
  const tasksByType = useMemo(
    () => groupTasksByType(visibleTasks),
    [visibleTasks],
  );

  const actions = useMemo<BoardActions>(() => {
    const clearDragState = () => {
      setDraggingId(null);
      setDragOverType(null);
    };

    return {
      addTask: (type) => {
        setEditing({ mode: 'create', task: createTaskDraft(type, tasks) });
      },

      editTask: (id) => {
        setEditing({ mode: 'edit', id });
      },

      deleteTask: (id) => {
        dispatch({ type: 'delete', id });
        setEditing((current) =>
          current?.mode === 'edit' && current.id === id ? null : current,
        );
        clearDragState();
      },

      cancelEditing: () => {
        setEditing(null);
      },

      saveTask: (task: Task) => {
        const exists = tasks.some((current) => current.id === task.id);

        dispatch(
          exists ? { type: 'update', task } : { type: 'add', task },
        );
        setEditing(null);
      },

      startDragging: (id) => {
        setDraggingId(id);
        setDragOverType(null);
      },

      endDragging: clearDragState,

      dragOverColumn: (type) => {
        setDragOverType((current) => (current === type ? current : type));
      },

      dragLeaveColumn: () => {
        setDragOverType(null);
      },

      dropOnColumn: (type) => {
        if (draggingId !== null) {
          dispatch({ type: 'move', id: draggingId, to: type });
        }

        clearDragState();
      },
    };
  }, [draggingId, tasks]);

  const changeQuery = (value: string) => {
    setQuery(value);
    setEditing(null);
  };

  const statusText = query.trim()
    ? `Найдено задач: ${visibleTasks.length}`
    : `Всего задач: ${tasks.length}`;

  return {
    tasks,
    visibleTasks,
    tasksByType,
    query,
    statusText,
    editing,
    draggingId,
    dragOverType,
    actions,
    changeQuery,
  };
}
