type BodyInitJSON = Record<string | number | symbol, unknown>;
type BodyInit = BodyInitJSON | FormData | undefined;

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface Options {
  body?: BodyInit;
  method?: HttpMethod;
  isFormData?: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const getToken = () => localStorage.getItem("token") ?? "";

async function request<T>(url: string, opts: Options = {}): Promise<T> {
  const { body, method = "GET", isFormData } = opts;

  const headers: HeadersInit = {};
  if (!isFormData) headers["Content-Type"] = "application/json";

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/${url}`, {
    method,
    headers,
    body:
      body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message ?? "Request error") as Error & {
      code?: string;
    };
    error.code = data.code;
    throw error;
  }
  return data as T;
}

export const api = {
  get: <T>(u: string) => request<T>(u),

  post: <T, B extends BodyInitJSON | FormData = BodyInitJSON>(
    u: string,
    b: B,
    isFD = b instanceof FormData
  ) => request<T>(u, { method: "POST", body: b, isFormData: isFD }),

  put: <T, B extends BodyInitJSON>(u: string, b: B) =>
    request<T>(u, { method: "PUT", body: b }),

  patch: <T, B extends BodyInitJSON>(u: string, b: B) =>
    request<T>(u, { method: "PATCH", body: b }),

  del: (u: string) => request<void>(u, { method: "DELETE" }),
};
