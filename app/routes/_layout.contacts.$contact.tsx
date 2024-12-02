import CompactNote from "~/components/CompactNote";
import ExternalLink from "~/icons/ExternalLink";
import { getContact, getNotes } from "~/services/contacts";
import type { Route } from "./+types/_layout.contacts.$contact";

export async function clientLoader({ params }: Route.LoaderArgs) {
  const contact = await getContact(params.contact);
  const deaconCareGroup = contact.realms.find((realm) =>
    realm.title.includes("Deacon Care Group")
  );
  const notes = await getNotes(params.contact);
  return { contact, notes, deaconCareGroup };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { contact, notes, deaconCareGroup } = loaderData;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 p-4">
      <main className="max-w-4xl mx-auto flex flex-col gap-2">
        <a
          href={`https://app.fluro.io/list/contact/${contact._id}/edit`}
          target="_blank"
          rel="noreferrer"
          className="hover:underline mt-2"
        >
          <h1 className="text-2xl font-semibold">
            {contact.preferredName} {contact.lastName}{" "}
            <ExternalLink className="w-4 h-4 text-gray-500 dark:text-gray-400 inline-block" />
          </h1>
        </a>
        {deaconCareGroup && <div className="mb-4">{deaconCareGroup.title}</div>}
        <div className="grid gap-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow p-3">
          {notes.length === 0 && (
            <div className="text-gray-500 dark:text-gray-400">
              No notes found
            </div>
          )}
          {notes.map((note) => (
            <CompactNote key={note._id} {...note} />
          ))}
        </div>
      </main>
    </div>
  );
}
