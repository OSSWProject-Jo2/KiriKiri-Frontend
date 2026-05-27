export type ApiResponse<T> = {
  data: T;
};

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

type ApiClientOptions = RequestInit & {
  authToken?: string;
};

const DEFAULT_API_BASE_URL = "http://localhost:8080";

function getApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
    DEFAULT_API_BASE_URL
  );
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    return null;
  }

  return response.json();
}

export async function apiClient<T>(
  path: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const { authToken, headers, ...fetchOptions } = options;

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
  });

  const body = await parseResponse(response);

  if (!response.ok) {
    const message =
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof body.message === "string"
        ? body.message
        : "API request failed.";

    throw new ApiError(message, response.status, body);
  }

  return body as T;
}
