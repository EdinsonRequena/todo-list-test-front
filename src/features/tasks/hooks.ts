import {
  listTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
  type Task,
  type TaskListResponse,
} from "../../services/task";
import { useCallback, useEffect, useState } from "react";

export type Status = "all" | "completed" | "pending";

interface Filters extends Record<string, string | number> {
  status: Status;
  q: string;
  page: number;
  limit: number;
}

interface Meta {
  total: number;
  pages: number;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<Filters>({
    status: "all",
    q: "",
    page: 1,
    limit: 4,
  });
  const [meta, setMeta] = useState<Meta>({ total: 0, pages: 1 });
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { items, total, pages }: TaskListResponse = await listTasks(filters);
    setTasks(items);
    setMeta({ total, pages });
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const add = async (d: { title: string; description?: string }) => {
    const t = await createTask(d);

    setTasks((prev) => {
      const updated = [t, ...prev];

      if (updated.length > filters.limit) {
        updated.pop();
      }
      return updated;
    });

    setMeta((prev) => {
      const total = prev.total + 1;
      const pages = Math.ceil(total / filters.limit);
      return { total, pages };
    });
  };

  const edit = async (
    id: number,
    d: { title?: string; description?: string }
  ) => {
    const { task } = await updateTask(id, d);
    setTasks((prev) => prev.map((tk) => (tk.id === id ? task : tk)));
  };

  const toggle = async (id: number) => {
    const t = await toggleTask(id);
    setTasks((prev) => prev.map((tk) => (tk.id === id ? t : tk)));
  };

  const remove = async (id: number) => {
    await deleteTask(id);

    setTasks((prev) => prev.filter((t) => t.id !== id));

    setMeta((prev) => {
      const total = prev.total - 1;
      const pages = Math.max(1, Math.ceil(total / filters.limit));
      return { total, pages };
    });

    setFilters((prev) => {
      const newTotal = meta.total - 1;
      const newPages = Math.max(1, Math.ceil(newTotal / prev.limit));
      if (prev.page > newPages) {
        return { ...prev, page: newPages };
      }
      return prev;
    });
  };

  return {
    tasks,
    loading,
    meta,
    filters,
    setFilters,
    add,
    edit,
    toggle,
    remove,
  };
}
