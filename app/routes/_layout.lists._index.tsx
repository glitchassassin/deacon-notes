import { Link } from "react-router";
import { getContactLists } from "~/services/contacts";
import type { Route } from "./+types/_layout.lists._index";

export async function clientLoader() {
  const contactLists = await getContactLists();
  return { contactLists };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { contactLists } = loaderData;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 p-4">
      <main className="max-w-4xl mx-auto">
        <div className="grid gap-4">
          {contactLists.map((contactList) => (
            <div
              key={contactList._id}
              className="bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Link
                to={`/lists/${contactList._id}`}
                className="block p-4 text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {contactList.title}
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
