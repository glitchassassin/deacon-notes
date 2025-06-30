import { redirect } from "react-router";
const API_URL = "https://api.fluro.io";
const LOCAL_STORAGE_USER_KEY = "fluroUser";
const LOCAL_STORAGE_TOKEN_KEY = "fluroToken";
const LOCAL_STORAGE_TOKEN_EXPIRATION_KEY = "fluroTokenExpiration";
const LOCAL_STORAGE_USER_PREFERENCES = "fluroUserPreferences";
const LOCAL_STORAGE_ROLE_KEY = "fluroUserRole";

export type LoginResponse = {
  _id: string;
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  accountType: string;
  verified: boolean;
  account: {
    _id: string;
    title: string;
    color: string;
  };
  permissionSets: {
    [key: string]: {
      permissions: string[];
      _id: string;
      title: string;
    };
  };
  token: string;
  expires: string;
  refreshToken: string;
};

export async function login(username: string, password: string) {
  const response = await fetch(`${API_URL}/token/login`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const user = (await response.json()) as LoginResponse;

  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
  localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, user.token);
  localStorage.setItem(LOCAL_STORAGE_TOKEN_EXPIRATION_KEY, user.expires);

  return user;
}

export function logout() {
  // Save user preferences data before clearing localStorage
  const preferencesData = localStorage.getItem(LOCAL_STORAGE_USER_PREFERENCES);

  // Clear all localStorage items
  localStorage.clear();

  // Restore user preferences data if it was set
  if (preferencesData) {
    localStorage.setItem(LOCAL_STORAGE_USER_PREFERENCES, preferencesData);
  }

  return redirect("/login");
}

export function getUser() {
  const user = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
  return user ? (JSON.parse(user) as LoginResponse) : null;
}

export async function getToken() {
  const expiration = localStorage.getItem(LOCAL_STORAGE_TOKEN_EXPIRATION_KEY);
  if (!expiration || new Date(expiration) < new Date()) {
    await refreshToken();
  }

  return localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
}

export function getTokenSync() {
  return localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
}

type RefreshTokenResponse = {
  token: string;
  refreshToken?: string;
  expires: string;
};

export async function refreshToken() {
  const user = getUser();
  if (!user) {
    throw logout();
  }
  try {
    const response = await fetch(`${API_URL}/token/refresh`, {
      method: "POST",
      body: JSON.stringify({ refreshToken: user.refreshToken }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw logout();
    }

    const { token, expires } = (await response.json()) as RefreshTokenResponse;

    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
    localStorage.setItem(LOCAL_STORAGE_TOKEN_EXPIRATION_KEY, expires);

    return token;
  } catch (error) {
    throw logout();
  }
}

export type UserRole = "Deacon" | "Pastoral Staff";

interface UserPreferences {
  userId: string;
  role?: UserRole;
  favorites: string[];
}

export function getUserPreferences(): UserPreferences | null {
  const user = getUser();
  if (!user) return null;

  const storedPreferences = localStorage.getItem(
    LOCAL_STORAGE_USER_PREFERENCES
  );
  if (!storedPreferences) return null;

  try {
    const preferences = JSON.parse(storedPreferences) as UserPreferences;

    // Only return the preferences if they belong to the current user
    if (preferences.userId === user._id) {
      return preferences;
    }

    return null;
  } catch (e) {
    // If there's an error parsing the JSON, clear the invalid data
    localStorage.removeItem(LOCAL_STORAGE_USER_PREFERENCES);
    return null;
  }
}

export function getUserRole(): UserRole | null {
  const preferences = getUserPreferences();
  return preferences?.role ?? null;
}

export function setUserRole(role: UserRole): void {
  const user = getUser();
  if (!user) return;

  const currentPreferences = getUserPreferences() ?? {
    userId: user._id,
    role,
    favorites: [],
  };

  const preferences: UserPreferences = {
    ...currentPreferences,
    role,
  };

  localStorage.setItem(
    LOCAL_STORAGE_USER_PREFERENCES,
    JSON.stringify(preferences)
  );
}

export function getFavorites(): string[] {
  const preferences = getUserPreferences();
  return preferences?.favorites ?? [];
}

export function setFavorites(favorites: string[]): void {
  const user = getUser();
  if (!user) return;

  const currentPreferences = getUserPreferences() ?? {
    userId: user._id,
    role: undefined,
    favorites: [],
  };

  const preferences: UserPreferences = {
    ...currentPreferences,
    favorites,
  };

  localStorage.setItem(
    LOCAL_STORAGE_USER_PREFERENCES,
    JSON.stringify(preferences)
  );
}

export function addFavorite(id: string): void {
  const currentFavorites = getFavorites();
  if (!currentFavorites.includes(id)) {
    setFavorites([...currentFavorites, id]);
  }
}

export function removeFavorite(id: string): void {
  const currentFavorites = getFavorites();
  setFavorites(currentFavorites.filter((favId) => favId !== id));
}

export function toggleFavorite(id: string): void {
  const currentFavorites = getFavorites();
  if (currentFavorites.includes(id)) {
    removeFavorite(id);
  } else {
    addFavorite(id);
  }
}

export function hasSelectedRole(): boolean {
  return getUserRole() !== null;
}
