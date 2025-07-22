import { api } from "./api";

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Converts an object of key-value pairs into a URL query string.
 *
 * @param params - An object where keys are strings and values are either strings or numbers.
 * @returns A URL-encoded query string representation of the input parameters.
 *
 * @example
 * ```typescript
 * const query = toQuery({ page: 1, search: "task" });
 * console.log(query); // Output: "page=1&search=task"
 * ```
 */
const toQuery = (params: Record<string, string | number>) =>
  new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)])
  ).toString();

export const listTasks = (params: Record<string, string | number>) =>
  api.get<Task[]>(`tasks?${toQuery(params)}`);

export const createTask = (body: { title: string; description?: string }) =>
  api.post<Task, typeof body>("tasks", body);

export const updateTask = (
  id: number,
  body: { title?: string; description?: string }
) => api.patch<Task, typeof body>(`tasks/${id}`, body);

export const toggleTask = (id: number) =>
  api.patch<Task, object>(`tasks/${id}/toggle`, {});

export const deleteTask = (id: number) =>
  api.del<{ message: string; task: Task }>(`tasks/${id}`);
