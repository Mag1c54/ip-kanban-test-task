import { TaskCardForm } from './TaskCardForm';
import { TaskCardView } from './TaskCardView';
import type { BoardActions, Task } from '../types';

interface TaskCardProps {
  task: Task;
  isEditing: boolean;
  isDraft?: boolean;
  isDragging?: boolean;
  actions: BoardActions;
}

export function TaskCard({
  task,
  isEditing,
  isDraft = false,
  isDragging = false,
  actions,
}: TaskCardProps) {
  if (isEditing) {
    return (
      <TaskCardForm
        task={task}
        isDraft={isDraft}
        onCancel={actions.cancelEditing}
        onSave={actions.saveTask}
      />
    );
  }

  return (
    <TaskCardView
      task={task}
      isDragging={isDragging}
      onEdit={() => actions.editTask(task.id)}
      onDelete={() => actions.deleteTask(task.id)}
      onDragStart={() => actions.startDragging(task.id)}
      onDragEnd={actions.endDragging}
    />
  );
}
