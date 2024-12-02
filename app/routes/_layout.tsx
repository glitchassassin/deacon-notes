import {
  Form,
  Link,
  Outlet,
  redirect,
  useLocation,
  useNavigate,
} from "react-router";
import { getUser } from "~/services/auth";
import type { Route } from "./+types/_layout";

export async function clientLoader({ request }: Route.LoaderArgs) {
  const user = getUser();
  console.log({ user });
  if (!user && request.url !== "/login") {
    throw redirect("/login");
  }
  return { user };
}

export default function Layout({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;
  const navigate = useNavigate();
  const location = useLocation();

  if (!user && location.pathname !== "/login") {
    return navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
      <nav className="bg-white dark:bg-gray-700 shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="text-xl font-bold text-gray-800 dark:text-white"
          >
            Deacon Notes
          </Link>
          <div className="flex items-center">
            {user ? (
              <>
                <Link
                  to="/lists"
                  className="text-gray-800 dark:text-white mr-4 ml-4"
                >
                  Contact Lists
                </Link>
                <Form method="post" action="/logout">
                  <button
                    type="submit"
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </Form>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
