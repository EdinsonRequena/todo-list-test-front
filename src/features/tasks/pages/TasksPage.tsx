import { useState } from "react";
import { useTasks } from "../hooks";
import { Filters } from "../ui/Filters";
import { TaskCard } from "../ui/TaskCard";
import { Button } from "../../../components/Button";

export function TasksPage() {
  const { tasks, loading, filters, setFilters, toggle, remove } = useTasks();
  const [q, setQ] = useState("");

  const applySearch = () => setFilters((f) => ({ ...f, q }));

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="mb-4 text-2xl font-bold">My Tasks</h1>

      {/* Search + filters */}
      <div className="mb-4 flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search..."
          className="flex-1 rounded bg-gray-800 p-2"
        />
        <Button onClick={applySearch}>Search</Button>
      </div>

      <Filters
        status={filters.status}
        onChange={(s) => setFilters((f) => ({ ...f, status: s }))}
      />

      {/* List */}
      {loading ? (
        <p className="mt-10 text-center">Loading…</p>
      ) : (
        <ul className="mt-6 space-y-2">
          {tasks.map((t) => (
            <TaskCard key={t.id} task={t} onToggle={toggle} onDelete={remove} />
          ))}
        </ul>
      )}
    </div>
  );
}
