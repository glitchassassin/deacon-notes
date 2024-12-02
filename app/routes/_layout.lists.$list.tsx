import { Await, Link } from "react-router";
import { getContactsList, getContactsListMetadata } from "~/services/contacts";
import type { Route } from "./+types/_layout.lists.$list";
import { Suspense } from "react";

export async function clientLoader({ params }: Route.LoaderArgs) {
  const { title, _realm } = await getContactsListMetadata(params.list);

  const contactsPromise = getContactsList(_realm); // Defer promise
  return { title, contactsPromise };
}

export function meta({ data }: Route.MetaArgs) {
  return [
    {
      title: `${data.title}`,
    },
  ];
}

function lastPostActivity(
  posts: Awaited<
    Route.ComponentProps["loaderData"]["contactsPromise"]
  >[number]["_posts"]["all"]
) {
  const lastPost = posts.reduce((acc, post) => {
    return post.updated > acc ? post.updated : acc;
  }, "");
  if (!lastPost) return undefined;
  return new Date(lastPost);
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
            {(contacts) => (
              <div className="grid gap-4">
                {contacts.map((contact) => (
                  <div
                    key={contact._id}
                    className="bg-white dark:bg-zinc-700 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Link
                      to={`/contacts/${contact._id}`}
                      className="p-4 text-zinc-800 dark:text-zinc-100 hover:text-sky-600 dark:hover:text-sky-400 flex justify-between items-center"
                    >
                      <span>
                        {contact.preferredName ?? contact.firstName}&nbsp;
                        {contact.lastName}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {lastPostActivity(
                          contact._posts.all
                        )?.toLocaleDateString() ?? "No activity"}
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </Await>
        </Suspense>
      </main>
    </div>
  );
}
