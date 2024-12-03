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

export async function getContactsList(contactList: string) {
  const results = (await authorizedApiFetch(
    `${API_URL}/content/get/${contactList}?type=team&appendContactDetail=all&appendAssignments=all`,
    {
      method: "GET",
    }
  )) as {
    title: string;
    provisionalMembers: {
      title: string;
      created: string;
      updated: string;
      firstName: string;
      lastName: string;
      preferredName: string;
      _type: string;
      status: string;
      realms: string[];
      _id: string;
    }[];
  };

  return results;
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
