/**
 * In-memory repository implementation.
 *
 * This is a reference implementation for development and testing.
 * Replace with your preferred database (Supabase, Prisma, Deno KV, etc.)
 *
 * Example: To switch to Supabase, create a `supabase.ts` that implements
 * the same UserRepository interface using the Supabase client.
 */
import type { User, UserRepository } from "./types.ts";

// Sample seed data
const SEED_USERS: User[] = [
  { id: "1", email: "alice@example.com", name: "Alice Johnson", role: "admin", status: "active", createdAt: "2024-01-15T00:00:00Z", updatedAt: "2024-01-15T00:00:00Z" },
  { id: "2", email: "bob@example.com", name: "Bob Smith", role: "user", status: "active", createdAt: "2024-02-20T00:00:00Z", updatedAt: "2024-02-20T00:00:00Z" },
  { id: "3", email: "carol@example.com", name: "Carol White", role: "user", status: "inactive", createdAt: "2024-03-10T00:00:00Z", updatedAt: "2024-03-10T00:00:00Z" },
  { id: "4", email: "david@example.com", name: "David Brown", role: "editor", status: "active", createdAt: "2024-04-05T00:00:00Z", updatedAt: "2024-04-05T00:00:00Z" },
  { id: "5", email: "eve@example.com", name: "Eve Davis", role: "user", status: "active", createdAt: "2024-05-22T00:00:00Z", updatedAt: "2024-05-22T00:00:00Z" },
];

class InMemoryUserRepository implements UserRepository {
  private users: Map<string, User>;
  private nextId = 6;

  constructor(seed: User[] = SEED_USERS) {
    this.users = new Map(seed.map(u => [u.id, { ...u }]));
  }

  async list(): Promise<User[]> {
    return [...this.users.values()];
  }

  async getById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async getByEmail(email: string): Promise<User | null> {
    for (const u of this.users.values()) {
      if (u.email === email) return u;
    }
    return null;
  }

  async create(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const now = new Date().toISOString();
    const user: User = {
      ...data,
      id: String(this.nextId++),
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(user.id, user);
    return user;
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const existing = this.users.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...data, id, updatedAt: new Date().toISOString() };
    this.users.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.users.delete(id);
  }
}

/** Singleton user repository instance. */
export const userRepository: UserRepository = new InMemoryUserRepository();
