import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getUserRole } from "~/services/auth";
import { optimisticCache } from "~/services/cache";
import {
  getContactLists,
  getContactQueries,
  type ContactQuery,
} from "~/services/contacts";

export function meta() {
  return [
    {
      title: "Contact Lists",
    },
  ];
}

type ContactList = {
  _id: string;
  title: string;
  _type: string;
  definition: string;
  _matched: boolean;
};

type LoaderData = {
  contactLists: {
    optimistic: ContactList[] | undefined;
    fetched: Promise<ContactList[]>;
  };
  contactQueries: {
    optimistic: ContactQuery[] | undefined;
    fetched: Promise<ContactQuery[]>;
  };
};

export async function clientLoader(): Promise<LoaderData> {
  return {
    contactLists: optimisticCache("contactLists", getContactLists),
    contactQueries: optimisticCache("contactQueries", getContactQueries),
  };
}

export default function Dashboard({ loaderData }: { loaderData: LoaderData }) {
  const { contactLists, contactQueries } = loaderData;
  const [lists, setLists] = useState(contactLists.optimistic);
  const [queries, setQueries] = useState(contactQueries.optimistic);
  const userRole = getUserRole();
  const isPastoralStaff = userRole === "Pastoral Staff";

  useEffect(() => {
    contactLists.fetched.then(setLists);
    contactQueries.fetched.then(setQueries);
  }, [contactLists.fetched, contactQueries.fetched]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Contact Lists</h1>
        <ContactList contactLists={lists} />

        {isPastoralStaff && (
          <>
            <h2 className="text-2xl font-bold mt-8 mb-4">Contact Queries</h2>
            <ContactQueries queries={queries} />
          </>
        )}
      </main>
    </div>
  );
}

function ContactList({
  contactLists,
}: {
  contactLists: ContactList[] | undefined;
}) {
  if (!contactLists) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 text-gray-900 dark:text-gray-100">
        Loading...
      </div>
    );
  }
  return (
    <div className="grid gap-4">
      {contactLists.map((contactList) => (
        <div
          key={contactList._id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <Link
            to={`/lists/${contactList._id}`}
            className="block p-4 text-gray-900 dark:text-gray-100 hover:text-sky-600 dark:hover:text-sky-400"
          >
            {contactList.title}
          </Link>
        </div>
      ))}
    </div>
  );
}

function ContactQueries({ queries }: { queries: ContactQuery[] | undefined }) {
  if (!queries) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 text-gray-900 dark:text-gray-100">
        Loading...
      </div>
    );
  }
  return (
    <div className="grid gap-4">
      {queries.map((query) => (
        <div
          key={query._id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <Link
            to={`/queries/${query._id}`}
            className="block p-4 text-gray-900 dark:text-gray-100 hover:text-sky-600 dark:hover:text-sky-400"
          >
            {query.title}
          </Link>
        </div>
      ))}
    </div>
  );
}
