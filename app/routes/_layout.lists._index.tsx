import { Link } from "react-router";
import { getContactLists } from "~/services/contacts";
import type { Route } from "./+types/_layout.lists._index";

export function meta() {
  return [
    {
      title: "Contact Lists",
    },
  ];
}

export async function clientLoader() {
  const contactLists = await getContactLists();
  return { contactLists };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { contactLists } = loaderData;

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-800 p-4">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Contact Lists</h1>
        <div className="grid gap-4">
          {contactLists.map((contactList) => (
            <div
              key={contactList._id}
              className="bg-white dark:bg-zinc-700 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Link
                to={`/lists/${contactList._id}`}
                className="block p-4 text-zinc-800 dark:text-zinc-100 hover:text-sky-600 dark:hover:text-sky-400"
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
