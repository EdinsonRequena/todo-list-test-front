import { useForm } from "react-hook-form";
import { Button } from "../../../components/Button";

interface FormValues {
  title: string;
  description?: string;
}

export interface TaskFormProps {
  initial?: FormValues;
  onSave: (d: FormValues) => Promise<void>;
  onCancel: () => void;
}

export function TaskForm({ initial, onSave, onCancel }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: initial ?? { title: "", description: "" },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <form
        onSubmit={handleSubmit(onSave)}
        className="w-full max-w-md space-y-4 rounded bg-gray-800 p-6"
      >
        <h2 className="text-xl font-bold">
          {initial ? "Edit Task" : "New Task"}
        </h2>

        <div className="space-y-1">
          <label className="text-sm">Title</label>
          <input
            {...register("title", { required: "Title is required" })}
            className="w-full rounded bg-gray-700 p-2"
          />
          {errors.title && (
            <p className="text-xs text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm">Description</label>
          <textarea
            {...register("description")}
            className="w-full resize-none rounded bg-gray-700 p-2"
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" className="bg-gray-600" onClick={onCancel}>
            Cancel
          </Button>
          <Button disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
