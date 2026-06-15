import { UserRole } from "@prisma/client";

// In-memory databases
export const mockUsers: any[] = [];
export const mockPapers: any[] = [
  {
    id: "test-paper-id-123",
    title: "Test Paper For Unit Tests",
    abstract: "Abstract summary for testing.",
    doi: "10.1234/test-paper",
    publicationYear: 2025,
    citationCount: 15,
    sourceUrl: "http://example.com",
    sourceProvider: "test",
    journalId: "journal-id-123",
    authors: [],
    keywords: [],
    journal: { id: "journal-id-123", name: "Nature Test" }
  },
  {
    id: "test-paper-id-456",
    title: "Another Test Paper",
    abstract: "A second abstract for analytics testing.",
    doi: "10.1234/test-paper-2",
    publicationYear: 2026,
    citationCount: 25,
    sourceUrl: "http://example.com/2",
    sourceProvider: "test",
    journalId: "journal-id-123",
    authors: [],
    keywords: [],
    journal: { id: "journal-id-123", name: "Nature Test" }
  }
];
export const mockBookmarks: any[] = [];
export const mockJournals: any[] = [{ id: "journal-id-123", name: "Nature Test" }];
export const mockKeywords: any[] = [
  { id: "keyword-1", name: "Machine Learning" },
  { id: "keyword-2", name: "Artificial Intelligence" }
];
export const mockAuthors: any[] = [
  { id: "author-1", name: "Alice Nguyen" },
  { id: "author-2", name: "Bob Tran" }
];
export const mockSettings: any[] = [];

const prismaMock = {
  user: {
    findUnique: jest.fn().mockImplementation(async (args) => {
      const { email, id } = args.where;
      const user = mockUsers.find(u => (email && u.email === email) || (id && u.id === id));
      return user || null;
    }),
    findFirst: jest.fn().mockImplementation(async (args) => {
      const email = args?.where?.email;
      const user = mockUsers.find(u => !email || u.email === email);
      return user || null;
    }),
    findMany: jest.fn().mockImplementation(async (args) => {
      return mockUsers;
    }),
    create: jest.fn().mockImplementation(async (args) => {
      const user = {
        id: `user-${Date.now()}-${Math.random()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        role: "STUDENT",
        ...args.data
      };
      mockUsers.push(user);
      return user;
    }),
    update: jest.fn().mockImplementation(async (args) => {
      const { id } = args.where;
      const idx = mockUsers.findIndex(u => u.id === id);
      if (idx !== -1) {
        mockUsers[idx] = { ...mockUsers[idx], ...args.data };
        return mockUsers[idx];
      }
      return null;
    }),
    delete: jest.fn().mockImplementation(async (args) => {
      const { id } = args.where;
      const idx = mockUsers.findIndex(u => u.id === id);
      if (idx !== -1) {
        const deleted = mockUsers[idx];
        mockUsers.splice(idx, 1);
        return deleted;
      }
      return null;
    }),
    deleteMany: jest.fn().mockImplementation(async (args) => {
      const email = args?.where?.email;
      if (email) {
        const idx = mockUsers.findIndex(u => u.email === email);
        if (idx !== -1) mockUsers.splice(idx, 1);
      }
      return { count: 1 };
    }),
  },
  paper: {
    findFirst: jest.fn().mockImplementation(async () => {
      return mockPapers[0] || null;
    }),
    findUnique: jest.fn().mockImplementation(async (args) => {
      const { id } = args.where;
      const paper = mockPapers.find(p => p.id === id);
      return paper || null;
    }),
    findMany: jest.fn().mockImplementation(async (args) => {
      if (args?.select?.publicationYear) {
        return mockPapers.map(p => ({
          publicationYear: p.publicationYear,
          citationCount: p.citationCount,
        }));
      }
      const keyword = args?.where?.OR?.[0]?.title?.contains;
      if (keyword && keyword !== "machine learning") {
        return mockPapers.filter(p => p.title.toLowerCase().includes(keyword.toLowerCase()));
      }
      return mockPapers;
    }),
    count: jest.fn().mockResolvedValue(mockPapers.length),
    aggregate: jest.fn().mockResolvedValue({ _sum: { citationCount: mockPapers.reduce((sum, paper) => sum + (paper.citationCount || 0), 0) } }),
  },
  journal: {
    count: jest.fn().mockResolvedValue(1),
    findUnique: jest.fn().mockImplementation(async (args) => {
      return mockJournals.find(j => j.id === args.where.id || j.name === args.where.name) || null;
    }),
    create: jest.fn().mockImplementation(async (args) => {
      const j = { id: `journal-${Date.now()}`, ...args.data };
      mockJournals.push(j);
      return j;
    }),
    upsert: jest.fn().mockImplementation(async (args) => {
      return mockJournals[0];
    }),
  },
  keyword: {
    count: jest.fn().mockResolvedValue(mockKeywords.length),
    findMany: jest.fn().mockResolvedValue(
      mockKeywords.map((keyword, index) => ({
        ...keyword,
        _count: { papers: index === 0 ? 2 : 1 },
      }))
    ),
  },
  author: {
    findMany: jest.fn().mockResolvedValue(
      mockAuthors.map((author, index) => ({
        ...author,
        _count: { papers: index === 0 ? 2 : 1 },
      }))
    ),
  },
  bookmark: {
    findMany: jest.fn().mockImplementation(async (args) => {
      const userId = args.where.userId;
      const userBookmarks = mockBookmarks.filter(b => b.userId === userId);
      return userBookmarks.map(b => ({
        ...b,
        paper: mockPapers.find(p => p.id === b.paperId) || mockPapers[0]
      }));
    }),
    upsert: jest.fn().mockImplementation(async (args) => {
      const { userId, paperId } = args.create;
      const existing = mockBookmarks.find(b => b.userId === userId && b.paperId === paperId);
      if (existing) return existing;
      const b = {
        id: `bookmark-${Date.now()}`,
        userId,
        paperId,
        createdAt: new Date(),
      };
      mockBookmarks.push(b);
      return b;
    }),
    delete: jest.fn().mockImplementation(async (args) => {
      const { userId_paperId } = args.where;
      if (userId_paperId) {
        const { userId, paperId } = userId_paperId;
        const idx = mockBookmarks.findIndex(b => b.userId === userId && b.paperId === paperId);
        if (idx !== -1) {
          mockBookmarks.splice(idx, 1);
        }
      }
      return { success: true };
    })
  },
  systemSetting: {
    findMany: jest.fn().mockImplementation(async () => mockSettings),
    findUnique: jest.fn().mockImplementation(async (args) => mockSettings.find(s => s.key === args.where.key)),
    create: jest.fn().mockImplementation(async (args) => {
      const s = { id: `setting-${Date.now()}`, ...args.data };
      mockSettings.push(s);
      return s;
    }),
    update: jest.fn().mockImplementation(async (args) => {
      const idx = mockSettings.findIndex(s => s.key === args.where.key);
      if (idx !== -1) {
        mockSettings[idx] = { ...mockSettings[idx], ...args.data };
        return mockSettings[idx];
      }
      return null;
    }),
    delete: jest.fn().mockImplementation(async (args) => {
      const idx = mockSettings.findIndex(s => s.key === args.where.key);
      if (idx !== -1) {
        return mockSettings.splice(idx, 1)[0];
      }
      return null;
    }),
  },
  $transaction: jest.fn().mockImplementation(async (promises) => Promise.all(promises)),
  $disconnect: jest.fn().mockResolvedValue(undefined),
};

export default prismaMock;
