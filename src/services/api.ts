type JsonBody = object;
type BodyInit = JsonBody | FormData | undefined;
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface Options {
  body?: BodyInit;
  method?: HttpMethod;
  isFormData?: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const getToken = () => localStorage.getItem("token") ?? "";

/**
 * Sends an HTTP request to the specified URL with the provided options and returns the parsed response.
 *
 * @template T - The expected type of the response data.
 * @param {string} url - The endpoint to which the request is sent, relative to the API base URL.
 * @param {Options} [opts={}] - Optional configuration for the request.
 * @param {any} [opts.body] - The body of the request. If `isFormData` is true, it should be a `FormData` object; otherwise, it will be stringified as JSON.
 * @param {string} [opts.method="GET"] - The HTTP method to use for the request (e.g., "GET", "POST").
 * @param {boolean} [opts.isFormData] - Indicates whether the request body is a `FormData` object. If true, the "Content-Type" header is not set to "application/json".
 * @returns {Promise<T>} - A promise that resolves to the parsed response data of type `T`.
 * @throws {Error & { code?: string }} - Throws an error if the response status is not OK (non-2xx). The error includes a `code` property if available in the response.
 */
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
    const err = new Error(data.message ?? "Request error") as Error & {
      code?: string;
    };
    err.code = data.code;
    throw err;
  }
  return data as T;
}

/**
 * A utility object for making HTTP requests.
 */
export const api = {
  /**
   * Sends a GET request to the specified URL.
   *
   * @template T - The expected response type.
   * @param u - The URL to send the GET request to.
   * @returns A promise resolving to the response of type `T`.
   */
  get: <T>(u: string) => request<T>(u),

  /**
   * Sends a POST request to the specified URL with the provided body.
   *
   * @template T - The expected response type.
   * @template B - The type of the request body, which can be `JsonBody` or `FormData`.
   * @param u - The URL to send the POST request to.
   * @param b - The body of the request.
   * @param isFD - Optional flag to indicate if the body is `FormData`. Defaults to `true` if the body is an instance of `FormData`.
   * @returns A promise resolving to the response of type `T`.
   */
  post: <T, B extends JsonBody | FormData = JsonBody>(
    u: string,
    b: B,
    isFD = b instanceof FormData
  ) => request<T>(u, { method: "POST", body: b, isFormData: isFD }),

  /**
   * Sends a PUT request to the specified URL with the provided body.
   *
   * @template T - The expected response type.
   * @template B - The type of the request body, which defaults to `JsonBody`.
   * @param u - The URL to send the PUT request to.
   * @param b - The body of the request.
   * @returns A promise resolving to the response of type `T`.
   */
  put: <T, B extends JsonBody = JsonBody>(u: string, b: B) =>
    request<T>(u, { method: "PUT", body: b }),

  /**
   * Sends a PATCH request to the specified URL with the provided body.
   *
   * @template T - The expected response type.
   * @template B - The type of the request body, which defaults to `JsonBody`.
   * @param u - The URL to send the PATCH request to.
   * @param b - The body of the request.
   * @returns A promise resolving to the response of type `T`.
   */
  patch: <T, B extends JsonBody = JsonBody>(u: string, b: B) =>
    request<T>(u, { method: "PATCH", body: b }),

  /**
   * Sends a DELETE request to the specified URL.
   *
   * @template T - The expected response type, which defaults to `void`.
   * @param u - The URL to send the DELETE request to.
   * @returns A promise resolving to the response of type `T`.
   */
  del: <T = void>(u: string) => request<T>(u, { method: "DELETE" }),
};
