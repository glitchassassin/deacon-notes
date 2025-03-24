import { Outlet, redirect } from "react-router";
import { optimisticCache } from "~/services/cache";
import {
  enrichWithNotes,
  getContactsList,
  getContactsListMetadata,
  groupContactsByFamily,
} from "~/services/contacts";
import { Route } from "./+types/_layout.lists.($list)";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  if (!params.list) {
    throw redirect("/");
  }

  const { title, _realm } = await getContactsListMetadata(params.list);

  // Get contacts list with optimistic cache
  const contacts = optimisticCache(`contacts-list-${_realm}`, () =>
    getContactsList(_realm).then(groupContactsByFamily).then(enrichWithNotes)
  );

  // Get email addresses for the email route
  const emailAddresses = getContactsList(_realm).then((contacts) =>
    contacts
      .filter(
        (contact) =>
          contact.householdRole === "parent" && contact.emails.length > 0
      )
      .flatMap((contact) => contact.emails)
  );

  return {
    title,
    _realm,
    contacts,
    emailAddresses,
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
