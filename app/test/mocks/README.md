# MSW Mocks for Contacts Service

This directory contains Mock Service Worker (MSW) mocks for testing the contacts service API calls.

## Files

- `handlers.ts` - Main request handlers for all API endpoints
- `node.ts` - Node.js integration for MSW (used in tests)
- `browser.ts` - Browser integration for MSW (can be used in development)
- `data.ts` - Shared mock data and helper functions
- `README.md` - This documentation

## Setup

The mocks are automatically set up in `app/test/setup.ts` and will be available in all your tests.

## Available Mock Endpoints

### Contact Lists

- `POST /content/mailingList/filter` - Get contact lists
- `GET /content/get/:contactList?type=team` - Get contact list metadata
- `GET /content/get/:contactList?type=query` - Get contact query metadata

### Contacts

- `POST /content/contact/filter` - Filter contacts
- `GET /content/get/:contact?type=contact&appendContactDetail=all` - Get contact details

### Notes

- `GET /info/posts?contact=:contactId` - Get notes for a contact
- `POST /post/:contact/note` - Create a new note
- `PUT /content/note/:noteId?replaceData=true` - Edit a note
- `DELETE /content/note/:noteId` - Delete a note

### Connections

- `POST /post/:contact/connection` - Create a new connection
- `DELETE /content/connection/:noteId` - Delete a connection

### Queries

- `GET /query/contact/filters` - Get contact queries (Pastoral Staff only)

### Avatars

- `GET /get/avatar/contact/:contactId` - Get contact avatar

## Mock Data

The mocks include realistic test data:

- **Contact Lists**: 3 lists (Active Members, Deacon Care Group A, Draft List)
- **Contacts**: 3 contacts (John Doe, Jane Doe, Alice Smith) with family relationships
- **Notes**: 2 notes (1 regular note, 1 connection note)
- **Queries**: 1 query (Active Members)

## Usage in Tests

### Basic Usage

```typescript
import { describe, it, expect } from "vitest";
import { getContactLists, filterContacts } from "../services/contacts.js";

describe("Contacts Service", () => {
  it("should fetch contact lists", async () => {
    const lists = await getContactLists();
    expect(lists).toHaveLength(3);
  });

  it("should filter contacts", async () => {
    const contacts = await filterContacts();
    expect(contacts).toHaveLength(3);
  });
});
```

### Overriding Mock Responses

You can override mock responses for specific tests:

```typescript
import { server } from "./mocks/node.js";
import { http, HttpResponse } from "msw";

it("should handle errors", async () => {
  server.use(
    http.post("https://api.fluro.io/content/contact/filter", () => {
      return HttpResponse.json({ error: "Server error" }, { status: 500 });
    })
  );

  await expect(filterContacts()).rejects.toThrow();
});
```

### Using Helper Functions

```typescript
import { createMockContact, createMockNote } from "./mocks/data.js";

it("should work with custom mock data", () => {
  const customContact = createMockContact({
    firstName: "Custom",
    lastName: "Name",
  });

  const customNote = createMockNote({
    data: { body: "Custom note content" },
  });
});
```

## Mock Data Structure

### Contact

```typescript
{
  _id: string
  firstName: string
  lastName: string
  preferredName?: string
  phoneNumbers: string[]
  emails: string[]
  updated: string
  created: string
  _ss_householdID: string
  householdRole?: 'parent' | 'child'
  realms: Array<{ _id: string; title: string }>
  _posts: {
    all: Array<{
      _id: string
      _type: string
      created: string
      updated: string
      title: string
      definition: string
    }>
  }
}
```

### Note

```typescript
{
  _id: string
  fullDefinition: {
    definitionName: string
    title: string
    plural: string
    fields: Array<{
      type: string
      directive: string
      title: string
      key: string
      options?: Array<{ name: string; value: string }>
    }>
  }
  created: string
  author: {
    name: string
    _id?: string
  }
  data: Record<string, any>
  definition: 'note' | 'connection'
}
```

## Testing Different Scenarios

### Testing Error States

```typescript
it("should handle 404 errors", async () => {
  server.use(
    http.get("https://api.fluro.io/content/get/non-existent", () => {
      return HttpResponse.json({ error: "Not found" }, { status: 404 });
    })
  );

  await expect(getContact("non-existent")).rejects.toThrow();
});
```

### Testing Different User Roles

```typescript
import { vi } from "vitest";
import { getUserRole } from "../services/auth.js";

it("should return queries for pastoral staff", async () => {
  vi.mocked(getUserRole).mockReturnValue("Pastoral Staff");

  const queries = await getContactQueries();
  expect(queries).toHaveLength(1);
});
```

### Testing Family Grouping

```typescript
it("should group contacts by family", async () => {
  const contacts = await filterContacts();
  const grouped = groupContactsByFamily(contacts);

  expect(Object.keys(grouped)).toHaveLength(2); // 2 households
  expect(grouped["household-1"].parents).toHaveLength(2);
  expect(grouped["household-2"].children).toHaveLength(1);
});
```

## Development Usage

To use these mocks in development mode, you can import the browser worker:

```typescript
// In your main.tsx or similar
import { worker } from "./test/mocks/browser.js";

if (process.env.NODE_ENV === "development") {
  worker.start();
}
```

## Best Practices

1. **Reset handlers** between tests to ensure clean state
2. **Use helper functions** for creating custom mock data
3. **Test error scenarios** by overriding handlers
4. **Keep mock data realistic** to catch real-world issues
5. **Document complex scenarios** with comments in your tests

## Troubleshooting

### Common Issues

1. **Import errors**: Make sure to use `.js` extensions in imports
2. **Handler conflicts**: Use `server.resetHandlers()` between tests
3. **Type errors**: Ensure mock data matches the expected TypeScript interfaces
4. **Network errors**: Check that the API URL matches exactly

### Debugging

Enable MSW debug logging:

```typescript
// In your test setup
beforeAll(() =>
  server.listen({
    onUnhandledRequest: "error",
    // Enable debug logging
    quiet: false,
  })
);
```
