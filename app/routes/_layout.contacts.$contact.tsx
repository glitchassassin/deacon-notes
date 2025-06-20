import * as Sentry from "@sentry/browser";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { ViewConnection } from "~/components/notes/Connection";
import { CreateSimpleNote } from "~/components/notes/SimpleNote";
import ExternalLink from "~/icons/ExternalLink";
import { EditableNote } from "~/routes/_layout.notes.$noteId.edit/route";
import { optimisticCache } from "~/services/cache";
import {
  createNote,
  getContact,
  getContactAvatarUrl,
  getNotes,
} from "~/services/contacts";
import type { Route } from "./+types/_layout.contacts.$contact";

export function meta({ data }: Route.MetaArgs) {
  const initialContact = data?.initialContact;
  return [
    {
      title: `${initialContact?.preferredName ?? initialContact?.firstName} ${
        initialContact?.lastName
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
  const initialContact = contact.optimistic ?? (await contact.fetched);
  return { contact, notes, initialContact };
}

export async function clientAction({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const body = formData.get("body");

  try {
    await createNote(params.contact, body as string);
    return { success: true };
  } catch (error) {
    Sentry.captureException(error, {
      extra: {
        contactId: params.contact,
        noteLength: body?.toString().length,
      },
    });

    return {
      error: "Failed to create note. Please try again.",
    };
  }
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const {
    contact: { optimistic: optimisticContact, fetched: fetchedContact },
    notes: { optimistic: optimisticNotes, fetched: fetchedNotes },
  } = loaderData;

  const [contact, setContact] = useState(optimisticContact);
  const [notes, setNotes] = useState(optimisticNotes);
  const [currentNote, setCurrentNote] = useState("");
  const [lastSubmittedNote, setLastSubmittedNote] = useState("");

  useEffect(() => {
    fetchedContact.then(setContact);
    fetchedNotes.then(setNotes);
  }, [fetchedContact, fetchedNotes]);

  const deaconCareGroup = contact?.realms.find((realm) =>
    realm.title.includes("Deacon Care Group")
  );

  const fetcher = useFetcher();
  const isLoading = fetcher.state !== "idle";

  useEffect(() => {
    if (lastSubmittedNote && fetcher.state === "idle") {
      if (fetcher.data?.error) {
        setNotes((prev) =>
          (prev ?? []).filter((note) => !note._id.startsWith("temp-"))
        );
        setCurrentNote(lastSubmittedNote);
      } else if (
        !notes?.some(
          (note) =>
            note.definition === "note" && note.data?.body === lastSubmittedNote
        )
      ) {
        setCurrentNote(lastSubmittedNote);
      }
      setLastSubmittedNote("");
    }
  }, [fetcher.state, fetcher.data, notes, lastSubmittedNote]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLastSubmittedNote(currentNote);

    setNotes((prev) => [
      {
        _id: "temp-" + Date.now(),
        data: { body: currentNote },
        created: new Date().toISOString(),
        author: {
          name: "Saving...",
        },
        definition: "note",
        fullDefinition: {
          definitionName: "note",
          fields: [],
          title: "Note",
          plural: "Notes",
        },
      },
      ...(prev ?? []),
    ]);

    setCurrentNote("");

    fetcher.submit(event.currentTarget);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <main className="max-w-4xl mx-auto flex flex-col gap-1">
        {contact && (
          <div className="flex flex-wrap sm:flex-nowrap gap-6 mt-2">
            <div className="w-full sm:w-auto shrink-0 flex justify-center sm:justify-start">
              <a
                href={getContactAvatarUrl(contact._id, 600)}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={getContactAvatarUrl(contact._id)}
                  alt={`${contact?.preferredName ?? contact?.firstName} ${
                    contact?.lastName
                  }`}
                  className="w-32 h-32 rounded-full object-cover hover:opacity-90 transition-opacity"
                />
              </a>
            </div>
            <div className="w-full sm:w-auto flex flex-col gap-1">
              <a
                href={`https://app.fluro.io/list/contact/${contact._id}/edit`}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                <h1 className="text-2xl font-semibold">
                  {contact?.preferredName ?? contact?.firstName}{" "}
                  {contact?.lastName}{" "}
                  <ExternalLink className="w-4 h-4 text-gray-500 dark:text-gray-400 inline-block" />
                </h1>
              </a>
              {deaconCareGroup && <div>{deaconCareGroup.title}</div>}
              {contact.phoneNumbers.length > 0 && (
                <div>
                  Phone:{" "}
                  <span className="inline-flex flex-wrap gap-2">
                    {contact.local.map((phone) => (
                      <a
                        href={`tel:${phone.replace(/[^\d]/g, "")}`}
                        key={phone}
                      >
                        {phone}
                      </a>
                    ))}
                  </span>
                </div>
              )}
              {contact.emails.length > 0 && (
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
              {contact.family?.address &&
                Object.values(contact.family.address).some(
                  (value) => value
                ) && (
                  <div>
                    Address:{" "}
                    <div className="inline-flex flex-col">
                      {contact.family.address.addressLine1 && (
                        <span>{contact.family.address.addressLine1}</span>
                      )}
                      {contact.family.address.addressLine2 && (
                        <span>{contact.family.address.addressLine2}</span>
                      )}
                      <span>
                        {[
                          contact.family.address.suburb,
                          contact.family.address.state,
                          contact.family.address.postalCode,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>
                  </div>
                )}
              {contact.details?.membership?.data["Member Date Joined"] && (
                <div>
                  Member Since:{" "}
                  {new Date(
                    contact.details.membership.data["Member Date Joined"]
                  ).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        )}
        {!contact && <h1 className="text-2xl font-semibold">Loading...</h1>}
        <fetcher.Form
          method="post"
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-md transition-shadow p-3 my-4 print:hidden"
        >
          <CreateSimpleNote
            value={currentNote}
            onChange={setCurrentNote}
            isLoading={isLoading}
            error={fetcher.data?.error}
          />
        </fetcher.Form>
        <div className="grid gap-2 bg-white dark:bg-gray-800 rounded-lg shadow-md print:shadow-none hover:shadow-md transition-shadow p-3">
          {!notes?.length && (
            <div className="text-gray-500 dark:text-gray-400">
              No notes found
            </div>
          )}
          {notes?.map((note) =>
            note.definition === "note" ? (
              <EditableNote key={note._id} note={note} />
            ) : (
              <ViewConnection key={note._id} note={note} />
            )
          )}
        </div>
      </main>
    </div>
  );
}
