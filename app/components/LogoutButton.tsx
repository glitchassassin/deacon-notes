import clsx from "clsx";
import { Form } from "react-router";

interface LogoutButtonProps {
  user: any;
}

export function LogoutButton({ user }: LogoutButtonProps) {
  return (
    <Form method="post" action="/logout">
      <button
        type="submit"
        disabled={!user}
        className={clsx(
          "bg-red-700 text-white px-3 py-1 rounded-sm hover:bg-red-800 transition",
          !user && "opacity-0 pointer-events-none"
        )}
      >
        Logout
      </button>
    </Form>
  );
}
