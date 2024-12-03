import CompactNote from "~/components/CompactNote";
import ExternalLink from "~/icons/ExternalLink";
import { createNote, getContact, getNotes } from "~/services/contacts";
import type { Route } from "./+types/_layout.contacts.$contact";
import { useFetcher } from "react-router";

export function meta({ data }: Route.MetaArgs) {
  return [
    {
      title: `${data.contact.preferredName} ${data.contact.lastName}`,
    },
  ];
}

export async function clientLoader({ params }: Route.LoaderArgs) {
  const contact = await getContact(params.contact);
  const deaconCareGroup = contact.realms.find((realm) =>
    realm.title.includes("Deacon Care Group")
  );
  const notes = await getNotes(params.contact);
  return { contact, notes, deaconCareGroup };
}

export async function clientAction({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const body = formData.get("body");
  await createNote(params.contact, body as string);
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { contact, notes, deaconCareGroup } = loaderData;

  const fetcher = useFetcher();
  const isLoading = fetcher.state !== "idle";

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 p-4">
      <main className="max-w-4xl mx-auto flex flex-col gap-1">
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
        {deaconCareGroup && <div>{deaconCareGroup.title}</div>}
        {contact.phoneNumbers.length > 0 && (
          <div>
            Phone:{" "}
            {contact.local.map((phone) => (
              <a href={`tel:${phone.replace(/[^\d]/g, "")}`} key={phone}>
                {phone}
              </a>
            ))}
          </div>
        )}
        {contact.emails.length > 0 && (
          <div>
            Email:{" "}
            {contact.emails.map((email) => (
              <a href={`mailto:${email}`} key={email}>
                {email}
              </a>
            ))}
          </div>
        )}
        <fetcher.Form
          method="post"
          className="bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 my-4"
        >
          <div className="flex flex-col gap-3">
            <div>
              <label
                htmlFor="body"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                New Note
              </label>
              <textarea
                name="body"
                id="body"
                rows={3}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </fetcher.Form>
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
