
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createBulkEmailConnections, filterContacts, Contact } from '../services/contacts';
import { authorizedApiFetch } from '../services/api';

// Mock the authorizedApiFetch function
vi.mock('../services/api', () => ({
  authorizedApiFetch: vi.fn(),
}));

describe('createBulkEmailConnections', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should only create connections for parents with email addresses', async () => {
    // Arrange
    const mockContactListId = 'test-list-id';
    const mockComments = 'Test email comments';

    // Mock contacts - 2 parents, 1 child, 1 parent without email
    const mockContacts: Contact[] = [
      {
        _id: 'parent1',
        firstName: 'Parent1',
        lastName: 'Test',
        emails: ['parent1@example.com'],
        householdRole: 'parent',
        realms: [{ _id: 'realm1', title: 'Test Realm' }],
      } as Contact,
      {
        _id: 'parent2',
        firstName: 'Parent2',
        lastName: 'Test',
        emails: ['parent2@example.com'],
        householdRole: 'parent',
        realms: [{ _id: 'realm1', title: 'Test Realm' }],
      } as Contact,
      {
        _id: 'child1',
        firstName: 'Child1',
        lastName: 'Test',
        emails: ['child1@example.com'],
        householdRole: 'child',
        realms: [{ _id: 'realm1', title: 'Test Realm' }],
      } as Contact,
      {
        _id: 'parent3',
        firstName: 'Parent3',
        lastName: 'Test',
        emails: [],
        householdRole: 'parent',
        realms: [{ _id: 'realm1', title: 'Test Realm' }],
      } as Contact,
    ];

    // Mock the filterContacts function
    vi.mock('../services/contacts', async (importOriginal) => {
      const original = await importOriginal<typeof import('../services/contacts')>();
      return {
        ...original,
        filterContacts: vi.fn().mockResolvedValue(mockContacts),
      };
    });

    // Act
    const result = await createBulkEmailConnections({
      contactListId: mockContactListId,
      comments: mockComments,
    });

    // Assert
    expect(result.success).toBe(true);

    // Verify that authorizedApiFetch was called only for the parents with email addresses
    expect(authorizedApiFetch).toHaveBeenCalledTimes(2); // 2 parents with emails
    expect(authorizedApiFetch).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('/post/parent1/connection'),
      expect.any(Object)
    );
    expect(authorizedApiFetch).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('/post/parent2/connection'),
      expect.any(Object)
    );
  });
});
