import { Link } from "react-router";
import { groupContactsByFamily } from "~/services/contacts";
import CompactNote from "./CompactNote";
import { formatPhoneNumber } from "~/utils/format";
import type { Contact, NoteResponse } from "~/services/contacts";

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
    <>
      <Link
        to={`/contacts/${contact._id}`}
        className="pl-4 hover:text-sky-600 dark:hover:text-sky-400 print:hidden"
      >
        {contact.preferredName ?? contact.firstName}&nbsp;{contact.lastName}
      </Link>
      <span className="hidden print:flex flex-row gap-2">
        <span className="text-sm flex-[1]">
          {contact.preferredName ?? contact.firstName}&nbsp;{contact.lastName}
        </span>
        <span className="text-sm flex-[2]">
          {contact.phoneNumbers.map(formatPhoneNumber).join(", ")}
        </span>
        <span className="text-sm flex-[2]">{contact.emails.join(", ")}</span>
      </span>
    </>
  );
}

interface FamilyProps {
  family: {
    familyId: string;
    familyName: string;
    parents: Contact[];
    children: Contact[];
    notes: NoteResponse[];
    updated?: string;
    deaconCareGroup?: string;
  };
  showDeaconCareGroup?: boolean;
}

export function Family({ family, showDeaconCareGroup }: FamilyProps) {
  return (
    <div className="flex flex-col gap-4 print:p-0 p-4 bg-white dark:bg-zinc-700 rounded-lg print:shadow-none shadow-sm transition-shadow text-zinc-800 dark:text-zinc-100">
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold">
          {family.familyName} Family
          {showDeaconCareGroup && family.deaconCareGroup && (
            <span className="font-normal text-zinc-500 dark:text-zinc-400 ml-2">
              ({family.deaconCareGroup})
            </span>
          )}
        </h2>
        {family.parents.map((contact) => (
          <FamilyContact key={contact._id} contact={contact} />
        ))}
        {family.children.length > 0 && (
          <>
            <h3 className="pl-2 text-md font-semibold mt-4 print:pl-0 print:mt-2 print:text-sm">
              Children
            </h3>
            {family.children.map((contact) => (
              <FamilyContact key={contact._id} contact={contact} />
            ))}
          </>
        )}
      </div>
      {family.notes.length > 0 && (
        <div className="flex flex-col gap-2 print:hidden">
          <h3 className="pl-2 text-md font-semibold">Notes</h3>
          {family.notes.map((note) => (
            <span key={note._id} className="pl-4">
              <CompactNote note={note} />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
