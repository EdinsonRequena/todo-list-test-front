import { useState, useEffect, useCallback } from "react";
import type { Task } from "../../services/task";
import {
  listTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
} from "../../services/task";

interface Filters extends Record<string, string> {
  status: "all" | "completed" | "pending";
  q: string;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<Filters>({ status: "all", q: "" });
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    const data = await listTasks(filters);
    setTasks(data);
    setLoading(false);
  }, [filters]);

  /* load on mount + every filter change */
  useEffect(() => {
    fetch();
  }, [fetch]);

  const add = async (d: { title: string; description?: string }) => {
    const t = await createTask(d);
    setTasks((prev) => [t, ...prev]);
  };

  const edit = async (
    id: number,
    d: { title?: string; description?: string }
  ) => {
    const t = await updateTask(id, d);
    setTasks((prev) => prev.map((tk) => (tk.id === id ? t : tk)));
  };

  const toggle = async (id: number) => {
    const t = await toggleTask(id);
    setTasks((prev) => prev.map((tk) => (tk.id === id ? t : tk)));
  };

  const remove = async (id: number) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return { tasks, loading, filters, setFilters, add, edit, toggle, remove };
}
