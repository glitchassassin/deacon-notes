import { Form, redirect, useActionData } from "react-router";
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Form
        method="post"
        className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl mb-4 text-center text-gray-900 dark:text-gray-100">
          Login
        </h2>
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
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-900 dark:text-white dark:border-white/20"
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
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-900 dark:text-white dark:border-white/20"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-sky-500 text-white py-2 rounded hover:bg-sky-600 transition"
        >
          Login
        </button>
      </Form>
    </div>
  );
}
