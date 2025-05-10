import * as Sentry from "@sentry/react";
import { redirect } from "react-router";
const API_URL = "https://api.fluro.io";
const LOCAL_STORAGE_USER_KEY = "fluroUser";
const LOCAL_STORAGE_TOKEN_KEY = "fluroToken";
const LOCAL_STORAGE_TOKEN_EXPIRATION_KEY = "fluroTokenExpiration";
const LOCAL_STORAGE_ROLE_KEY_PREFIX = "fluroUserRole_";

type LoginResponse = {
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
  localStorage.clear(); // remove auth data as well as cached user data
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
      Sentry.captureException(
        new Error("Failed to refresh token: " + (await response.text()))
      );
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

export function getUserRole(): UserRole | null {
  const user = getUser();
  if (!user) return null;
  
  const roleKey = `${LOCAL_STORAGE_ROLE_KEY_PREFIX}${user._id}`;
  const storedRole = localStorage.getItem(roleKey);
  
  return storedRole as UserRole | null;
}

export function setUserRole(role: UserRole): void {
  const user = getUser();
  if (!user) return;
  
  const roleKey = `${LOCAL_STORAGE_ROLE_KEY_PREFIX}${user._id}`;
  localStorage.setItem(roleKey, role);
}

export function hasSelectedRole(): boolean {
  return getUserRole() !== null;
}
