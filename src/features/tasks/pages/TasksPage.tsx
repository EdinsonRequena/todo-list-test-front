import { useState } from "react";

import { Filters } from "../ui/Filters";
import { TaskCard } from "../ui/TaskCard";
import { TaskForm } from "../ui/TaskForm";

import { Button } from "../../../components/Button";
import { useAuth } from "../../../contexts/useAuth";

import { useTasks } from "../hooks";

import type { Task } from "../../../services/task";

export function TasksPage() {
  const { tasks, loading, filters, setFilters, toggle, remove, add, edit } =
    useTasks();
  const { logout } = useAuth();

  const [q, setQ] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const handleEdit = (t: Task) => {
    setEditing(t);
    setShowForm(true);
  };

  return (
    <div className="mx-auto max-w-2xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <Button className="bg-red-600" onClick={logout}>
          Logout
        </Button>
      </div>

      {/* search + add */}
      <div className="mb-4 flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search..."
          className="flex-1 rounded bg-gray-800 p-2"
        />
        <Button onClick={() => setFilters({ ...filters, q })}>Search</Button>
        <Button onClick={() => setShowForm(true)}>+ New</Button>
      </div>

      <Filters
        status={filters.status}
        onChange={(s) => setFilters({ ...filters, status: s })}
      />

      {loading ? (
        <p className="mt-10 text-center">Loading…</p>
      ) : (
        <ul className="mt-6 space-y-2">
          {tasks.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              onToggle={toggle}
              onDelete={remove}
              onEdit={handleEdit}
            />
          ))}
        </ul>
      )}

      {/* modal */}
      {showForm && (
        <TaskForm
          initial={editing ?? undefined}
          onSave={async (d) => {
            const payload = {
              title: d.title,
              description: d.description ?? undefined,
            };

            if (editing) {
              await edit(editing.id, payload);
            } else {
              await add(payload);
            }
            setEditing(null);
            setShowForm(false);
          }}
          onCancel={() => {
            setEditing(null);
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}
