import {
  enrichWithNotes,
  searchContacts,
  groupContactsByFamily,
} from "~/services/contacts";
import { useState, Suspense } from "react";
import { Family } from "~/components/Family";
import { redirect, Await } from "react-router";
import type { NoteResponse } from "~/services/contacts";
import type { Contact } from "~/services/contacts";

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
      title: `Search: ${data.query}`,
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
      {sortedContacts.length === 0 ? (
        <div className="bg-white dark:bg-zinc-700 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 text-zinc-800 dark:text-zinc-100">
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
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-800 p-4">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Search Results: {query}</h1>
        <Suspense
          key={query}
          fallback={
            <div className="bg-white dark:bg-zinc-700 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 text-zinc-800 dark:text-zinc-100">
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
