const STATUSES = ["all", "completed", "pending"] as const;
type Status = (typeof STATUSES)[number];

export interface FiltersProps {
  status: Status;
  onChange: (s: Status) => void;
}

export function Filters({ status, onChange }: FiltersProps) {
  const base =
    "px-3 py-1 rounded hover:bg-gray-700 cursor-pointer text-sm capitalize";
  const active = "bg-indigo-600";

  return (
    <div className="flex gap-2">
      {STATUSES.map((s) => (
        <button
          key={s}
          className={`${base} ${status === s ? active : ""}`}
          onClick={() => onChange(s)}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
