import { http, HttpResponse } from "msw";
import {
  mockContactDetail,
  mockContactListMetadata,
  mockContactLists,
  mockContactQueries,
  mockContactQueryMetadata,
  mockContacts,
  mockNotes,
  mockUser,
} from "./data.js";

export const handlers = [
  // Authentication handlers
  http.post("https://api.fluro.io/token/login", async ({ request }) => {
    const body = (await request.json()) as {
      username: string;
      password: string;
    };
    const { username, password } = body;

    // Mock successful login for test credentials
    if (username === "test@example.com" && password === "password") {
      return HttpResponse.json(mockUser);
    }

    // Mock failed login for invalid credentials
    return HttpResponse.json(
      { message: "Invalid username or password" },
      { status: 401 }
    );
  }),

  http.post("https://api.fluro.io/token/refresh", async ({ request }) => {
    const body = (await request.json()) as { refreshToken: string };
    const { refreshToken } = body;

    // Mock successful token refresh
    if (refreshToken === mockUser.refreshToken) {
      return HttpResponse.json({
        token: "mock-jwt-token-new-12345",
        refreshToken: "mock-refresh-token-new-67890",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    // Mock failed token refresh
    return HttpResponse.json(
      { message: "Invalid refresh token" },
      { status: 401 }
    );
  }),

  // Contact Lists
  http.post("https://api.fluro.io/content/mailingList/filter", () => {
    return HttpResponse.json(mockContactLists);
  }),

  // Combined handler for GET /content/get/:id with different query parameters
  http.get("https://api.fluro.io/content/get/:id", ({ params, request }) => {
    const { id } = params;
    const url = new URL(request.url);
    const type = url.searchParams.get("type");
    const appendContactDetail = url.searchParams.get("appendContactDetail");

    // Contact List Metadata (type=team)
    if (type === "team") {
      const list = mockContactListMetadata.find((list) => list._id === id);
      if (list) {
        return HttpResponse.json(list);
      }
    }

    // Contact Query Metadata (type=query)
    if (type === "query") {
      const query = mockContactQueryMetadata.find((query) => query._id === id);
      if (query) {
        return HttpResponse.json(query);
      }
    }

    // Contact Details (type=contact, appendContactDetail=all)
    if (type === "contact" && appendContactDetail === "all") {
      const contact = mockContactDetail.find((contact) => contact._id === id);
      if (contact) {
        return HttpResponse.json(contact);
      }
    }

    // Default error response
    return HttpResponse.json({ error: "Resource not found" }, { status: 404 });
  }),

  // Filter Contacts
  http.post("https://api.fluro.io/content/contact/filter", () => {
    return HttpResponse.json(mockContacts);
  }),

  // Get Notes
  http.get("https://api.fluro.io/info/posts", ({ request }) => {
    const url = new URL(request.url);
    const contact = url.searchParams.get("contact");

    if (contact) {
      const contactExists = mockContacts.find((c) => c._id === contact);
      if (contactExists) {
        return HttpResponse.json(mockNotes);
      }
    }
    return HttpResponse.json([]);
  }),

  // Create Note
  http.post("https://api.fluro.io/post/:contact/note", ({ params }) => {
    const { contact } = params;
    const contactExists = mockContacts.find((c) => c._id === contact);
    if (contactExists) {
      return HttpResponse.json({
        _id: "note-new",
        success: true,
      });
    }
    return HttpResponse.json({ error: "Contact not found" }, { status: 404 });
  }),

  // Edit Note
  http.put("https://api.fluro.io/content/note/:noteId", ({ params }) => {
    const { noteId } = params;
    const note = mockNotes.find((n) => n._id === noteId);
    if (note) {
      return HttpResponse.json({
        _id: noteId,
        success: true,
      });
    }
    return HttpResponse.json({ error: "Note not found" }, { status: 404 });
  }),

  // Delete Note
  http.delete("https://api.fluro.io/content/note/:noteId", ({ params }) => {
    const { noteId } = params;
    const note = mockNotes.find((n) => n._id === noteId);
    if (note) {
      return HttpResponse.json({ success: true });
    }
    return HttpResponse.json({ error: "Note not found" }, { status: 404 });
  }),

  // Delete Connection
  http.delete(
    "https://api.fluro.io/content/connection/:noteId",
    ({ params }) => {
      const { noteId } = params;
      const note = mockNotes.find((n) => n._id === noteId);
      if (note) {
        return HttpResponse.json({ success: true });
      }
      return HttpResponse.json(
        { error: "Connection not found" },
        { status: 404 }
      );
    }
  ),

  // Create Connection
  http.post("https://api.fluro.io/post/:contact/connection", ({ params }) => {
    const { contact } = params;
    const contactExists = mockContacts.find((c) => c._id === contact);
    if (contactExists) {
      return HttpResponse.json({
        _id: "connection-new",
        success: true,
      });
    }
    return HttpResponse.json({ error: "Contact not found" }, { status: 404 });
  }),

  // Get Contact Queries (Pastoral Staff only)
  http.get("https://api.fluro.io/query/contact/filters", () => {
    return HttpResponse.json(mockContactQueries);
  }),

  // Avatar URL (this would be handled by the browser, but we can mock the response)
  http.get(
    "https://api.fluro.io/get/avatar/contact/:contactId",
    ({ params }) => {
      const { contactId } = params;
      // Return a mock image response
      return new HttpResponse(null, {
        status: 200,
        headers: {
          "Content-Type": "image/jpeg",
        },
      });
    }
  ),
];
