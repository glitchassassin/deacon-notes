import { Outlet, redirect, useNavigation } from "react-router";
import { SiteHeader } from "~/components/SiteHeader";
import { UserPreferencesProvider } from "~/contexts/UserPreferencesContext";
import { getUser, hasSelectedRole } from "~/services/auth";
import type { Route } from "./+types/_layout";

export async function clientLoader({ request }: Route.LoaderArgs) {
  const user = getUser();
  if (!user && request.url !== "/login") {
    throw redirect("/login");
  }

  // If user is logged in but hasn't selected a role, redirect to settings
  // Skip this check for login, logout, and settings routes
  const url = new URL(request.url);
  const isExemptRoute =
    url.pathname === "/login" ||
    url.pathname === "/logout" ||
    url.pathname.startsWith("/settings");

  if (user && !hasSelectedRole() && !isExemptRoute) {
    throw redirect("/settings");
  }

  return { user };
}

export default function Layout({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;
  const navigation = useNavigation();

  return (
    <UserPreferencesProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <SiteHeader user={user} />

        <div className="h-24 md:h-16 mt-4 print:hidden"></div>
        <Outlet />
      </div>
    </UserPreferencesProvider>
  );
}
