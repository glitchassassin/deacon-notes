import { useEffect, useState } from "react";
import { redirect } from "react-router";
import { Button, LinkButton } from "~/components/Button";
import { Family } from "~/components/Family";
import { optimisticCache } from "~/services/cache";
import {
  enrichWithNotes,
  getContactsList,
  getContactsListMetadata,
  groupContactsByFamily,
} from "~/services/contacts";
import type { Route } from "./+types/_layout.lists.($list)._index";

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
      title: `${data?.title}`,
    },
  ];
}

export default function Dashboard({
  loaderData,
  params,
}: Route.ComponentProps) {
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
          return (
            multiplier * (a.familyName ?? "").localeCompare(b.familyName ?? "")
          );
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <div className="flex flex-wrap gap-4 mb-4 justify-between print:hidden">
          <div className="flex gap-2 order-2 sm:order-1">
            <Button
              onClick={() => toggleSort("familyName")}
              variant={sortBy === "familyName" ? "primary" : "secondary"}
            >
              Family Name{" "}
              {sortBy === "familyName" && (sortDirection === "asc" ? "↑" : "↓")}
            </Button>
            <Button
              onClick={() => toggleSort("updated")}
              variant={sortBy === "updated" ? "primary" : "secondary"}
            >
              Last Updated{" "}
              {sortBy === "updated" && (sortDirection === "asc" ? "↑" : "↓")}
            </Button>
          </div>
          <div className="flex gap-2 w-full sm:w-auto order-1 sm:order-2 justify-end">
            <Button onClick={() => window.print()}>Print</Button>
            {sortedContacts && (
              <LinkButton to={`/lists/${params.list}/email`}>
                Send Email
              </LinkButton>
            )}
          </div>
        </div>
        {!sortedContacts && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 text-gray-900 dark:text-gray-100">
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
