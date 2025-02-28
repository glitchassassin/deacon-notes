import { Link, Outlet, redirect, useNavigation } from "react-router";
import { getUser } from "~/services/auth";
import type { Route } from "./+types/_layout";
import { SiteHeader } from "~/components/SiteHeader";

export async function clientLoader({ request }: Route.LoaderArgs) {
  const user = getUser();
  if (!user && request.url !== "/login") {
    throw redirect("/login");
  }
  return { user };
}

export default function Layout({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;
  const navigation = useNavigation();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <SiteHeader user={user} />

      <div className="h-24 md:h-16 mt-4 print:hidden"></div>
      <Outlet />
    </div>
  );
}
