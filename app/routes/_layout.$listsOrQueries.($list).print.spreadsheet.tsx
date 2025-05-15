import { useEffect, useState } from "react";
import { matchById } from "~/utils/matchById";
import type { Route } from "./+types/_layout.$listsOrQueries.($list).print.spreadsheet";

// Define the parent route ID for useRouteLoaderData
const PARENT_ROUTE_ID = "routes/_layout.$listsOrQueries.($list)";

export function meta({ matches }: Partial<Route.MetaArgs>) {
  if (!matches) {
    return [
      {
        title: "Print | Deacon Notes",
      },
    ];
  }
  const data = matchById(matches, PARENT_ROUTE_ID).data;
  return [
    {
      title: `Print | ${data?.title ?? "Deacon Notes"}`,
    },
  ];
}

export default function SpreadsheetView({ matches }: Route.ComponentProps) {
  const loaderData = matchById(matches, PARENT_ROUTE_ID).data;

  if (!loaderData) {
    return <div>Loading...</div>;
  }

  const {
    contacts: { optimistic, fetched },
  } = loaderData;

  const [contacts, setContacts] = useState(optimistic);

  useEffect(() => {
    fetched.then(setContacts);
  }, [fetched]);

  const sortedContacts = contacts
    ? Object.values(contacts).sort((a, b) =>
        (a.familyName ?? "").localeCompare(b.familyName ?? "")
      )
    : null;

  if (!sortedContacts) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 text-gray-900 dark:text-gray-100">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 min-h-[11in] w-[8.5in] mx-auto print:shadow-none print:p-0 print:min-h-0 print:w-full print:bg-white print:text-black">
      <table className="w-full border-collapse text-gray-900 dark:text-gray-100 print:text-black text-sm">
        <thead>
          <tr className="border-b-2 border-gray-200 dark:border-gray-700">
            <th className="text-left py-1.5 px-2 w-1/4">Name</th>
            <th className="text-left py-1.5 px-2 w-[12%]">Phone</th>
            <th className="text-left py-1.5 px-2 w-[28%]">Email</th>
            <th className="text-left py-1.5 px-2 w-[35%]">Address</th>
          </tr>
        </thead>
        <tbody>
          {sortedContacts.map((family) => {
            const totalRows = family.parents.length;
            return (
              <>
                {family.parents.map((contact, parentIndex) => (
                  <tr
                    key={contact._id}
                    className={`${
                      parentIndex === 0
                        ? "border-t border-gray-200 dark:border-gray-700"
                        : ""
                    }`}
                  >
                    <td
                      className={`py-1 px-2 w-1/4 ${
                        parentIndex === 0 ? "pt-2.5" : ""
                      } ${
                        parentIndex === family.parents.length - 1
                          ? "pb-2.5"
                          : ""
                      }`}
                    >
                      {contact.preferredName ?? contact.firstName}{" "}
                      {contact.lastName}
                    </td>
                    <td
                      className={`py-1 px-2 w-[12%] ${
                        parentIndex === 0 ? "pt-2.5" : ""
                      } ${
                        parentIndex === family.parents.length - 1
                          ? "pb-2.5"
                          : ""
                      }`}
                    >
                      {contact.phoneNumbers.join(", ")}
                    </td>
                    <td
                      className={`py-1 px-2 w-[28%] break-words ${
                        parentIndex === 0 ? "pt-2.5" : ""
                      } ${
                        parentIndex === family.parents.length - 1
                          ? "pb-2.5"
                          : ""
                      }`}
                    >
                      {contact.emails.join(", ")}
                    </td>
                    {parentIndex === 0 && contact.family?.address && (
                      <td
                        rowSpan={totalRows}
                        className="py-1 pt-2.5 pb-2.5 px-2 align-top w-[35%]"
                      >
                        {contact.family.address.addressLine1 && (
                          <div>{contact.family.address.addressLine1}</div>
                        )}
                        {contact.family.address.addressLine2 && (
                          <div>{contact.family.address.addressLine2}</div>
                        )}
                        <div>
                          {[
                            contact.family.address.suburb,
                            contact.family.address.state,
                            contact.family.address.postalCode,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
