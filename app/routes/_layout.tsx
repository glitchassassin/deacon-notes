import { Form, Link, Outlet, redirect, useNavigation } from "react-router";
import { getUser } from "~/services/auth";
import type { Route } from "./+types/_layout";

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
      <nav className="fixed top-0 left-0 right-0 z-10 bg-white dark:bg-zinc-700 shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="text-xl font-bold text-zinc-800 dark:text-white"
          >
            Deacon Notes
          </Link>
          <div className="flex items-center">
            {user ? (
              <>
                <Link
                  to="/lists"
                  className="text-zinc-800 dark:text-white mr-4 ml-4"
                >
                  Contact Lists
                </Link>
                <Form method="post" action="/logout">
                  <button
                    type="submit"
                    className="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-800 transition"
                  >
                    Logout
                  </button>
                </Form>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-sky-500 text-white px-3 py-1 rounded hover:bg-sky-600 transition"
              >
                Login
              </Link>
            )}
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

      <div className="h-16"></div>
      <Outlet />
    </div>
  );
}
