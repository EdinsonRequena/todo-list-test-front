import { useState } from "react";
import { useAuth } from "../../../contexts/useAuth";
import { Button } from "../../../components/Button";
import { Filters } from "../ui/Filters";
import { TaskCard } from "../ui/TaskCard";
import { TaskForm } from "../ui/TaskForm";
import { useTasks } from "../hooks";
import type { Task } from "../../../services/task";

export function TasksPage() {
  const {
    tasks,
    loading,
    meta,
    filters,
    setFilters,
    add,
    edit,
    toggle,
    remove,
  } = useTasks();
  const { logout } = useAuth();

  const [q, setQ] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const openNew = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (t: Task) => {
    setEditing(t);
    setShowForm(true);
  };

  return (
    <div className="mx-auto max-w-2xl p-4">
      {/* top bar */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <Button className="bg-red-600" onClick={logout}>
          Logout
        </Button>
      </div>

      {/* search */}
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search..."
          className="flex-1 rounded bg-gray-800 p-2"
        />
        <Button onClick={() => setFilters({ ...filters, q, page: 1 })}>
          Search
        </Button>
        <Button onClick={openNew}>+ New</Button>
      </div>

      {/* filters */}
      <Filters
        status={filters.status}
        onChange={(s) => setFilters({ ...filters, status: s, page: 1 })}
      />

      {/* list + pagination */}
      {loading ? (
        <p className="mt-10 text-center">Loading…</p>
      ) : (
        <>
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

          <div className="mt-6 flex flex-wrap gap-2">
            {Array.from({ length: meta.pages }).map((_, i) => (
              <Button
                key={i + 1}
                className={filters.page === i + 1 ? "bg-indigo-600" : ""}
                onClick={() => setFilters({ ...filters, page: i + 1 })}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </>
      )}

      {/* modal */}
      {showForm && (
        <TaskForm
          initial={
            editing
              ? { title: editing.title, description: editing.description }
              : undefined
          }
          onSave={async (d) => {
            if (editing) await edit(editing.id, d);
            else await add(d);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
