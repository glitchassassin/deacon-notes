import { Await } from "react-router";
import {
  getContactsList,
  getContactsListMetadata,
  groupContactsByFamily,
} from "~/services/contacts";
import type { Route } from "./+types/_layout.lists.$list";
import { Suspense } from "react";
import { Family } from "~/components/Family";

export async function clientLoader({ params }: Route.LoaderArgs) {
  const { title, _realm } = await getContactsListMetadata(params.list);

  const contactsPromise = getContactsList(_realm).then(groupContactsByFamily); // Defer promise
  return { title, contactsPromise };
}

export function meta({ data }: Route.MetaArgs) {
  return [
    {
      title: `${data.title}`,
    },
  ];
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { title, contactsPromise } = loaderData;

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-800 p-4">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <Suspense
          fallback={
            <div className="bg-white dark:bg-zinc-700 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 text-zinc-800 dark:text-zinc-100">
              Loading...
            </div>
          }
        >
          <Await resolve={contactsPromise}>
            {(families) => (
              <div className="grid gap-4">
                {Object.values(families).map((family) => (
                  <Family key={family.familyId} family={family} />
                ))}
              </div>
            )}
          </Await>
        </Suspense>
      </main>
    </div>
  );
}
