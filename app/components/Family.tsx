import { Link } from "react-router";
import type { Contact } from "~/services/contacts";
import { groupContactsByFamily } from "~/services/contacts";
import { formatPhoneNumber } from "~/utils/format";
import CompactNote from "./CompactNote";

function lastPostActivity(
  posts: {
    updated: string;
  }[]
) {
  const lastPost = posts.reduce((acc, post) => {
    return post.updated > acc ? post.updated : acc;
  }, "");
  if (!lastPost) return undefined;
  return new Date(lastPost);
}

type Family = ReturnType<typeof groupContactsByFamily>[string];

function FamilyContact({ contact }: { contact: Family["parents"][number] }) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <Link
          to={`/contacts/${contact._id}`}
          className="pl-4 hover:text-sky-600 dark:hover:text-sky-400 print:hidden"
        >
          {contact.preferredName ?? contact.firstName}&nbsp;{contact.lastName}
        </Link>
        <span className="hidden print:flex flex-row gap-2 w-full">
          <span className="text-sm flex-1">
            {contact.preferredName ?? contact.firstName}&nbsp;{contact.lastName}
          </span>
          <span className="text-sm flex-2">
            {contact.phoneNumbers.map(formatPhoneNumber).join(", ")}
          </span>
          <span className="text-sm flex-2">{contact.emails.join(", ")}</span>
        </span>
      </div>
      {contact.notes && contact.notes.length > 0 && (
        <div className="flex flex-col gap-2 pl-8 print:hidden">
          {contact.notes.map((note) => (
            <CompactNote key={note._id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}

interface FamilyProps {
  family: {
    familyId: string;
    familyName: string;
    parents: Contact[];
    children: Contact[];
    updated?: string;
    deaconCareGroup?: string;
  };
  showDeaconCareGroup?: boolean;
}

export function Family({ family, showDeaconCareGroup }: FamilyProps) {
  return (
    <div className="flex flex-col gap-4 print:p-0 p-4 bg-white dark:bg-gray-800 rounded-lg print:shadow-none shadow-md transition-shadow text-gray-900 dark:text-gray-100 break-inside-avoid">
      <div className="flex flex-col">
        <h2 className="text-lg print:text-md font-semibold">
          {family.familyName} Family
          {showDeaconCareGroup && family.deaconCareGroup && (
            <span className="font-normal text-gray-500 dark:text-gray-400 ml-2">
              ({family.deaconCareGroup})
            </span>
          )}
        </h2>
        {family.parents.map((contact) => (
          <FamilyContact key={contact._id} contact={contact} />
        ))}
        {family.children.length > 0 && (
          <>
            <h3 className="pl-2 text-md font-semibold mt-4 print:text-sm print:pl-0 print:mt-2">
              Children
            </h3>
            {family.children.map((contact) => (
              <FamilyContact key={contact._id} contact={contact} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
