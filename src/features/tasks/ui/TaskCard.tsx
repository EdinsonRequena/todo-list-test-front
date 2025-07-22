import { Button } from "../../../components/Button";
import type { Task } from "../../../services/task";

interface TaskCardProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (t: Task) => void;
}

export function TaskCard({ task, onToggle, onDelete, onEdit }: TaskCardProps) {
  return (
    <li className="flex justify-between rounded border border-gray-700 p-4">
      <div>
        <h3 className="font-semibold">{task.title}</h3>
        {task.description && (
          <p className="text-sm text-gray-400">{task.description}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={() => onToggle(task.id)}>
          {task.completed ? "✅" : "⬜️"}
        </Button>
        <Button onClick={() => onEdit(task)}>✏️</Button>
        <Button className="bg-red-600" onClick={() => onDelete(task.id)}>
          🗑
        </Button>
      </div>
    </li>
  );
}
