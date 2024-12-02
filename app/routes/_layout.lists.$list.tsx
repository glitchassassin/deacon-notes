import { Link } from "react-router";
import { getContacts } from "~/services/contacts";
import type { Route } from "./+types/_layout.lists.$list";

export async function clientLoader({ params }: Route.LoaderArgs) {
  const contacts = await getContacts(params.list);
  return { contacts };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { contacts } = loaderData;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 p-4">
      <main className="max-w-4xl mx-auto">
        <div className="grid gap-4">
          {contacts.map((contact) => (
            <div
              key={contact._id}
              className="bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Link
                to={`/contacts/${contact._id}`}
                className="block p-4 text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {contact.title}
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
