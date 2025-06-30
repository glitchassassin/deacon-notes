import type { LoginResponse } from "../../services/auth";
import type {
  Contact,
  ContactQuery,
  NoteResponse,
} from "../../services/contacts";

// Mock data for contacts service tests
export const mockContactLists: Array<{
  _id: string;
  title: string;
  _type: string;
  definition: string;
  _matched: boolean;
}> = [
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
export const mockContactListMetadata: Array<{
  title: string;
  _id: string;
  _realm: string;
}> = [
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
export const mockContactQueryMetadata: Array<{
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
}> = [
  {
    title: "Recent Visitors Query",
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
      sortDirection: "asc",
      sortType: "string",
    },
  },
];

// Contact Queries
export const mockContactQueries: ContactQuery[] = [
  {
    _id: "query-1",
    title: "Recent Visitors",
    _type: "query",
    realms: [
      {
        _id: "realm-1",
        status: "active",
        title: "Recent Visitors",
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
export const mockUser: LoginResponse = {
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
export const mockContactDetail: Contact[] = [
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
    local: ["(123) 456-7890"],
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
        { _id: "contact-3", title: "Emma Doe" },
        { _id: "contact-4", title: "Liam Doe" },
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
  {
    _id: "contact-13",
    firstName: "Margaret",
    lastName: "Wilson",
    preferredName: "Maggie",
    phoneNumbers: ["+1234567896"],
    emails: ["margaret.wilson@example.com"],
    updated: "2025-04-15T11:30:00Z",
    created: "2025-01-05T09:00:00Z",
    _ss_householdID: "household-5",
    householdRole: "parent",
    local: ["(123) 456-7896"],
    details: {
      personal: {
        data: {
          firstName: "Margaret",
          lastName: "Wilson",
          preferredName: "Maggie",
        },
        items: [],
        title: "Personal Information",
        labels: {},
      },
    },
    family: {
      _id: "family-5",
      title: "Wilson Family",
      items: [{ _id: "contact-13", title: "Margaret Wilson" }],
      address: {
        addressLine1: "456 Oak Ave",
        addressLine2: "Apt 2B",
        suburb: "Anytown",
        state: "CA",
        postalCode: "12345",
      },
    },
    realms: [
      { _id: "realm-1", title: "Active Members" },
      { _id: "realm-4", title: "Homebound Ministry" },
    ],
    _posts: {
      all: [
        {
          _id: "note-11",
          _type: "connection",
          created: "2025-04-15T11:30:00Z",
          updated: "2025-04-15T11:30:00Z",
          title: "Connection",
          definition: "connection",
        },
        {
          _id: "note-12",
          _type: "note",
          created: "2025-03-20T14:00:00Z",
          updated: "2025-03-20T14:00:00Z",
          title: "Note",
          definition: "note",
        },
        {
          _id: "note-13",
          _type: "connection",
          created: "2025-02-10T16:45:00Z",
          updated: "2025-02-10T16:45:00Z",
          title: "Connection",
          definition: "connection",
        },
      ],
    },
  },
];

export const mockContacts: Contact[] = [
  // Doe Family (Parents + 2 children)
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
    local: ["(123) 456-7890"],
    realms: [
      { _id: "realm-1", title: "Active Members" },
      { _id: "realm-2", title: "Deacon Care Group - A" },
    ],
    _posts: {
      all: [
        {
          _id: "note-1",
          _type: "connection",
          created: "2025-06-15T14:30:00Z",
          updated: "2025-06-15T14:30:00Z",
          title: "Connection",
          definition: "connection",
        },
        {
          _id: "note-5",
          _type: "connection",
          created: "2025-05-08T09:30:00Z",
          updated: "2025-05-08T09:30:00Z",
          title: "Connection",
          definition: "connection",
        },
        {
          _id: "note-9",
          _type: "connection",
          created: "2025-03-28T16:30:00Z",
          updated: "2025-03-28T16:30:00Z",
          title: "Connection",
          definition: "connection",
        },
      ],
    },
  },
  {
    _id: "contact-2",
    firstName: "Jane",
    lastName: "Doe",
    preferredName: undefined,
    phoneNumbers: ["+1234567891"],
    emails: ["jane.doe@example.com"],
    updated: "2024-01-14T14:20:00Z",
    created: "2024-01-01T09:00:00Z",
    _ss_householdID: "household-1",
    householdRole: "parent",
    local: ["(123) 456-7891"],
    realms: [
      { _id: "realm-1", title: "Active Members" },
      { _id: "realm-2", title: "Deacon Care Group - A" },
    ],
    _posts: {
      all: [],
    },
  },
  {
    _id: "contact-3",
    firstName: "Emma",
    lastName: "Doe",
    preferredName: undefined,
    phoneNumbers: [],
    emails: [],
    updated: "2024-01-12T16:45:00Z",
    created: "2024-01-01T09:00:00Z",
    _ss_householdID: "household-1",
    householdRole: "child",
    local: [],
    realms: [{ _id: "realm-1", title: "Active Members" }],
    _posts: {
      all: [],
    },
  },
  {
    _id: "contact-4",
    firstName: "Liam",
    lastName: "Doe",
    preferredName: undefined,
    phoneNumbers: [],
    emails: [],
    updated: "2024-01-11T13:20:00Z",
    created: "2024-01-01T09:00:00Z",
    _ss_householdID: "household-1",
    householdRole: "child",
    local: [],
    realms: [{ _id: "realm-1", title: "Active Members" }],
    _posts: {
      all: [],
    },
  },
  // Smith Family (Single parent + 1 child)
  {
    _id: "contact-5",
    firstName: "Sarah",
    lastName: "Smith",
    preferredName: undefined,
    phoneNumbers: ["+1234567892"],
    emails: ["sarah.smith@example.com"],
    updated: "2024-01-13T11:45:00Z",
    created: "2024-01-02T10:00:00Z",
    _ss_householdID: "household-2",
    householdRole: "parent",
    local: ["(123) 456-7892"],
    realms: [
      { _id: "realm-1", title: "Active Members" },
      { _id: "realm-3", title: "Deacon Care Group - B" },
    ],
    _posts: {
      all: [
        {
          _id: "note-2",
          _type: "note",
          created: "2025-06-14T16:45:00Z",
          updated: "2025-06-14T16:45:00Z",
          title: "Note",
          definition: "note",
        },
        {
          _id: "note-6",
          _type: "note",
          created: "2025-05-07T15:45:00Z",
          updated: "2025-05-07T15:45:00Z",
          title: "Note",
          definition: "note",
        },
        {
          _id: "note-10",
          _type: "note",
          created: "2025-02-25T10:00:00Z",
          updated: "2025-02-25T10:00:00Z",
          title: "Note",
          definition: "note",
        },
      ],
    },
  },
  {
    _id: "contact-6",
    firstName: "Alice",
    lastName: "Smith",
    preferredName: undefined,
    phoneNumbers: [],
    emails: [],
    updated: "2024-01-10T09:15:00Z",
    created: "2024-01-02T10:00:00Z",
    _ss_householdID: "household-2",
    householdRole: "child",
    local: [],
    realms: [{ _id: "realm-1", title: "Active Members" }],
    _posts: {
      all: [],
    },
  },
  // Johnson Family (Parents only)
  {
    _id: "contact-7",
    firstName: "Michael",
    lastName: "Johnson",
    preferredName: "Mike",
    phoneNumbers: ["+1234567893"],
    emails: ["michael.johnson@example.com"],
    updated: "2024-01-16T08:30:00Z",
    created: "2024-01-03T11:00:00Z",
    _ss_householdID: "household-3",
    householdRole: "parent",
    local: ["(123) 456-7893"],
    realms: [
      { _id: "realm-1", title: "Active Members" },
      { _id: "realm-2", title: "Deacon Care Group - A" },
    ],
    _posts: {
      all: [
        {
          _id: "note-3",
          _type: "connection",
          created: "2025-06-12T10:15:00Z",
          updated: "2025-06-12T10:15:00Z",
          title: "Connection",
          definition: "connection",
        },
        {
          _id: "note-8",
          _type: "note",
          created: "2025-04-03T14:20:00Z",
          updated: "2025-04-03T14:20:00Z",
          title: "Note",
          definition: "note",
        },
      ],
    },
  },
  {
    _id: "contact-8",
    firstName: "Jennifer",
    lastName: "Johnson",
    preferredName: "Jen",
    phoneNumbers: ["+1234567894"],
    emails: ["jennifer.johnson@example.com"],
    updated: "2024-01-15T17:45:00Z",
    created: "2024-01-03T11:00:00Z",
    _ss_householdID: "household-3",
    householdRole: "parent",
    local: ["(123) 456-7894"],
    realms: [
      { _id: "realm-1", title: "Active Members" },
      { _id: "realm-2", title: "Deacon Care Group - A" },
    ],
    _posts: {
      all: [],
    },
  },
  // Williams Family (Single parent + 3 children)
  {
    _id: "contact-9",
    firstName: "David",
    lastName: "Williams",
    preferredName: undefined,
    phoneNumbers: ["+1234567895"],
    emails: ["david.williams@example.com"],
    updated: "2024-01-14T12:00:00Z",
    created: "2024-01-04T14:30:00Z",
    _ss_householdID: "household-4",
    householdRole: "parent",
    local: ["(123) 456-7895"],
    realms: [
      { _id: "realm-1", title: "Active Members" },
      { _id: "realm-3", title: "Deacon Care Group - B" },
    ],
    _posts: {
      all: [
        {
          _id: "note-4",
          _type: "note",
          created: "2025-06-11T13:20:00Z",
          updated: "2025-06-11T13:20:00Z",
          title: "Note",
          definition: "note",
        },
        {
          _id: "note-7",
          _type: "connection",
          created: "2025-05-04T11:00:00Z",
          updated: "2025-05-04T11:00:00Z",
          title: "Connection",
          definition: "connection",
        },
      ],
    },
  },
  {
    _id: "contact-10",
    firstName: "Sophia",
    lastName: "Williams",
    preferredName: undefined,
    phoneNumbers: [],
    emails: [],
    updated: "2024-01-09T15:30:00Z",
    created: "2024-01-04T14:30:00Z",
    _ss_householdID: "household-4",
    householdRole: "child",
    local: [],
    realms: [{ _id: "realm-1", title: "Active Members" }],
    _posts: {
      all: [],
    },
  },
  {
    _id: "contact-11",
    firstName: "Noah",
    lastName: "Williams",
    preferredName: undefined,
    phoneNumbers: [],
    emails: [],
    updated: "2024-01-08T10:45:00Z",
    created: "2024-01-04T14:30:00Z",
    _ss_householdID: "household-4",
    householdRole: "child",
    local: [],
    realms: [{ _id: "realm-1", title: "Active Members" }],
    _posts: {
      all: [],
    },
  },
  {
    _id: "contact-12",
    firstName: "Ava",
    lastName: "Williams",
    preferredName: undefined,
    phoneNumbers: [],
    emails: [],
    updated: "2025-01-07T13:20:00Z",
    created: "2025-01-04T14:30:00Z",
    _ss_householdID: "household-4",
    householdRole: "child",
    local: [],
    realms: [{ _id: "realm-1", title: "Active Members" }],
    _posts: {
      all: [],
    },
  },
  // Brown Family (Widow - homebound with health issues)
  {
    _id: "contact-13",
    firstName: "Margaret",
    lastName: "Wilson",
    preferredName: "Maggie",
    phoneNumbers: ["+1234567896"],
    emails: ["margaret.wilson@example.com"],
    updated: "2025-04-15T11:30:00Z",
    created: "2025-01-05T09:00:00Z",
    _ss_householdID: "household-5",
    householdRole: "parent",
    local: ["(123) 456-7896"],
    realms: [
      { _id: "realm-1", title: "Active Members" },
      { _id: "realm-4", title: "Homebound Ministry" },
    ],
    _posts: {
      all: [
        {
          _id: "note-11",
          _type: "connection",
          created: "2025-04-15T11:30:00Z",
          updated: "2025-04-15T11:30:00Z",
          title: "Connection",
          definition: "connection",
        },
        {
          _id: "note-12",
          _type: "note",
          created: "2025-03-20T14:00:00Z",
          updated: "2025-03-20T14:00:00Z",
          title: "Note",
          definition: "note",
        },
        {
          _id: "note-13",
          _type: "connection",
          created: "2025-02-10T16:45:00Z",
          updated: "2025-02-10T16:45:00Z",
          title: "Connection",
          definition: "connection",
        },
      ],
    },
  },
];

export const mockNotes: Record<string, NoteResponse[]> = {
  // Doe Family notes
  "contact-1": [
    {
      _id: "note-1",
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
      created: "2025-06-15T14:30:00Z",
      author: {
        name: "Deacon Johnson",
        _id: "user-2",
      },
      data: {
        comments:
          "Called to check in on the Doe family. John mentioned they're doing well and looking forward to the upcoming church picnic. Emma is excited about starting middle school next year.",
        connectionType: "phone",
        connected: "yes",
        when: "2025-06-15",
      },
      definition: "connection",
    },
    {
      _id: "note-5",
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
      created: "2025-05-08T09:30:00Z",
      author: {
        name: "Deacon Johnson",
        _id: "user-2",
      },
      data: {
        comments:
          "Called Jane Doe to follow up on the prayer request she shared last week. She's feeling much better and thanked the church for their support during her recovery.",
        connectionType: "phone",
        connected: "yes",
        when: "2025-05-08",
      },
      definition: "connection",
    },
    {
      _id: "note-9",
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
      created: "2025-03-28T16:30:00Z",
      author: {
        name: "Deacon Johnson",
        _id: "user-2",
      },
      data: {
        comments:
          "Called to check on the Doe family after the holidays. John mentioned they had a wonderful Christmas with extended family visiting. The kids received new bikes and are enjoying their winter break.",
        connectionType: "phone",
        connected: "yes",
        when: "2025-03-28",
      },
      definition: "connection",
    },
  ],
  // Smith Family notes
  "contact-5": [
    {
      _id: "note-2",
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
      created: "2025-06-14T16:45:00Z",
      author: {
        name: "Pastor Smith",
        _id: "user-1",
      },
      data: {
        body: "Had a great conversation with Sarah Smith about her recent job promotion. She's been feeling overwhelmed with the new responsibilities and appreciated the prayer support. Alice is doing well in school and has joined the youth choir.",
      },
      definition: "note",
    },
    {
      _id: "note-6",
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
      created: "2025-05-07T15:45:00Z",
      author: {
        name: "Pastor Smith",
        _id: "user-1",
      },
      data: {
        body: "Met with Sarah Smith for coffee. She's been going through a difficult time since her husband passed away but is finding strength in Christ. Alice is adjusting well to the new school and has made some good friends.",
      },
      definition: "note",
    },
    {
      _id: "note-10",
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
      created: "2025-02-25T10:00:00Z",
      author: {
        name: "Pastor Smith",
        _id: "user-1",
      },
      data: {
        body: "Christmas Day service was well attended. Sarah Smith and Alice came to the service and seemed to enjoy the children's program. Sarah mentioned she's been reading the Bible more regularly and finding comfort in the scriptures.",
      },
      definition: "note",
    },
  ],
  // Johnson Family notes
  "contact-7": [
    {
      _id: "note-3",
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
      created: "2025-06-12T10:15:00Z",
      author: {
        name: "Deacon Johnson",
        _id: "user-2",
      },
      data: {
        comments:
          "Visited the Johnson family at their home. Mike and Jen are planning a family vacation and asked for prayer for safe travels. They're also considering joining the small group ministry.",
        connectionType: "visit",
        connected: "yes",
        when: "2025-06-12",
      },
      definition: "connection",
    },
    {
      _id: "note-8",
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
      created: "2025-04-03T14:20:00Z",
      author: {
        name: "Pastor Smith",
        _id: "user-1",
      },
      data: {
        body: "Had lunch with Mike and Jen Johnson. They're considering starting a Bible study group for young families. Their marriage is strong and they're looking for ways to serve the church community.",
      },
      definition: "note",
    },
  ],
  // Williams Family notes
  "contact-9": [
    {
      _id: "note-4",
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
      created: "2025-06-11T13:20:00Z",
      author: {
        name: "Pastor Smith",
        _id: "user-1",
      },
      data: {
        body: "David Williams called to discuss his children's involvement in Sunday school. Sophia, Noah, and Ava are all enjoying their classes. David mentioned he's been struggling with work-life balance and appreciated the support.",
      },
      definition: "note",
    },
    {
      _id: "note-7",
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
      created: "2025-05-04T11:00:00Z",
      author: {
        name: "Deacon Johnson",
        _id: "user-2",
      },
      data: {
        comments:
          "Visited the Williams family. David is working long hours but making time for his kids. The children are doing well in school and are excited about the upcoming Christmas program.",
        connectionType: "visit",
        connected: "yes",
        when: "2025-05-04",
      },
      definition: "connection",
    },
  ],
  // Brown Family notes (Widow - homebound with health issues)
  "contact-13": [
    {
      _id: "note-11",
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
      created: "2025-04-15T11:30:00Z",
      author: {
        name: "Deacon Johnson",
        _id: "user-2",
      },
      data: {
        comments:
          "Called Margaret to check in. She's been struggling with her arthritis and hasn't been able to attend church for the past few weeks. She mentioned feeling isolated and would appreciate more regular phone calls. Her daughter visits on weekends but she's alone during the week.",
        connectionType: "phone",
        connected: "yes",
        when: "2025-04-15",
      },
      definition: "connection",
    },
    {
      _id: "note-12",
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
      created: "2025-03-20T14:00:00Z",
      author: {
        name: "Pastor Smith",
        _id: "user-1",
      },
      data: {
        body: "Visited Margaret at her home. She's been dealing with increased pain from her arthritis and is having difficulty getting around. Her spirits are low since her husband passed away last year. She's grateful for the church's support but feels disconnected from the community. Need to arrange for communion to be brought to her home and coordinate with the homebound ministry team.",
      },
      definition: "note",
    },
    {
      _id: "note-13",
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
      created: "2025-02-10T16:45:00Z",
      author: {
        name: "Deacon Johnson",
        _id: "user-2",
      },
      data: {
        comments:
          "Called Margaret to see how she's doing. She's been feeling better since starting her new medication but still has difficulty with mobility. She mentioned missing the church community and would like to receive the weekly bulletin by email. Her daughter has been helping her set up video calls so she can participate in Sunday services remotely.",
        connectionType: "phone",
        connected: "yes",
        when: "2025-02-10",
      },
      definition: "connection",
    },
  ],
};

// Helper function to create mock contact with custom data
export function createMockContact(overrides: Partial<Contact> = {}): Contact {
  return {
    _id: "contact-mock",
    firstName: "Mock",
    lastName: "Contact",
    preferredName: undefined,
    phoneNumbers: [],
    emails: [],
    updated: "2024-01-01T00:00:00Z",
    created: "2024-01-01T00:00:00Z",
    _ss_householdID: "household-mock",
    householdRole: "parent",
    local: ["(555) 123-4567"],
    realms: [],
    _posts: {
      all: [],
    },
    ...overrides,
  };
}

// Helper function to create mock note with custom data
export function createMockNote(
  overrides: Partial<NoteResponse> = {}
): NoteResponse {
  const baseNote: NoteResponse = {
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
  };

  return {
    ...baseNote,
    ...overrides,
  } as NoteResponse;
}

// Helper function to get notes for a specific contact
export function getMockNotesForContact(contactId: string): NoteResponse[] {
  return mockNotes[contactId] || [];
}
