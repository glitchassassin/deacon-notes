import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createConnection,
  createNote,
  deleteConnection,
  deleteNote,
  editNote,
  enrichWithNotes,
  filterContacts,
  getContact,
  getContactLists,
  getContactQueries,
  getContactsListMetadata,
  getContactsQueryMetadata,
  getNotes,
  groupContactsByFamily,
} from "../services/contacts.js";
import { server } from "./mocks/node.js";

// Mock the auth service to avoid authentication issues in tests
vi.mock("../services/auth.js", () => ({
  getToken: vi.fn(() => Promise.resolve("mock-token")),
  getTokenSync: vi.fn(() => "mock-token"),
  getUserRole: vi.fn(() => "Pastoral Staff"),
  logout: vi.fn(() => {
    throw new Error("Mock logout called");
  }),
}));

describe("Contacts Service", () => {
  beforeEach(() => {
    // Reset handlers before each test
    server.resetHandlers();
  });

  describe("getContactLists", () => {
    it("should fetch contact lists successfully", async () => {
      const lists = await getContactLists();

      expect(lists).toHaveLength(3);
      expect(lists[0]).toEqual({
        _id: "list-1",
        title: "Active Members",
        _type: "mailingList",
        definition: "mailingList",
        _matched: true,
      });
    });

    it("should handle API errors", async () => {
      server.use(
        http.post("https://api.fluro.io/content/mailingList/filter", () => {
          return HttpResponse.json({ error: "Server error" }, { status: 500 });
        })
      );

      await expect(getContactLists()).rejects.toThrow();
    });
  });

  describe("getContactsListMetadata", () => {
    it("should fetch contact list metadata successfully", async () => {
      const metadata = await getContactsListMetadata("list-1");

      expect(metadata).toEqual({
        title: "Active Members",
        _id: "list-1",
        _realm: "realm-1",
      });
    });

    it("should handle non-existent contact list", async () => {
      await expect(getContactsListMetadata("non-existent")).rejects.toThrow();
    });
  });

  describe("getContactsQueryMetadata", () => {
    it("should fetch contact query metadata successfully", async () => {
      const metadata = await getContactsQueryMetadata("query-1");

      expect(metadata.title).toBe("Active Members Query");
      expect(metadata.filterConfiguration).toBeDefined();
      expect(metadata.filterSort.sortKey).toBe("lastName");
    });
  });

  describe("filterContacts", () => {
    it("should filter contacts with default options", async () => {
      const contacts = await filterContacts();

      expect(contacts).toHaveLength(3);
      expect(contacts[0].firstName).toBe("John");
      expect(contacts[0].lastName).toBe("Doe");
    });

    it("should filter contacts with custom options", async () => {
      const contacts = await filterContacts({
        search: "John",
        sort: {
          sortKey: "firstName",
          sortType: "string",
          sortDirection: "asc",
        },
      });

      expect(contacts).toBeDefined();
    });

    it("should filter contacts by contact list", async () => {
      const contacts = await filterContacts({ contactList: "list-1" });

      expect(contacts).toBeDefined();
    });
  });

  describe("getContact", () => {
    it("should fetch contact details successfully", async () => {
      const contact = await getContact("contact-1");

      expect(contact.firstName).toBe("John");
      expect(contact.lastName).toBe("Doe");
      expect(contact.family).toBeDefined();
      expect(contact.details).toBeDefined();
    });

    it("should handle non-existent contact", async () => {
      await expect(getContact("non-existent")).rejects.toThrow();
    });
  });

  describe("getNotes", () => {
    it("should fetch notes for a contact", async () => {
      const notes = await getNotes("contact-1");

      expect(notes).toHaveLength(2);
      expect(notes[0].definition).toBe("note");
      expect(notes[1].definition).toBe("connection");
    });

    it("should return empty array for contact without notes", async () => {
      const notes = await getNotes("contact-2");

      expect(notes).toEqual([]);
    });
  });

  describe("createNote", () => {
    it("should create a new note successfully", async () => {
      const result = await createNote("contact-1", "Test note content");

      expect(result).toBeDefined();
    });
  });

  describe("editNote", () => {
    it("should edit an existing note successfully", async () => {
      const result = await editNote("note-1", "Updated note content");

      expect(result).toBeDefined();
    });
  });

  describe("deleteNote", () => {
    it("should delete a note successfully", async () => {
      const result = await deleteNote("note-1");

      expect(result.success).toBe(true);
    });
  });

  describe("createConnection", () => {
    it("should create a new connection successfully", async () => {
      const payload = {
        data: {
          when: "2024-01-15",
          connectionType: "phone",
          connected: "yes" as const,
          comments: "Test connection",
        },
        realms: [{ _id: "realm-1", title: "Active Members" }],
        parent: "contact-1",
      };

      const result = await createConnection("contact-1", payload);

      expect(result).toBeDefined();
    });
  });

  describe("deleteConnection", () => {
    it("should delete a connection successfully", async () => {
      const result = await deleteConnection("note-2");

      expect(result.success).toBe(true);
    });
  });

  describe("getContactQueries", () => {
    it("should fetch contact queries for pastoral staff", async () => {
      const queries = await getContactQueries();

      expect(queries).toHaveLength(1);
      expect(queries[0].title).toBe("Active Members");
    });
  });

  describe("groupContactsByFamily", () => {
    it("should group contacts by family correctly", async () => {
      const contacts = await filterContacts();
      const grouped = groupContactsByFamily(contacts);

      expect(Object.keys(grouped)).toHaveLength(2); // 2 households
      expect(grouped["household-1"].parents).toHaveLength(2);
      expect(grouped["household-1"].children).toHaveLength(0);
      expect(grouped["household-2"].children).toHaveLength(1);
    });
  });

  describe("enrichWithNotes", () => {
    it("should enrich contacts with notes", async () => {
      const contacts = await filterContacts();
      const grouped = groupContactsByFamily(contacts);
      const enriched = await enrichWithNotes(grouped);

      expect(enriched).toBeDefined();
      // The enrichment should add notes to contacts that have posts
    });
  });

  describe("Error handling", () => {
    it("should handle network errors gracefully", async () => {
      server.use(
        http.post("https://api.fluro.io/content/contact/filter", () => {
          return HttpResponse.error();
        })
      );

      await expect(filterContacts()).rejects.toThrow();
    });

    it("should handle 401 unauthorized errors", async () => {
      server.use(
        http.post("https://api.fluro.io/content/contact/filter", () => {
          return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
        })
      );

      await expect(filterContacts()).rejects.toThrow();
    });
  });
});
