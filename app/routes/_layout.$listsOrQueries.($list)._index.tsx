import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Button, LinkButton } from "~/components/Button";
import { Family } from "~/components/Family";
import { matchById } from "~/utils/matchById";
import { Route } from "./+types/_layout.$listsOrQueries.($list)._index";

// Define the parent route ID for useRouteLoaderData
const PARENT_ROUTE_ID = "routes/_layout.$listsOrQueries.($list)";

export function meta({ matches }: Partial<Route.MetaArgs>) {
  if (!matches) {
    return [
      {
        title: "Deacon Notes",
      },
    ];
  }
  const data = matchById(matches, PARENT_ROUTE_ID).data;
  return [
    {
      title: `${data?.title}`,
    },
  ];
}

export default function Dashboard({ params, matches }: Route.ComponentProps) {
  const loaderData = matchById(matches, PARENT_ROUTE_ID).data;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  if (!loaderData) {
    return <div>Loading...</div>;
  }

  const {
    title,
    contacts: { optimistic, fetched },
  } = loaderData;

  const [contacts, setContacts] = useState(optimistic);

  // Read sort parameters from URL, with defaults
  const sortBy =
    (searchParams.get("sortBy") as
      | "familyName"
      | "updated"
      | "created"
      | null) ?? "familyName";
  const sortDirection =
    (searchParams.get("sortDirection") as "asc" | "desc" | null) ?? "asc";

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
        } else if (sortBy === "created") {
          return multiplier * (a.created ?? "").localeCompare(b.created ?? "");
        } else {
          return multiplier * (a.updated ?? "").localeCompare(b.updated ?? "");
        }
      })
    : null;

  const toggleSort = (field: "familyName" | "updated" | "created") => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (sortBy === field) {
      // Toggle direction if clicking the same field
      const newDirection = sortDirection === "asc" ? "desc" : "asc";
      newSearchParams.set("sortDirection", newDirection);
    } else {
      // Switch to new field with ascending direction
      newSearchParams.set("sortBy", field);
      newSearchParams.set("sortDirection", "asc");
    }

    navigate(`?${newSearchParams.toString()}`, { replace: true });
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
            <Button
              onClick={() => toggleSort("created")}
              variant={sortBy === "created" ? "primary" : "secondary"}
            >
              Created{" "}
              {sortBy === "created" && (sortDirection === "asc" ? "↑" : "↓")}
            </Button>
          </div>
          <div className="flex gap-2 w-full sm:w-auto order-1 sm:order-2 justify-end">
            <LinkButton to={`/lists/${params.list}/print/spreadsheet`}>
              Print...
            </LinkButton>
            {sortedContacts && (
              <LinkButton to={`/lists/${params.list}/email`}>
                Send Email
              </LinkButton>
            )}
          </div>
        </div>
        {!sortedContacts && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xs hover:shadow-md transition-shadow p-4 text-gray-900 dark:text-gray-100">
            Loading...
          </div>
        )}
        {sortedContacts && (
          <div className="grid gap-4">
            <span className="hidden print:flex flex-row gap-2">
              <span className="text-sm flex-1">Name</span>
              <span className="text-sm flex-2">Phone</span>
              <span className="text-sm flex-2">Email</span>
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
