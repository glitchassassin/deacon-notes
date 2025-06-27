// Mock data for contacts service tests
export const mockContactLists = [
  {
    _id: "list-1",
    title: "Active Members",
    _type: "mailingList",
    definition: "mailingList",
    _matched: true,
  },
  {
    _id: "list-2",
    title: "Deacon Care Group A",
    _type: "mailingList",
    definition: "mailingList",
    _matched: true,
  },
  {
    _id: "list-3",
    title: "Draft List",
    _type: "mailingList",
    definition: "mailingList",
    _matched: false,
  },
];

// Contact List Metadata
export const mockContactListMetadata = [
  {
    title: "Active Members",
    _id: "list-1",
    _realm: "realm-1",
  },
  {
    title: "Deacon Care Group A",
    _id: "list-2",
    _realm: "realm-2",
  },
  {
    title: "Draft List",
    _id: "list-3",
    _realm: "realm-3",
  },
];

// Contact Query Metadata
export const mockContactQueryMetadata = [
  {
    title: "Active Members Query",
    _id: "query-1",
    _realm: "realm-1",
    filterConfiguration: {
      operator: "and",
      filters: [
        {
          operator: "and",
          filters: [
            {
              key: "status",
              comparator: "in",
              values: ["active"],
              guid: "guid-1",
              title: "Status",
              value: null,
              value2: null,
            },
          ],
          guid: "guid-2",
        },
      ],
    },
    filterSearch: "",
    filterSort: {
      sortKey: "lastName",
      sortDirection: "asc" as const,
      sortType: "string",
    },
  },
];

// Contact Queries
export const mockContactQueries = [
  {
    _id: "query-1",
    title: "Active Members",
    _type: "query",
    realms: [
      {
        _id: "realm-1",
        status: "active",
        title: "Active Members",
        bgColor: "#4CAF50",
        color: "#FFFFFF",
      },
    ],
    filterConfiguration: {
      operator: "and",
      filters: [
        {
          operator: "and",
          filters: [
            {
              key: "status",
              comparator: "in",
              values: ["active"],
              guid: "guid-1",
              title: "Status",
              value: null,
              value2: null,
            },
          ],
          guid: "guid-2",
        },
      ],
    },
    filterSearch: "",
  },
];

// Mock authentication data
export const mockUser = {
  _id: "user-1",
  name: "John Doe",
  email: "john.doe@example.com",
  firstName: "John",
  lastName: "Doe",
  accountType: "user",
  verified: true,
  account: {
    _id: "account-1",
    title: "Test Church",
    color: "#4CAF50",
  },
  permissionSets: {
    "permission-set-1": {
      permissions: ["read:contacts", "write:notes"],
      _id: "permission-set-1",
      title: "Deacon Permissions",
    },
  },
  token: "mock-jwt-token-12345",
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
  refreshToken: "mock-refresh-token-67890",
};

// Detailed contact data for individual contact requests
export const mockContactDetail = [
  {
    _id: "contact-1",
    firstName: "John",
    lastName: "Doe",
    preferredName: "Johnny",
    phoneNumbers: ["+1234567890"],
    emails: ["john.doe@example.com"],
    updated: "2024-01-15T10:30:00Z",
    created: "2024-01-01T09:00:00Z",
    _ss_householdID: "household-1",
    householdRole: "parent",
    details: {
      personal: {
        data: {
          firstName: "John",
          lastName: "Doe",
          preferredName: "Johnny",
        },
        items: [],
        title: "Personal Information",
        labels: {},
      },
    },
    family: {
      _id: "family-1",
      title: "Doe Family",
      items: [
        { _id: "contact-1", title: "John Doe" },
        { _id: "contact-2", title: "Jane Doe" },
      ],
      address: {
        addressLine1: "123 Main St",
        addressLine2: null,
        suburb: "Anytown",
        state: "CA",
        postalCode: "12345",
      },
    },
    realms: [
      { _id: "realm-1", title: "Active Members" },
      { _id: "realm-2", title: "Deacon Care Group - A" },
    ],
    _posts: {
      all: [
        {
          _id: "post-1",
          _type: "contact",
          created: "2024-01-01T09:00:00Z",
          updated: "2024-01-15T10:30:00Z",
          title: "John Doe",
          definition: "contact",
        },
      ],
    },
  },
];

export const mockContacts = [
  {
    _id: "contact-1",
    firstName: "John",
    lastName: "Doe",
    preferredName: "Johnny",
    phoneNumbers: ["+1234567890"],
    emails: ["john.doe@example.com"],
    updated: "2024-01-15T10:30:00Z",
    created: "2024-01-01T09:00:00Z",
    _ss_householdID: "household-1",
    householdRole: "parent",
    realms: [
      { _id: "realm-1", title: "Active Members" },
      { _id: "realm-2", title: "Deacon Care Group - A" },
    ],
    _posts: {
      all: [
        {
          _id: "post-1",
          _type: "contact",
          created: "2024-01-01T09:00:00Z",
          updated: "2024-01-15T10:30:00Z",
          title: "John Doe",
          definition: "contact",
        },
      ],
    },
  },
  {
    _id: "contact-2",
    firstName: "Jane",
    lastName: "Doe",
    preferredName: null,
    phoneNumbers: ["+1234567891"],
    emails: ["jane.doe@example.com"],
    updated: "2024-01-14T14:20:00Z",
    created: "2024-01-01T09:00:00Z",
    _ss_householdID: "household-1",
    householdRole: "parent",
    realms: [
      { _id: "realm-1", title: "Active Members" },
      { _id: "realm-2", title: "Deacon Care Group - A" },
    ],
    _posts: {
      all: [
        {
          _id: "post-2",
          _type: "contact",
          created: "2024-01-01T09:00:00Z",
          updated: "2024-01-14T14:20:00Z",
          title: "Jane Doe",
          definition: "contact",
        },
      ],
    },
  },
  {
    _id: "contact-3",
    firstName: "Alice",
    lastName: "Smith",
    preferredName: null,
    phoneNumbers: ["+1234567892"],
    emails: ["alice.smith@example.com"],
    updated: "2024-01-13T11:45:00Z",
    created: "2024-01-02T10:00:00Z",
    _ss_householdID: "household-2",
    householdRole: "child",
    realms: [{ _id: "realm-1", title: "Active Members" }],
    _posts: {
      all: [
        {
          _id: "post-3",
          _type: "contact",
          created: "2024-01-02T10:00:00Z",
          updated: "2024-01-13T11:45:00Z",
          title: "Alice Smith",
          definition: "contact",
        },
      ],
    },
  },
];

export const mockNotes = [
  {
    _id: "note-1",
    fullDefinition: {
      definitionName: "note",
      title: "Note",
      plural: "Notes",
      fields: [
        {
          type: "text",
          directive: "textarea",
          title: "Body",
          key: "body",
        },
      ],
    },
    created: "2024-01-10T15:30:00Z",
    author: {
      name: "Pastor Smith",
      _id: "user-1",
    },
    data: {
      body: "Had a great conversation about upcoming events.",
    },
    definition: "note",
  },
  {
    _id: "note-2",
    fullDefinition: {
      definitionName: "connection",
      title: "Connection",
      plural: "Connections",
      fields: [
        {
          type: "text",
          directive: "textarea",
          title: "Comments",
          key: "comments",
        },
        {
          type: "select",
          directive: "select",
          title: "Connection Type",
          key: "connectionType",
          options: [
            { name: "Phone Call", value: "phone" },
            { name: "Email", value: "email" },
            { name: "Visit", value: "visit" },
          ],
        },
        {
          type: "select",
          directive: "select",
          title: "Connected",
          key: "connected",
          options: [
            { name: "Yes", value: "yes" },
            { name: "No", value: "no" },
          ],
        },
        {
          type: "date",
          directive: "date",
          title: "When",
          key: "when",
        },
      ],
    },
    created: "2024-01-08T12:00:00Z",
    author: {
      name: "Deacon Johnson",
      _id: "user-2",
    },
    data: {
      comments: "Called to check in on family",
      connectionType: "phone",
      connected: "yes" as const,
      when: "2024-01-08",
    },
    definition: "connection",
  },
];

// Helper function to create mock contact with custom data
export function createMockContact(
  overrides: Partial<(typeof mockContacts)[0]> = {}
) {
  return {
    _id: "contact-mock",
    firstName: "Mock",
    lastName: "Contact",
    preferredName: null,
    phoneNumbers: [],
    emails: [],
    updated: "2024-01-01T00:00:00Z",
    created: "2024-01-01T00:00:00Z",
    _ss_householdID: "household-mock",
    householdRole: "parent",
    realms: [],
    _posts: {
      all: [],
    },
    ...overrides,
  };
}

// Helper function to create mock note with custom data
export function createMockNote(overrides: Partial<(typeof mockNotes)[0]> = {}) {
  return {
    _id: "note-mock",
    fullDefinition: {
      definitionName: "note",
      title: "Note",
      plural: "Notes",
      fields: [],
    },
    created: "2024-01-01T00:00:00Z",
    author: {
      name: "Mock Author",
      _id: "user-mock",
    },
    data: {
      body: "Mock note content",
    },
    definition: "note",
    ...overrides,
  };
}
