import { Link } from "react-router";
import { getContactLists } from "~/services/contacts";
import type { Route } from "./+types/_layout.lists._index";
import { useEffect, useState } from "react";
import { optimisticCache } from "~/services/cache";

export function meta() {
  return [
    {
      title: "Contact Lists",
    },
  ];
}

export async function clientLoader() {
  return optimisticCache("contactLists", getContactLists);
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { optimistic, fetched } = loaderData;
  const [contactLists, setContactLists] = useState(optimistic);
  useEffect(() => {
    fetched.then(setContactLists);
  }, [fetched]);

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-800 p-4">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Contact Lists</h1>
        <ContactList contactLists={contactLists} />
      </main>
    </div>
  );
}

type ContactLists = Route.ComponentProps["loaderData"]["optimistic"];

function ContactList({ contactLists }: { contactLists: ContactLists }) {
  if (!contactLists) {
    return (
      <div className="bg-white dark:bg-zinc-700 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 text-zinc-800 dark:text-zinc-100">
        Loading...
      </div>
    );
  }
  return (
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
  );
}
