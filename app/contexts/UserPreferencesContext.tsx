import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import {
  getFavorites,
  getUserRole,
  setUserRole as setUserRoleStorage,
  toggleFavorite as toggleFavoriteStorage,
  type UserRole,
} from "~/services/auth";

interface UserPreferences {
  favorites: string[];
  role: UserRole | null;
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  toggleFavorite: (id: string) => void;
  setRole: (role: UserRole) => void;
  isPastoralStaff: boolean;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | null>(
  null
);

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>({
    favorites: getFavorites(),
    role: getUserRole(),
  });

  const toggleFavorite = (id: string) => {
    toggleFavoriteStorage(id);
    setPreferences((prev) => ({
      ...prev,
      favorites: prev.favorites.includes(id)
        ? prev.favorites.filter((favId) => favId !== id)
        : [...prev.favorites, id],
    }));
  };

  const setRole = (role: UserRole) => {
    setUserRoleStorage(role);
    setPreferences((prev) => ({
      ...prev,
      role,
    }));
  };

  const isPastoralStaff = useMemo(
    () => preferences.role === "Pastoral Staff",
    [preferences.role]
  );

  return (
    <UserPreferencesContext.Provider
      value={{
        preferences,
        toggleFavorite,
        setRole,
        isPastoralStaff,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error(
      "useUserPreferences must be used within a UserPreferencesProvider"
    );
  }
  return context;
}
