import { Form, redirect } from "react-router";
import { useUserPreferences } from "~/contexts/UserPreferencesContext";
import { type UserRole } from "~/services/auth";
import type { Route } from "./+types/_layout.settings";

export async function clientAction({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const role = formData.get("role") as UserRole;

  if (role && (role === "Deacon" || role === "Pastoral Staff")) {
    return redirect("/");
  }

  return { error: "Invalid role selected" };
}

export default function Settings() {
  const { preferences, setRole } = useUserPreferences();
  const currentRole = preferences.role;

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Select Your Role</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Please select your role to customize the app experience.
        </p>

        <Form
          method="post"
          className="space-y-6"
          onSubmit={(e) => {
            const formData = new FormData(e.currentTarget);
            const role = formData.get("role") as UserRole;
            if (role) {
              setRole(role);
            }
          }}
        >
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="deacon-role"
                name="role"
                type="radio"
                value="Deacon"
                defaultChecked={currentRole === "Deacon"}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="deacon-role"
                className="ml-3 block text-sm font-medium"
              >
                Deacon
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  Access to Deacon Care Group contact lists only
                </p>
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="pastoral-role"
                name="role"
                type="radio"
                value="Pastoral Staff"
                defaultChecked={currentRole === "Pastoral Staff"}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="pastoral-role"
                className="ml-3 block text-sm font-medium"
              >
                Pastoral Staff
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  Access to all contact lists
                </p>
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-xs text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Settings
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
