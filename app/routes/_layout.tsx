import { Link, Outlet, redirect, useNavigation } from "react-router";
import { getUser } from "~/services/auth";
import type { Route } from "./+types/_layout";
import { SearchInput } from "~/components/SearchInput";
import { AuthButton } from "~/components/AuthButton";

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
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-800">
      <nav className="fixed top-0 left-0 right-0 z-10 bg-white dark:bg-zinc-700 shadow print:hidden">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex justify-between items-center">
              <Link
                to="/"
                className="text-xl font-bold text-zinc-800 dark:text-white"
              >
                Deacon Notes
              </Link>
              <div className="md:hidden">
                <AuthButton user={user} />
              </div>
            </div>
            <div className="flex-grow">
              <SearchInput />
            </div>
            <div className="hidden md:block">
              <AuthButton user={user} />
            </div>
          </div>
        </div>
        <div
          className={`h-1 bg-sky-500 transition-all duration-300 ease-in-out ${
            navigation.state !== "idle" ? "opacity-100" : "opacity-0"
          }`}
          style={{
            width: navigation.state !== "idle" ? "100%" : "0%",
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
          }}
        />
      </nav>

      <div className="h-24 md:h-16 mt-4 print:hidden"></div>
      <Outlet />
    </div>
  );
}
