import { useEffect, useState } from "react";
import { getContactAvatarUrl } from "~/services/contacts";
import { matchById } from "~/utils/matchById";
import type { Route } from "./+types/_layout.lists.($list).print.facesheet";

// Define the parent route ID for useRouteLoaderData
const PARENT_ROUTE_ID = "routes/_layout.lists.($list)";

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

export default function FaceSheetView({ matches }: Route.ComponentProps) {
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 text-gray-900 dark:text-gray-100 print:text-black">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 min-h-[11in] w-[8.5in] mx-auto print:shadow-none print:p-0 print:min-h-0 print:w-full print:bg-white">
      <div className="grid grid-cols-3 gap-x-4 gap-y-4">
        {sortedContacts.flatMap((family) =>
          family.parents.map((contact) => (
            <div
              key={contact._id}
              className="text-gray-900 dark:text-gray-100 print:text-black break-inside-avoid-page"
            >
              <div className="flex flex-col">
                <div className="flex-shrink-0 mb-4">
                  <img
                    src={getContactAvatarUrl(contact._id)}
                    alt={`${contact.preferredName ?? contact.firstName} ${
                      contact.lastName
                    }`}
                    className="w-36 h-36 rounded-full object-cover mx-auto"
                  />
                </div>
                <div className="text-center">
                  <h2 className="text-lg font-bold mb-2">
                    {contact.preferredName ?? contact.firstName}{" "}
                    {contact.lastName}
                  </h2>
                  {contact.phoneNumbers.length > 0 && (
                    <div className="text-sm">
                      {contact.phoneNumbers.join(", ")}
                    </div>
                  )}
                  {contact.emails.length > 0 && (
                    <div className="text-sm break-words">
                      {contact.emails.join(", ")}
                    </div>
                  )}
                  {contact.family?.address && (
                    <div className="text-sm">
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
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
