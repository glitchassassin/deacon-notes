import { redirect } from "react-router";

const API_URL = "https://api.fluro.io";
const ACCOUNT_ID = "64fa0b783758fc0034e4768c";
const LOCAL_STORAGE_USER_KEY = "fluroUser";
const LOCAL_STORAGE_TOKEN_KEY = "fluroToken";
const LOCAL_STORAGE_TOKEN_EXPIRATION_KEY = "fluroTokenExpiration";

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
    body: JSON.stringify({ username, password, account: ACCOUNT_ID }),
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

type RefreshTokenResponse = {
  token: string;
  refreshToken?: string;
  expires: string;
};

export async function refreshToken() {
  const user = getUser();
  if (!user) {
    logout();
    throw redirect("/login");
  }
  const response = await fetch(`${API_URL}/token/refresh`, {
    method: "POST",
    body: JSON.stringify({ refreshToken: user.refreshToken }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    logout();
    throw redirect("/login");
  }

  const { token, expires } = (await response.json()) as RefreshTokenResponse;

  localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
  localStorage.setItem(LOCAL_STORAGE_TOKEN_EXPIRATION_KEY, expires);

  return token;
}
