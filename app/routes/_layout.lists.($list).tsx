import {
  enrichWithNotes,
  getContactsList,
  getContactsListMetadata,
  groupContactsByFamily,
} from "~/services/contacts";
import type { Route } from "./+types/_layout.lists.($list)";
import { useEffect, useState } from "react";
import { Family } from "~/components/Family";
import { optimisticCache } from "~/services/cache";
import { redirect } from "react-router";

export async function clientLoader({ params }: Route.LoaderArgs) {
  if (!params.list) {
    throw redirect("/");
  }
  const { title, _realm } = await getContactsListMetadata(params.list);

  const contacts = optimisticCache(`contacts-list-${_realm}`, () =>
    getContactsList(_realm).then(groupContactsByFamily).then(enrichWithNotes)
  ); // Defer promise
  return { title, contacts };
}

export function meta({ data }: Route.MetaArgs) {
  return [
    {
      title: `${data.title}`,
    },
  ];
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const {
    title,
    contacts: { optimistic, fetched },
  } = loaderData;

  const [contacts, setContacts] = useState(optimistic);
  const [sortBy, setSortBy] = useState<"familyName" | "updated">("familyName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetched.then(setContacts);
  }, [fetched]);

  const sortedContacts = contacts
    ? Object.values(contacts).sort((a, b) => {
        const multiplier = sortDirection === "asc" ? 1 : -1;
        if (sortBy === "familyName") {
          return multiplier * a.familyName.localeCompare(b.familyName);
        } else {
          return multiplier * (a.updated ?? "").localeCompare(b.updated ?? "");
        }
      })
    : null;

  const toggleSort = (field: "familyName" | "updated") => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-800 p-4">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <div className="flex gap-2 mb-4 print:hidden">
          <div className="flex gap-2">
            <button
              onClick={() => toggleSort("familyName")}
              className={`px-3 py-1 rounded text-sm md:text-base ${
                sortBy === "familyName"
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100"
              }`}
            >
              Family Name{" "}
              {sortBy === "familyName" && (sortDirection === "asc" ? "↑" : "↓")}
            </button>
            <button
              onClick={() => toggleSort("updated")}
              className={`px-3 py-1 rounded text-sm md:text-base ${
                sortBy === "updated"
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100"
              }`}
            >
              Last Updated{" "}
              {sortBy === "updated" && (sortDirection === "asc" ? "↑" : "↓")}
            </button>
          </div>
          <div className="flex-grow"></div>
          <button
            onClick={() => window.print()}
            className="px-3 py-1 rounded text-sm md:text-base bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100"
          >
            Print
          </button>
        </div>
        {!sortedContacts && (
          <div className="bg-white dark:bg-zinc-700 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 text-zinc-800 dark:text-zinc-100">
            Loading...
          </div>
        )}
        {sortedContacts && (
          <div className="grid gap-4">
            <span className="hidden print:flex flex-row gap-2">
              <span className="text-sm flex-[1]">Name</span>
              <span className="text-sm flex-[2]">Phone</span>
              <span className="text-sm flex-[2]">Email</span>
            </span>
            {sortedContacts.map((family) => (
              <Family key={family.familyId} family={family} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
