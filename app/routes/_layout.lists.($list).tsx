import { Outlet, redirect } from "react-router";
import { optimisticCache } from "~/services/cache";
import {
  enrichWithNotes,
  getContactsList,
  getContactsListMetadata,
  groupContactsByFamily,
} from "~/services/contacts";

// Define the route type
export type RouteId = "routes/_layout.lists.($list)";

// Define loader args type
interface LoaderArgs {
  params: {
    list?: string;
  };
}

// Define loader data type
export interface LoaderData {
  title: string;
  _realm: string;
  contacts: {
    optimistic: Record<string, any> | null;
    fetched: Promise<Record<string, any>>;
  };
  emailAddresses: Promise<string[]>;
}

export async function clientLoader({ params }: LoaderArgs) {
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

// Define meta args type
interface MetaArgs {
  data?: LoaderData;
}

export function meta({ data }: MetaArgs) {
  return [
    {
      title: `${data?.title}`,
    },
  ];
}

export default function ListLayout() {
  return <Outlet />;
}
