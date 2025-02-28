import { Suspense, useState } from "react";
import { Await, redirect } from "react-router";
import { Button } from "~/components/Button";
import { Family } from "~/components/Family";
import type { Contact, NoteResponse } from "~/services/contacts";
import {
  enrichWithNotes,
  groupContactsByFamily,
  searchContacts,
} from "~/services/contacts";

type FamilyGroup = {
  familyId: string;
  familyName: string;
  parents: Contact[];
  children: Contact[];
  notes: NoteResponse[];
  updated?: string;
};

export async function clientLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");
  if (!query) {
    throw redirect("/");
  }

  const contacts = searchContacts(query)
    .then(groupContactsByFamily)
    .then(enrichWithNotes);
  return { query, contacts };
}

export function meta({ data }: { data: { query: string } }) {
  return [
    {
      title: `Search: ${data?.query}`,
    },
  ];
}

interface LoaderData {
  query: string;
  contacts: Promise<Record<string, FamilyGroup>>;
}

function SearchResultsContent({
  contacts,
  query,
}: {
  contacts: Record<string, FamilyGroup>;
  query: string;
}) {
  const [sortBy, setSortBy] = useState<"familyName" | "updated">("familyName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const sortedContacts = Object.values(contacts).sort((a, b) => {
    const multiplier = sortDirection === "asc" ? 1 : -1;
    if (sortBy === "familyName") {
      return (
        multiplier * (a.familyName ?? "").localeCompare(b.familyName ?? "")
      );
    } else {
      return multiplier * (a.updated ?? "").localeCompare(b.updated ?? "");
    }
  });

  const toggleSort = (field: "familyName" | "updated") => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  return (
    <>
      <div className="flex gap-2 mb-4 print:hidden">
        <div className="flex gap-2">
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
        <div className="flex-grow"></div>
        <Button onClick={() => window.print()}>Print</Button>
      </div>
      {sortedContacts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 text-gray-900 dark:text-gray-100">
          No results found for "{query}"
        </div>
      ) : (
        <div className="grid gap-4">
          <span className="hidden print:flex flex-row gap-2">
            <span className="text-sm flex-[1]">Name</span>
            <span className="text-sm flex-[2]">Phone</span>
            <span className="text-sm flex-[2]">Email</span>
          </span>
          {sortedContacts.map((family) => (
            <Family key={family.familyId} family={family} showDeaconCareGroup />
          ))}
        </div>
      )}
    </>
  );
}

export default function SearchResults({
  loaderData,
}: {
  loaderData: LoaderData;
}) {
  const { query, contacts } = loaderData;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Search Results: {query}</h1>
        <Suspense
          key={query}
          fallback={
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 text-gray-900 dark:text-gray-100">
              Loading...
            </div>
          }
        >
          <Await resolve={contacts}>
            {(resolvedContacts) => (
              <SearchResultsContent contacts={resolvedContacts} query={query} />
            )}
          </Await>
        </Suspense>
      </main>
    </div>
  );
}
