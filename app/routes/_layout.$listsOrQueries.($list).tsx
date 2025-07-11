import { Outlet, redirect } from "react-router";
import { optimisticCache } from "~/services/cache";
import {
  enrichWithNotes,
  getContactsList,
  getContactsListMetadata,
  getContactsQuery,
  getContactsQueryMetadata,
  groupContactsByFamily,
} from "~/services/contacts";
import { Route } from "./+types/_layout.$listsOrQueries.($list)";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  if (!params.list) {
    throw redirect("/");
  }
  if (!["queries", "lists"].includes(params.listsOrQueries)) {
    throw redirect("/");
  }

  let title: string;
  let _realm: string;

  let metadata;

  let contacts: ReturnType<
    typeof optimisticCache<Awaited<ReturnType<typeof enrichWithNotes>>>
  >;
  let emailContacts;
  // Get contacts list with optimistic cache
  if (params.listsOrQueries === "lists") {
    metadata = await getContactsListMetadata(params.list);
    const getContactsListPromise = getContactsList(metadata._realm);
    contacts = optimisticCache<Awaited<ReturnType<typeof enrichWithNotes>>>(
      `contacts-list-${metadata._realm}`,
      () =>
        getContactsListPromise.then(groupContactsByFamily).then(enrichWithNotes)
    );
    emailContacts = getContactsListPromise.then((contacts) =>
      contacts.filter(
        (contact) =>
          contact.householdRole !== "child" && contact.emails.length > 0
      )
    );
  } else {
    metadata = await getContactsQueryMetadata(params.list);
    const getContactsQueryPromise = getContactsQuery(metadata);
    contacts = optimisticCache(`contacts-query-${params.list}`, () =>
      getContactsQueryPromise.then(groupContactsByFamily).then(enrichWithNotes)
    );
    emailContacts = getContactsQueryPromise.then((contacts) =>
      contacts.filter(
        (contact) =>
          contact.householdRole !== "child" && contact.emails.length > 0
      )
    );
  }

  title = metadata.title;
  _realm = metadata._realm;

  return {
    title,
    _realm,
    contacts,
    emailContacts,
  };
}

export function meta({ data }: Partial<Route.MetaArgs>) {
  return [
    {
      title: `${data?.title}`,
    },
  ];
}

export default function ListLayout() {
  return <Outlet />;
}
