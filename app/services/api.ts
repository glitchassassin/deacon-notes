import { getToken, logout } from "./auth";

export const API_URL = "https://api.fluro.io";

export async function authorizedApiFetch(url: string, options: RequestInit) {
  const token = await getToken();
  if (!token) {
    throw logout();
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (response.status === 401 || response.status === 403) {
    throw logout();
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}
