import { API_URL, authorizedApiFetch } from "./api";

export async function getContactLists() {
  return authorizedApiFetch(`${API_URL}/content/mailingList/filter`, {
    body: JSON.stringify({
      sort: { sortKey: "title", sortDirection: "asc", sortType: "string" },
      filter: {
        operator: "and",
        filters: [
          {
            operator: "and",
            filters: [
              { key: "status", comparator: "in", values: ["active", "draft"] },
            ],
          },
          {
            operator: "and",
            filters: [
              { key: "definition", comparator: "==", value: "mailingList" },
            ],
          },
        ],
      },
      search: "Deacon Care Group",
      includeArchived: false,
      allDefinitions: false,
      searchInheritable: false,
      includeUnmatched: true,
      limit: 50,
      timezone: "America/New_York",
    }),
  }) as Promise<
    {
      _id: string;
      title: string;
      _type: string;
      definition: string;
      _matched: boolean;
    }[]
  >;
}

export async function getContactsListMetadata(contactList: string) {
  const results = (await authorizedApiFetch(
    `${API_URL}/content/get/${contactList}?type=team`,
    {
      method: "GET",
    }
  )) as {
    title: string;
    _id: string;
    _realm: string;
  };

  return results;
}

export async function getContactsList(contactList: string) {
  const results = (await authorizedApiFetch(
    `${API_URL}/content/contact/filter`,
    {
      method: "POST",
      body: JSON.stringify({
        sort: {
          sortKey: "lastName",
          sortType: "string",
          sortDirection: "asc",
        },
        filter: {
          operator: "and",
          filters: [
            {
              operator: "and",
              filters: [
                {
                  key: "realms|mailingList",
                  comparator: "==",
                  values: [],
                  guid: "1938a4c9-526c-4000-8760-479f0bdc9000",
                  title: "Contact List",
                  value: contactList,
                  value2: null,
                  dataType: "reference",
                },
              ],
              guid: "1938a4c9-5210-4000-89ce-6cdab2b93000",
            },
          ],
        },
        search: "",
        includeArchived: false,
        allDefinitions: true,
        searchInheritable: false,
        includeUnmatched: false,
        joins: [
          "preferredName",
          "phoneNumbers",
          "emails",
          "_posts.all",
          "family",
        ],
        select: [
          "firstName",
          "lastName",
          "preferredName",
          "updated",
          "phoneNumbers",
          "emails",
          "_posts.all",
        ],
        timezone: "America/New_York",
      }),
    }
  )) as {
    preferredName?: string;
    firstName: string;
    lastName: string;
    phoneNumbers: string[];
    emails: string[];
    updated: string;
    family?: {
      _id: string;
      title: string;
      items: {
        _id: string;
        title: string;
        householdRole: string;
      }[];
    };
    _posts: {
      all: {
        _id: string;
        _type: string;
        created: string;
        updated: string;
        title: string;
        definition: string;
      }[];
    };
    _id: string;
  }[];

  return results;
}

export function groupContactsByFamily(
  contacts: Awaited<ReturnType<typeof getContactsList>>
) {
  return contacts.reduce(
    (acc, contact) => {
      const original = (acc[contact.family?._id ?? contact._id] ??= {
        familyId: contact.family?._id ?? contact._id,
        familyName: contact.family?.title ?? contact.lastName,
        parents: [],
        children: [],
        notes: [],
        updated: contact._posts.all[0]?.updated,
      });
      if (
        contact.family?.items.find(
          (item) => item._id === contact._id && item.householdRole === "child"
        )
      ) {
        original.children.push(contact);
      } else {
        original.parents.push(contact);
      }
      if ((contact._posts.all[0]?.updated ?? "") > (original.updated ?? "")) {
        original.updated = contact._posts.all[0].updated;
      }
      return acc;
    },
    {} as Record<
      string,
      {
        familyId: string;
        familyName: string;
        parents: typeof contacts;
        children: typeof contacts;
        notes: NoteResponse[];
        updated?: string;
      }
    >
  );
}

/**
 * Adds the three most recent notes for each contact to the family object
 */
export async function enrichWithNotes(
  contacts: Awaited<ReturnType<typeof groupContactsByFamily>>
) {
  const promises = [];
  for (const family in contacts) {
    for (const contact of [
      ...contacts[family].parents,
      ...contacts[family].children,
    ]) {
      if (contact._posts.all.length > 0) {
        promises.push(
          getNotes(contact._id).then((notes) => {
            contacts[family].notes.push(...notes.slice(0, 3));
          })
        );
      }
    }
  }
  await Promise.all(promises);
  return contacts;
}

export async function getContact(contact: string) {
  const results = (await authorizedApiFetch(
    `${API_URL}/content/get/${contact}?type=contact&appendContactDetail=all`,
    {
      method: "GET",
    }
  )) as {
    title: string;
    created: string;
    updated: string;
    firstName: string;
    lastName: string;
    preferredName: string;
    local: string[];
    phoneNumbers: string[];
    emails: string[];
    _type: string;
    status: string;
    realms: {
      bgColor: string;
      color: string;
      slug: string;
      title: string;
      _id: string;
      _type: string;
    }[];
    _id: string;
  };

  return results;
}

export interface NoteField {
  type: string;
  directive: string;
  title: string;
  key: string;
  options?: Array<{ name: string; value: string }>;
  description?: string;
  expressions?: {
    hide?: string;
  };
}

export interface NoteDefinition {
  definitionName: string;
  title: string;
  plural: string;
  fields: NoteField[];
}

export interface NoteResponse {
  data: Record<string, any>;
  fullDefinition: NoteDefinition;
  created: string;
  author: {
    name: string;
  };
  _id: string;
}
export async function getNotes(contact: string) {
  return authorizedApiFetch(`${API_URL}/info/posts?contact=${contact}`, {
    method: "GET",
  }) as Promise<NoteResponse[]>;
}

export async function createNote(contact: string, body: string) {
  return authorizedApiFetch(`${API_URL}/post/${contact}/note`, {
    method: "POST",
    body: JSON.stringify({ data: { body } }),
  });
}
