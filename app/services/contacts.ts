import { API_URL, authorizedApiFetch } from "./api";
import { getTokenSync, getUserRole } from "./auth";

export async function getContactLists() {
  // Default filter configuration
  const requestBody = {
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
    includeArchived: false,
    allDefinitions: false,
    searchInheritable: false,
    includeUnmatched: true,
    limit: 50,
    timezone: "America/New_York",
  };

  return authorizedApiFetch(`${API_URL}/content/mailingList/filter`, {
    body: JSON.stringify(requestBody),
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

export async function getContactsQueryMetadata(contactList: string) {
  const results = (await authorizedApiFetch(
    `${API_URL}/content/get/${contactList}?type=query`,
    {
      method: "GET",
    }
  )) as {
    title: string;
    _id: string;
    _realm: string;
    filterConfiguration: {
      operator: string;
      filters: Array<{
        operator: string;
        filters: Array<{
          key: string;
          comparator: string;
          values: string[];
          guid: string;
          title: string;
          value: string | null;
          value2: string | null;
        }>;
        guid: string;
      }>;
    };
    filterSearch: string;
    filterSort: {
      sortKey: string;
      sortDirection: "asc" | "desc";
      sortType: string;
    };
  };

  return results;
}

type FilterJoin = {
  operator: string;
  filters: Array<Filter>;
  guid?: string;
};
type FilterCriteria = {
  key: string;
  comparator: string;
  values: string[];
  guid: string;
  title: string;
  value: string | null;
  value2: string | null;
  dataType?: string;
};
type Filter = FilterJoin | FilterCriteria;

interface ContactFilterOptions {
  sort?: {
    sortKey: string;
    sortType: string;
    sortDirection: "asc" | "desc";
  };
  search?: string;
  contactList?: string;
  filter?: Filter;
  includeArchived?: boolean;
  allDefinitions?: boolean;
  searchInheritable?: boolean;
  includeUnmatched?: boolean;
  joins?: string[];
  select?: string[];
  timezone?: string;
}

type DetailItem = {
  _id: string;
  realms: string[];
  data: Record<string, any>;
};

type DetailSection = {
  data: Record<string, any>;
  items: DetailItem[];
  title: string;
  labels: Record<string, string>;
};

export type Contact = {
  preferredName?: string;
  firstName: string;
  lastName: string;
  phoneNumbers: string[];
  emails: string[];
  updated: string;
  created: string;
  _ss_householdID: string;
  householdRole?: string;
  details?: Record<string, DetailSection>;
  family?: {
    _id: string;
    title: string;
    items: {
      _id: string;
      title: string;
    }[];
    address?: {
      addressLine1?: string | null;
      addressLine2?: string | null;
      suburb?: string | null;
      state?: string | null;
      postalCode?: string | null;
    };
  };
  realms: {
    _id: string;
    title: string;
  }[];
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
  notes?: NoteResponse[];
  local: string[];
};

export async function filterContacts({
  sort = {
    sortKey: "lastName",
    sortType: "string",
    sortDirection: "asc",
  },
  search = "",
  contactList,
  filter = {
    operator: "and",
    filters: [],
  },
  includeArchived = false,
  allDefinitions = true,
  searchInheritable = false,
  includeUnmatched = false,
  joins = ["preferredName", "phoneNumbers", "emails", "_posts.all", "family"],
  select = [
    "firstName",
    "lastName",
    "preferredName",
    "updated",
    "created",
    "phoneNumbers",
    "emails",
    "realms",
    "householdRole",
    "_ss_householdID",
    "_posts.all",
  ],
  timezone = "America/New_York",
}: ContactFilterOptions = {}) {
  if (contactList) {
    filter = {
      operator: "and",
      filters: [
        filter,
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
    };
  }

  return authorizedApiFetch(`${API_URL}/content/contact/filter`, {
    method: "POST",
    body: JSON.stringify({
      sort,
      filter,
      search,
      includeArchived,
      allDefinitions,
      searchInheritable,
      includeUnmatched,
      joins,
      select,
      timezone,
    }),
  }) as Promise<Exclude<Contact, "local">[]>;
}

export async function getContactsQuery(
  metadata: Awaited<ReturnType<typeof getContactsQueryMetadata>>
) {
  const contacts = await filterContacts({
    filter: metadata.filterConfiguration,
    sort: metadata.filterSort,
    search: metadata.filterSearch,
  });
  return contacts;
}

export async function getContactsList(contactList: string) {
  return filterContacts({ contactList });
}

export async function searchContacts(query: string) {
  return filterContacts({ search: query });
}

export function groupContactsByFamily(
  contacts: Awaited<ReturnType<typeof getContactsList>>
) {
  return contacts.reduce(
    (acc, contact) => {
      const original = (acc[contact._ss_householdID || contact._id] ??= {
        familyId: contact._ss_householdID || contact._id,
        familyName: contact.family?.title ?? contact.lastName,
        parents: [],
        children: [],
        updated: contact._posts.all[0]?.updated,
        created: contact.created,
        deaconCareGroup: undefined,
      });
      if (contact.householdRole === "child") {
        original.children.push(contact);
      } else {
        original.parents.push(contact);
        original.familyName = contact.family?.title ?? contact.lastName;
        original.deaconCareGroup ??= contact.realms
          .find((realm) => realm.title.startsWith("Deacon Care Group - "))
          ?.title.replace("Deacon Care Group - ", "");
      }
      if ((contact._posts.all[0]?.updated ?? "") > (original.updated ?? "")) {
        original.updated = contact._posts.all[0].updated;
      }
      if (contact.created < original.created) {
        original.created = contact.created;
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
        updated?: string;
        created: string;
        deaconCareGroup?: string;
      }
    >
  );
}

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
            contact.notes = notes.slice(0, 3);
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
  )) as Exclude<Contact, "posts">;

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

export interface NoteResponseBase {
  fullDefinition: NoteDefinition;
  created: string;
  author: {
    name: string;
    _id?: string;
  };
  _id: string;
}
export interface SimpleNoteResponse extends NoteResponseBase {
  data: {
    body: string;
  };
  definition: "note";
}
export interface ConnectionNoteResponse extends NoteResponseBase {
  data: {
    comments: string;
    connectionType: string;
    connected: "yes" | "no";
    when: string;
  };
  definition: "connection";
}
export type NoteResponse = SimpleNoteResponse | ConnectionNoteResponse;

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

export async function editNote(noteId: string, body: string) {
  return authorizedApiFetch(
    `${API_URL}/content/note/${noteId}?replaceData=true`,
    {
      method: "PUT",
      body: JSON.stringify({
        _id: noteId,
        data: { body },
      }),
    }
  );
}

export function getContactAvatarUrl(contactId: string, width: number = 100) {
  return `${API_URL}/get/avatar/contact/${contactId}?w=${width}&cacheBuster=0&forceRefresh=true&access_token=${getTokenSync()}`;
}

interface ConnectionData {
  when: string;
  connectionType: string;
  connected: "yes" | "no";
  comments: string;
}

interface ConnectionRealm {
  _id: string;
  title: string;
  color?: string;
  bgColor?: string;
  status?: string;
  basic?: boolean;
  fullDefinition?: {
    title: string;
    plural: string;
    definitionName: string;
  };
  depth?: number;
  children?: any[];
}

interface ConnectionPayload {
  data: ConnectionData;
  realms: ConnectionRealm[];
  parent: string;
}

export async function createConnection(
  contactId: string,
  payload: ConnectionPayload
) {
  return authorizedApiFetch(`${API_URL}/post/${contactId}/connection`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

interface BulkEmailConnectionOptions {
  contacts: Contact[];
  comments: string;
  when?: string;
}

async function createConnectionWithRetry(
  contact: Contact,
  payload: ConnectionPayload,
  retries = 3
): Promise<void> {
  try {
    await createConnection(contact._id, payload);
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return createConnectionWithRetry(contact, payload, retries - 1);
    }
    throw error;
  }
}

async function processContactSet(
  contacts: Contact[],
  comments: string,
  when: string
): Promise<void> {
  for (const contact of contacts) {
    const payload: ConnectionPayload = {
      data: {
        when,
        connectionType: "email",
        connected: "yes",
        comments,
      },
      realms: contact.realms,
      parent: contact._id,
    };

    await createConnectionWithRetry(contact, payload);
  }
}

export async function createBulkEmailConnections({
  contacts,
  comments,
  when = new Date().toISOString(),
}: BulkEmailConnectionOptions) {
  try {
    // Split contacts into 5 sets
    const setSize = Math.ceil(contacts.length / 5);
    const contactSets = Array.from({ length: 5 }, (_, i) =>
      contacts.slice(i * setSize, (i + 1) * setSize)
    ).filter((set) => set.length > 0); // Remove empty sets

    // Process all sets in parallel
    await Promise.all(
      contactSets.map((set) => processContactSet(set, comments, when))
    );

    return { success: true as const };
  } catch (error) {
    console.error("Failed to create connections:", error);
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to create connections",
    };
  }
}

export interface ContactQuery {
  _id: string;
  title: string;
  _type: string;
  realms: {
    _id: string;
    status: string;
    title: string;
    bgColor: string;
    color: string;
  }[];
  filterConfiguration: Filter;
  filterSearch: string;
}

export async function getContactQueries() {
  const userRole = getUserRole();
  if (userRole !== "Pastoral Staff") {
    return [];
  }

  return authorizedApiFetch(`${API_URL}/query/contact/filters`, {
    method: "GET",
  }) as Promise<ContactQuery[]>;
}
