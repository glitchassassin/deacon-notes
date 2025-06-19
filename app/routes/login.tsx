import { Form, redirect, useActionData, useNavigation } from "react-router";
import { login } from "~/services/auth";

export function meta() {
  return [
    {
      title: "Login",
    },
  ];
}

export async function clientAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  try {
    await login(username, password);
    return redirect("/lists");
  } catch (err: any) {
    return { error: err.message };
  }
}

export default function Login() {
  const actionData = useActionData<{ error?: string }>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-4">Deacon Notes</h1>
      <Form
        method="post"
        className="bg-white dark:bg-gray-800 p-6 rounded-sm shadow-md w-full max-w-sm"
      >
        {actionData?.error && (
          <p className="text-red-500">{actionData.error}</p>
        )}
        <div className="mb-4">
          <label className="block text-gray-800 dark:text-gray-300">
            Email Address
          </label>
          <input
            type="text"
            name="username"
            required
            disabled={isSubmitting}
            className="w-full px-3 py-2 border rounded-sm focus:outline-hidden focus:ring-3 focus:border-blue-300 dark:bg-gray-900 dark:text-white dark:border-white/20 disabled:opacity-70 disabled:cursor-not-allowed"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-800 dark:text-gray-300">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            disabled={isSubmitting}
            className="w-full px-3 py-2 border rounded-sm focus:outline-hidden focus:ring-3 focus:border-blue-300 dark:bg-gray-900 dark:text-white dark:border-white/20 disabled:opacity-70 disabled:cursor-not-allowed"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-sky-500 text-white py-2 rounded-sm hover:bg-sky-600 transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </Form>
    </div>
  );
}
