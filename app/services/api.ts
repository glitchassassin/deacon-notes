import { getToken } from "./auth";

export const API_URL = "https://api.fluro.io";

export async function authorizedApiFetch(url: string, options: RequestInit) {
  const token = await getToken();
  if (!token) {
    throw new Error("Not logged in");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}
