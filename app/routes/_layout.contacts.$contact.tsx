import CompactNote from "~/components/CompactNote";
import ExternalLink from "~/icons/ExternalLink";
import { createNote, getContact, getNotes } from "~/services/contacts";
import type { Route } from "./+types/_layout.contacts.$contact";
import { useFetcher } from "react-router";
import { optimisticCache } from "~/services/cache";
import { useEffect, useState } from "react";

export function meta({ data }: Route.MetaArgs) {
  let contact = data.contact.optimistic;
  data.contact.fetched.then((c) => {
    contact = c;
  });

  return [
    {
      title: `${contact?.preferredName ?? contact?.firstName} ${
        contact?.lastName
      }`,
    },
  ];
}

export async function clientLoader({ params }: Route.LoaderArgs) {
  const contact = optimisticCache(`contact:${params.contact}`, () =>
    getContact(params.contact)
  );
  const notes = optimisticCache(`notes:${params.contact}`, () =>
    getNotes(params.contact)
  );
  return { contact, notes };
}

export async function clientAction({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const body = formData.get("body");
  await createNote(params.contact, body as string);
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const {
    contact: { optimistic: optimisticContact, fetched: fetchedContact },
    notes: { optimistic: optimisticNotes, fetched: fetchedNotes },
  } = loaderData;

  const [contact, setContact] = useState(optimisticContact);
  const [notes, setNotes] = useState(optimisticNotes);

  useEffect(() => {
    fetchedContact.then(setContact);
    fetchedNotes.then(setNotes);
  }, [fetchedContact, fetchedNotes]);

  const deaconCareGroup = contact?.realms.find((realm) =>
    realm.title.includes("Deacon Care Group")
  );

  const fetcher = useFetcher();
  const isLoading = fetcher.state !== "idle";

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-800 p-4">
      <main className="max-w-4xl mx-auto flex flex-col gap-1">
        {contact && (
          <a
            href={`https://app.fluro.io/list/contact/${contact._id}/edit`}
            target="_blank"
            rel="noreferrer"
            className="hover:underline mt-2"
          >
            <h1 className="text-2xl font-semibold">
              {contact?.preferredName ?? contact?.firstName} {contact?.lastName}{" "}
              <ExternalLink className="w-4 h-4 text-zinc-500 dark:text-zinc-400 inline-block" />
            </h1>
          </a>
        )}
        {!contact && <h1 className="text-2xl font-semibold">Loading...</h1>}
        {deaconCareGroup && <div>{deaconCareGroup.title}</div>}
        {contact && contact.phoneNumbers.length > 0 && (
          <div>
            Phone:{" "}
            <span className="inline-flex flex-wrap gap-2">
              {contact.local.map((phone) => (
                <a href={`tel:${phone.replace(/[^\d]/g, "")}`} key={phone}>
                  {phone}
                </a>
              ))}
            </span>
          </div>
        )}
        {contact && contact.emails.length > 0 && (
          <div>
            Email:{" "}
            <span className="inline-flex flex-wrap gap-2">
              {contact.emails.map((email) => (
                <a href={`mailto:${email}`} key={email}>
                  {email}
                </a>
              ))}
            </span>
          </div>
        )}
        <fetcher.Form
          method="post"
          className="bg-white dark:bg-zinc-700 rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 my-4"
        >
          <div className="flex flex-col gap-3">
            <div>
              <label
                htmlFor="body"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
                New Note
              </label>
              <textarea
                name="body"
                id="body"
                rows={3}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </fetcher.Form>
        <div className="grid gap-2 bg-white dark:bg-zinc-700 rounded-lg shadow-sm hover:shadow-md transition-shadow p-3">
          {!notes?.length && (
            <div className="text-zinc-500 dark:text-zinc-400">
              No notes found
            </div>
          )}
          {notes?.map((note) => (
            <CompactNote key={note._id} {...note} />
          ))}
        </div>
      </main>
    </div>
  );
}
