
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555/api";

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = new Headers(options.headers || {});
  
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    // Add credentials for cookie consistency if needed (though using Bearer token primarily)
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || "API Request Failed");
  }

  return data as T;
}
