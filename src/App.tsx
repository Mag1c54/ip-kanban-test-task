import { useEffect, useMemo, useState } from 'react';
import { Column } from './components/Column';
import { SearchBar } from './components/SearchBar';
import {
  COLUMNS,
  type Task,
  type TaskType,
} from './types';
import { filterTasks } from './utils/search';
import { loadTasks, saveTasks } from './utils/storage';
import { createTaskDraft, sortTasks } from './utils/task';

type EditingState =
  | { mode: 'edit'; id: number }
  | { mode: 'create'; task: Task }
  | null;

export function App() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<EditingState>(null);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOverType, setDragOverType] = useState<TaskType | null>(null);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const visibleTasks = useMemo(() => filterTasks(tasks, query), [tasks, query]);

  const tasksByType = useMemo(() => {
    const grouped: Record<TaskType, Task[]> = {
      todo: [],
      in_progress: [],
      review: [],
      done: [],
    };

    visibleTasks.forEach((task) => {
      grouped[task.type].push(task);
    });

    return grouped;
  }, [visibleTasks]);

  const draft = editing?.mode === 'create' ? editing.task : null;
  const editingId = editing?.mode === 'edit' ? editing.id : null;

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setEditing(null);
  };

  const handleAdd = (type: TaskType) => {
    setEditing({ mode: 'create', task: createTaskDraft(type, tasks) });
  };

  const handleEdit = (id: number) => {
    setEditing({ mode: 'edit', id });
  };

  const handleDelete = (id: number) => {
    setTasks((current) => current.filter((task) => task.id !== id));
    setEditing((current) =>
      current?.mode === 'edit' && current.id === id ? null : current,
    );
    setDraggingId(null);
    setDragOverType(null);
  };

  const handleSave = (updatedTask: Task) => {
    setTasks((current) => {
      const exists = current.some((task) => task.id === updatedTask.id);

      return sortTasks(
        exists
          ? current.map((task) =>
              task.id === updatedTask.id ? updatedTask : task,
            )
          : [...current, updatedTask],
      );
    });
    setEditing(null);
  };

  const handleCancel = () => {
    setEditing(null);
  };

  const handleDragStart = (id: number) => {
    setDraggingId(id);
    setDragOverType(null);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverType(null);
  };

  const handleDragOverColumn = (type: TaskType) => {
    setDragOverType((current) => (current === type ? current : type));
  };

  const handleDragLeaveColumn = () => {
    setDragOverType(null);
  };

  const handleDropColumn = (type: TaskType) => {
    if (draggingId !== null) {
      setTasks((current) =>
        sortTasks(
          current.map((task) =>
            task.id === draggingId ? { ...task, type } : task,
          ),
        ),
      );
    }

    setDraggingId(null);
    setDragOverType(null);
  };

  const statusText = query.trim()
    ? `Найдено задач: ${visibleTasks.length}`
    : `Всего задач: ${tasks.length}`;

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Your tasks</h1>
        <SearchBar value={query} onChange={handleQueryChange} />
      </header>

      <p className="visually-hidden" role="status" aria-live="polite">
        {statusText}
      </p>

      <main className="board" aria-label="Канбан-доска">
        {COLUMNS.map((column) => (
          <Column
            key={column.type}
            column={column}
            tasks={tasksByType[column.type]}
            draft={draft?.type === column.type ? draft : null}
            editingId={editingId}
            draggingId={draggingId}
            isDragOver={
              draggingId !== null && dragOverType === column.type
            }
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCancel={handleCancel}
            onSave={handleSave}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOverColumn={handleDragOverColumn}
            onDragLeaveColumn={handleDragLeaveColumn}
            onDropColumn={handleDropColumn}
          />
        ))}
      </main>
    </div>
  );
}
