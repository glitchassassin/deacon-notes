import { Form, Link } from "react-router";

interface AuthButtonProps {
  user: any;
  className?: string;
}

export function AuthButton({ user, className = "" }: AuthButtonProps) {
  if (user) {
    return (
      <Form method="post" action="/logout" className={className}>
        <button
          type="submit"
          className="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-800 transition"
        >
          Logout
        </button>
      </Form>
    );
  }

  return (
    <Link
      to="/login"
      className={`bg-sky-500 text-white px-3 py-1 rounded hover:bg-sky-600 transition ${className}`}
    >
      Login
    </Link>
  );
}
